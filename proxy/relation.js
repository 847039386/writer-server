const Relation = require('../models').Relation;
const UserNotify = require('./user_notify');
const User = require('../models').User;
const Config = require('../config');


/**
 * 用户关注。
 * @param {*} from_user_id 关注者（粉丝）
 * @param {*} to_user_id   被关注者（大佬）
 */
const addFollow = (from_user_id ,to_user_id) => {
    return new Promise((resolve ,reject) => {
        // 默认0为关注
        Relation.create({ from_user_id ,to_user_id },function(err ,data){
            if(err){
                reject(err.message)
            }else{
                User.findByIdAndUpdate(to_user_id,{ $inc :{ "count.follow" : 1 }} ,{ new :true ,fields : 'follow' }).exec((uerr,udata) =>{
                    if(uerr){
                        reject(uerr.message)
                    }else{
                        if(udata){
                            resolve(udata)
                        }else{
                            reject('并没有找到修改值')
                        }
                    }
                })        
            }
        })
    })
}

/**
 *  
 * @param {*} id 关系表ID
 * @param {*} to_user_id  被关注者ID（大佬）
 */
const undoFollow = (id ,to_user_id) => {
    return new Promise((resolve ,reject) => {
        Relation.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                reject(err.message)
            }else{
                if(data){
                    User.findByIdAndUpdate(to_user_id,{ $inc :{ "count.follow" : -1 }} ,{ new :true ,fields : 'count.follow' }).exec((uerr,udata) =>{
                        if(uerr){
                            reject(uerr.message)
                        }else{
                            if(udata){
                                resolve(udata)
                            }else{
                                reject('并没有找到修改值')
                            }
                        }
                    }) 
                }else{
                    reject('错误的ID')
                }
            }
        })
    })
}

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let relationPromise = new Promise((resolve ,reject) => {
        Relation.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
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
        Relation.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([relationPromise,countPromise]).then((result) => {
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

/**
 * 当未关注时关注，关注时则撤销
 * @param {*} from_user_id 粉丝
 * @param {*} to_user_id   大佬
 */
const follow = (from_user_id ,to_user_id) => {
    return new Promise((resolve ,reject) => {
        Relation.findOne({ from_user_id ,to_user_id ,rel_type : 1 }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })            
            }else{
                if(data){
                    // 有值则取消关注
                    undoFollow(data._id ,to_user_id).then((followData) => {
                        resolve({success :true ,data :false})  
                    }).catch((followErr) => {
                        resolve({success :false ,msg :Config.debug ? followErr.message :'未知错误' })
                    })
                }else{
                    // 无值则添加关注
                    addFollow(from_user_id,to_user_id).then(async (followData) => {
                        await UserNotify.createFansRemind(from_user_id,'follow',to_user_id)      // 发送消息
                        resolve({success :true ,data :true})
                    }).catch((followErr) => {
                        resolve({success :false ,msg :Config.debug ? followErr.message :'未知错误' })
                    })
                }
            }
        })
    })
}

const isfollow = (from_user_id ,to_user_id) => {
    return new Promise((resolve ,reject) => {
        Relation.findOne({ from_user_id ,to_user_id ,rel_type : 1 }).exec((err ,data) => {
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


module.exports = {
    follow ,find ,isfollow
}