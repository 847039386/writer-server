const Collect = require('../models').Collect;
const Drama = require('../models').Drama
const UserNotifyModel = require('../models').UserNotify
const Config = require('../config');
const UserNotify = require('./user_notify')
const Async = require('async')

const isLike = (drama_id , user_id) => {
    return new Promise((resolve ,reject) => {
        Collect.findOne({ drama_id ,user_id ,rel_type : { $in : [0,1]} }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })            
            }else{
                if(data){
                    resolve({success :true ,data :true}) 
                }else{
                    resolve({success :true ,data :false}) 
                }
            }
        })
    })
}

// 如果收藏了则取消 否则则收藏
const collect = ( drama_id , user_id ) =>{
    return new Promise((resolve ,reject) => {
         Async.auto({
                isCollect : (callback) => {          // 查看是否收藏
                    Collect.findOne({drama_id , user_id ,rel_type : 1}).select('rel_type').exec((err , docs) => {
                        if(err){
                            callback(err)
                        }else{
                            callback(null,docs)
                        }
                    })
                },
                updateCollect : ['isCollect',(result , callback)=>{
                    const collectData = result.isCollect
                    if(collectData){                   // 如果有收藏
                        Async.auto({ 
                            removeCollect : (cb) => {     // 删除收藏
                                Collect.findByIdAndRemove(collectData._id).exec((err ,docs) => { 
                                    if(err){
                                        cb(err)
                                    }else{
                                        cb(null , docs)
                                    }
                                })
                            },
                            removeDramaCollectCount : (cb) => {    // 将剧本的收藏数 -1
                                Drama.findByIdAndUpdate(drama_id
                                    ,{ $inc : { "count.collect" : -1 } }
                                    ,{ new :true ,fields : '_id' })
                                 .exec((err , docs) => {
                                    if(err){
                                        cb(err) 
                                    }else{
                                        cb(null,docs) 
                                    }
                                })
                            }
                        },(err ,result) => {
                            if(err){
                                callback(err)
                            }else{
                                callback(null,false)            // 取消收藏
                            }
                        })
                    }else{
                        Async.auto({ 
                            createCollect : (cb) => {     // 创建收藏
                                Collect.create({ drama_id ,user_id ,rel_type :1 },function(err ,docs){ 
                                    if(err){
                                        cb(err)
                                    }else{
                                        cb(null,docs)
                                    }
                                })
                            },
                            addDramaCollectCount : (cb) => {    // 将剧本的收藏数 +1
                                Drama.findByIdAndUpdate(drama_id
                                    ,{ $inc : { "count.collect" : 1 } }
                                    ,{ new :true ,fields : '_id user_id' })
                                 .exec((err , docs) => {
                                    if(err){
                                        cb(err) 
                                    }else{
                                        cb(null,docs) 
                                    }
                                })
                            },
                            sendRemind : ['addDramaCollectCount',(res,cb) => {      // 给主人发送提醒.
                                const drama = res.addDramaCollectCount;
                                if(drama.user_id){
                                    UserNotifyModel.create({
                                        type : 2,
                                        sender : user_id,
                                        targetType : 'drama',
                                        action : 'collect',
                                        user_id : drama.user_id,
                                        drama_id : drama_id,
                                    },(err, data) => { 
                                        cb(null)
                                    })
                                }else{
                                    cb(null)
                                }
                            }]
                        },(err,result) => {
                            if(err){
                                callback(err)
                            }else{
                                callback(null,true)             //加入收藏
                            }
                        })
                    }
                }],
            },(err , result) => {
                if(err){
                    resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
                }else{
                    let col = result.updateCollect;     // ture为假如收藏 false为取消收藏
                    resolve({ success:true , data :col , msg : col ? '收藏成功' : '取消收藏' })
                }
            })
    })
 }


const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let dramasLikePromise = new Promise((resolve ,reject) => {
        Collect.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort(options.sort || { 'weight' :-1 ,'create_at' :-1 })
             .select(options.select || '')
             .populate(options.populate || '')
             .exec((err ,dramas) => {
                if(err){
                    reject(err)
                }else{
                    resolve(dramas)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Collect.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([dramasLikePromise,countPromise]).then((result) => {
            resolve({ 
                data : {
                    list : result[0],
                    pagination : { total :result[1],current :page || 1 ,size :pageSize }
                },
                success :true
            })
        }).catch((err) => {
            resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
        })
    })

}




module.exports = {
    isLike ,find ,collect
}