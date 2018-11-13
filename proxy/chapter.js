const { Chapter ,Drama } = require('../models');
const Config = require('../config');
const Async = require('async');

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let chaptersPromise = new Promise((resolve ,reject) => {
        Chapter.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort(options.sort || { 'chapterorder' :1 })
             .select(options.select || 'chapterorder title create_at')
             .populate(options.populate || '')
             .exec((err ,chapters) => {
                if(err){
                    reject(err)
                }else{
                    resolve(chapters)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Chapter.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([chaptersPromise,countPromise]).then((result) => {
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

const create = (drama_id ,title ,content ) => {
    return new Promise((resolve ,reject) => {
        Chapter.findOne({drama_id }).sort({'chapterorder' :-1 }).select({ _id : 0,chapterorder:1 }) .exec((err ,cap) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                Chapter.create({ drama_id ,title ,content ,chapterorder : cap ? cap.chapterorder +1 : 1 ,wordCount:content ? content.length : 0 },function(errcre ,data){
                    if(errcre){
                        resolve({ success:false , msg :Config.debug ? errcre.message :'未知错误' })
                    }else{
                        resolve({ data :data , success :true })
                    }
                })
            }
        })       
    })
}


/**
 * 
 * @param {*} beginID 目标的ID
 * @param {*} endID   移动的ID
 */
const updateOrder = ( beginID ,endID  ) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        if( beginID ){
            if(endID){
                twoOrderID(beginID,endID).then((result) => {
                    resolve(result)
                })
            }else{
                oneOrderID(beginID).then((result) => {
                    resolve(result)
                })
            }
        }else{
            resolve(Object.assign(result,{ msg :'目标值不能为空' }))
        }    
    })
}

const oneOrderID = (beginID) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        Chapter.findById(beginID,'chapterorder drama_id').exec((err ,data) => {
            if(!err && data){
                let drama_id = data.drama_id;
                let currentOrd = data.chapterorder;
                Chapter.update({drama_id ,chapterorder : { $lt : currentOrd } },{ $inc :{ chapterorder : 1  } },{multi:true}).exec((erru ,updata) => {
                    if(erru){
                        resolve({success :false ,err :Config.debug ? erru.message :'未知错误'})
                    }else{
                        if(updata.ok > 0){
                            Chapter.findByIdAndUpdate(beginID,{ chapterorder :1 },{ fields :'_id' }).exec((errbyu ,upda) => {
                                if(!errbyu){
                                    resolve({success :true ,data :updata})
                                }else{
                                    resolve(Object.assign(result,{ msg :Config.debug ? errbyu.message :'未知错误' }))
                                }
                            })
                        }else{
                            resolve({success :false , msg:'未生效'})
                        }
                    }
                })
            }else if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }))
            }else{
                resolve(Object.assign(result,{ msg : '参数错误' }))
            }
        })
    })
}

const twoOrderID = (beginID ,endID) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        Chapter.find({ _id : { $in :[ beginID ,endID ]} },'chapterorder drama_id',{ sort :{chapterorder :1 } }).exec((err ,datas) => {
            if(!err && datas.length == 2){
                let drama_id = datas[0].drama_id
                let conditions ={ };    // 范围
                let update = { };   // 修改规则
                let beginOrd ;  // 目标的序号
                let endOrd ; // 前往的序号
                let status = false
                if( beginID == datas[0]._id ){
                    beginOrd = datas[0].chapterorder
                    endOrd = datas[1].chapterorder  
                    conditions = { drama_id , chapterorder :{ $gt : beginOrd ,$lte :endOrd } }
                    update = { $inc :{ chapterorder : -1 }}    
                }else{
                    status = true
                    beginOrd = datas[1].chapterorder
                    endOrd = datas[0].chapterorder  
                    conditions = { drama_id , chapterorder :{ $gt : endOrd ,$lt :beginOrd } }
                    update = { $inc :{ chapterorder : 1  }}
                }
                Chapter.update(conditions,update,{multi:true}).exec((erru ,updatas) => {
                    if(erru){
                        resolve({success :false ,err :Config.debug ? erru.message :'未知错误'})
                    }else{
                        if(updatas.ok > 0){
                            Chapter.findByIdAndUpdate(beginID,{ chapterorder :status ? endOrd + 1 :endOrd },{ fields :'_id' }).exec((errbyu ,upda) => {
                                if(!errbyu){
                                    resolve({success :true ,data :updatas})
                                }else{
                                    resolve(Object.assign(result,{ msg :Config.debug ? errbyu.message :'未知错误' }))
                                }
                            })
                        }else{
                            resolve({success :false , msg:'未生效'})
                        }
                        
                    }
                })
            }else if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }))
            }else{
                resolve(Object.assign(result,{ msg : '参数错误' }))
            }
        })



        
    })
}




