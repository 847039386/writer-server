const User = require('../models').User;
const AdmLog = require('../models').Log;
const UserNotify = require('../models').UserNotify;
const Async =require('async')
const Config = require('../config');

const find = (options) => {
    let result = { success :false , msg :'未知错误' }
    const realPage = options.page <= 0 ? 0 : options.page - 1;
    const pageSize = options.pageSize || 10;
    const query = options.query || {}
    const field = options.field || '';
    const populate = options.populate || '';
    const sort = options.sort || ''
    return new Promise((resolve ,reject) => {
        Async.auto({
            getData : ( callback ) => {
                User.find(query)
                    .limit(pageSize || 10)
                    .skip(realPage * pageSize)
                    .sort(sort)
                    .select(field)
                    .populate(populate)
                    .exec((err ,docs) => {
                        if(err){
                            callback(err)
                        }else{
                            callback(null,docs)
                        }
                    })
            },
            getPagination : (callback) => {
                User.count(query).exec((err ,count) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null,{ total :count ,current :options.page || 1 ,size :pageSize })
                    }
                }) 
            }
        },(err ,results) => {
            if(err){
                result = { 
                        success :false , 
                        msg : err.message ,
                        data : { 
                            list :[] ,
                            pagination :{ total :0 ,current :1 ,size :10 }
                        }
                }
            }else{
                result = {
                    data : {
                        list : results.getData,
                        pagination : results.getPagination
                    },
                    success :true
                }
            }
            resolve(result);
        })
    })
}

const create = (name ,avatar) => {
    return new Promise((resolve ,reject) => {
        User.create({ name ,avatar },function(err ,data){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data :data , success :true })
            }
        })
    })
}

const updateByID = (id ,newData ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        User.findByIdAndUpdate(id,newData,options).exec((err ,data) => {
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

const findById = ( id ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        User.findById( id )
            .select(options.select || '')
            .exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data : data , success :true })
            }
        })
    })
}

/**
 * 管理员限制用户登陆
 * @method constraintLogin  
 * @param {Object} option 选项 
 * @return {Promise} promise对象
 * @example 
 * option.id userid
 * option.adminid 管理员id 
 * option.status 剧本的管理状态
 * option.log 日志备注
 * option.message 像用户发送消息
 */
const constraintLogin = (option) => {
    const id = option.id;
    const status = option.status;
    const log = option.log;
    const message = option.message || '';
    const adminid = option.adminid || '';
    return new Promise((resolve ,reject) => {
        Async.auto({
            // 修改剧本
            update : ( callback ) => {
                User.findByIdAndUpdate(id,{ status },{ new :true }).exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            // 当前剧本是否有日志
            isLog : (callback) => {
                AdmLog.findOne({ type :'user' ,opid : id }).exec((err ,dosc) => {
                    if(err){
                        callback(err)
                    }else{
                        if(dosc){
                            callback(null,dosc._id);
                        }else{
                            callback(null,null);
                        }
                    }
                })
            },
            // 给用户发送信息
            sendMessage :(callback) => {
                if(message && id){
                    UserNotify.create({ type :3 , action :'normal' ,targetType : 'admin' ,user_id :id ,content :message },(err, dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }else{
                    callback(null,message);
                }
            },
            // 添加日志信息
            recordLog :['isLog',(results ,callback) => {
                let logid = results.isLog;      // 如果有值则得到查找到的日志ID
                if(logid){
                    AdmLog.findByIdAndUpdate(logid,{ 
                        $push : {
                            log : {
                                adminid,
                                content :log
                            }
                        }
                    }).exec((err ,dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }else{
                    AdmLog.create({ opid :id ,type :'user' ,log : [{ adminid ,content :log }] },(err ,dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }
            }]
        },(err ,results) => {
            let result = { success :false , msg :'未知错误' }
            if(err){
                result = Object({ msg : err.message });
            }else{
                const data = results.update;
                result = { success :true ,data }
            }
            resolve(result);
        })
    })
}

module.exports = {
    create,
    findById,
    find,
    updateByID,
    constraintLogin
}