const findById = (id ,options) => {
    options = options || { };
    return new Promise((resolve ,reject) => {
        Chapter.findById(id).lean()
             .populate(options.populate || '')
             .select(options.select || '')
             .exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true , data :data})
                }else{
                    resolve({ success :false , msg :'错误的ID'})
                }
                
            }
        })
    })
}


const removeById = (id) => {
    return new Promise((resolve ,reject) => {
        Chapter.findByIdAndRemove(id,{select :{ _id :0 ,chapterorder :1 ,drama_id :1 }}).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    Chapter.update({ drama_id :data.drama_id ,chapterorder :{ $gt : data.chapterorder }},{ $inc :{ chapterorder :-1 }},{multi:true}).exec((erru ,updatas) => {
                        if(erru){
                            resolve({ success:false , msg :Config.debug ? erru.message :'未知错误' })
                        }else{
                            resolve({ success :true , data :updatas})
                        }
                    })
                }else{
                    resolve({ success :false , msg :'错误的键值'})
                }
            }
        })
    })
}

const updateById = (id ,newData ,options ) => {
    return new Promise((resolve ,reject) => {
        Chapter.findByIdAndUpdate(id ,newData ,options).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true , data :data})
                }else{
                    resolve({ success :false , msg :'错误的ID'})
                }
            }
        })      
    })
}

const remove = (conditions) => {
    return new Promise((resolve ,reject) => {
        if(conditions){
            Chapter.remove(conditions).exec((err ,data) => {
                if(err){
                    resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
                }else{
                    resolve({ success :true , data :data})
                }
            })
        }else{
            resolve({ success :false , msg :'错误的conditions'})
        } 
    })
}


const chapterAndDirectory = (id ,did) => {
    return new Promise((resolve ,reject) => {
        Async.auto({
            getChapter : (callback) => {            
                Chapter.findById(id)
                .populate({
                    path :'drama_id'
                    ,select :'title description like_count comment_count reading_count create_at'
                    ,populate : { path :'category_id book_id user_id' ,select:'name avatar' } 
                })
                .exec((err ,dosc) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null, dosc)
                    }
                })
            },
            getChapters : (callback) => {     
                Chapter.find({ drama_id :did }).sort({ 'chapterorder' : 1}).exec((err ,dosc) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null, dosc)
                    }
                })
            }
        },(err ,result) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :{ chapter : result.getChapter ,chapters:result.getChapters }})
            }
        })
    })
}


/**
 * 最新更新的剧集。。剧本去重
 * @param size 条数 默认5
 */
const latelyUpdateDrama = (size) => {
    size = size || 5;
    return new Promise((resolve ,reject) => {
        Chapter.aggregate([
            {$sort: {"create_at": 1,}},
            {
                $group: { 
                    _id: "$drama_id"
                    ,drama_id :{ $last :"$drama_id"}
                    ,chapter_id :{ $last:"$_id" }
                    ,title :{ $last :"$title" }
                },
            },
            {$sort: {"create_at":  -1,}},
        ]).skip(0).limit(size).exec((err,dosc) => {
            if(err){
                resolve({ success :false , msg :Config.debug ? err.message :'未知错误'})
            }else{
                Chapter.populate(dosc,{ 
                    path :'drama_id' 
                    ,model :Drama 
                    ,select :'title description' 
                    ,populate : {
                        path :'book_id'
                        ,select :'name' 
                    }
                },(errP,populatedTransactions) => {
                    if(errP){
                        resolve({ success :false , msg :Config.debug ? errP.message :'未知错误'})
                    }else{
                        resolve({ success :true ,data :{ list :populatedTransactions } })
                    }
                })
                
            }
        })
    })
}


module.exports = {
    find ,create ,removeById ,findById ,updateById ,updateOrder ,remove ,chapterAndDirectory ,latelyUpdateDrama
}