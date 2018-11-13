const UserNotify = require('../models').UserNotify;


/**
 * 像某个用户插入一条公告
 * @param {String} content  内容
 * @param {String} user_id  消息所属者ID
 * 
 * 例如 ：用户在创建剧本完成后。发送用户一条 ： 你创建了《剧本》
 */
const createUserAnnounce = ( content , user_id ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        UserNotify.create({ content ,user_id ,type :1 },(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
}


/**
 * 根据剧本ID向消息所属者插入一条提醒记录 ( type ：2 代表 这是条提醒消息)
 * 
 * @param {String} sender      消息发送者ID
 * @param {String} action      订阅动作
 * @param {String} user_id     消息所属者ID
 * @param {String} drama_id    剧本ID
 * @param {String} content     内容(选填)
 * 
 * 例如 sender              action           user_id      drama_id    targetType     
 *      用户A    like(喜欢)、comment(评论)   用户B(你)的    《剧本》    这篇文章(drama)
 */

 const createRemind = ( notify ) => {
    let result = { success :false };
    notify = notify || {  }
    return new Promise((resolve ,reject) => {
        UserNotify.create(notify,(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
 }

 /**
 * 根据粉丝功能像某个用户插入一条提醒记录
 * 
 * @param {String} sender      消息发送者ID
 * @param {String} action      订阅动作
 * @param {String} user_id     消息所属者ID
 * 
 * 例如    sender     action         user_id
 *        (用户A)   (follow)关注了    用户B(你)   
 */

const createFansRemind = ( sender ,action ,user_id  ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        UserNotify.create({ type :2 , action ,targetType : 'fans' ,sender ,user_id },(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
 }

// 发送私信
 const createUserPrivateLetter = ( sender ,user_id ,content,action  ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        UserNotify.create({ type :3 , action ,targetType : 'letter' ,sender ,user_id ,content },(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
 }

 const createAdminPrivateLetter = ( user_id ,content ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        UserNotify.create({ type :3 , action :'normal' ,targetType : 'admin' ,user_id ,content },(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
 }








/**
 * 查询所有消息
 * 
 * @param {Number} page         页数
 * @param {String} pageSize     每页显示的最大数量
 * @param {Object} options      查询的配置
 * 
 */

 const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let userNotifyPromise = new Promise((resolve ,reject) => {
        UserNotify.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort( options.sort || {})
             .select(options.select || '')
             .populate(options.populate || '')
             .exec((err ,topics) => {
                if(err){
                    reject(err)
                }else{
                    resolve(topics)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        UserNotify.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([userNotifyPromise,countPromise]).then((result) => {
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
 * 删除指定ID的所有消息，这里不做安全处理，在controller里做安全处理
 * 
 * @param {String|[String]} notifys      需要删除的数组id
 * 
 */

const findUserIDAndRemove = ( user_id ) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        if( user_id ){
            UserNotify.remove({ user_id },(err, data) => {
                if(err){
                    resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
                }else{  
                    resolve(Object.assign(result,{ success :true ,data :data }));
                }
            })
        }else{
            resolve(Object.assign(result,{ msg :'删除属性为空' }));
        }
    });
}

const removeByID = ( id ) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        if( id ){
            UserNotify.findByIdAndRemove(id).exec((err ,data) => {
                if(err){
                    resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
                }else{  
                    resolve(Object.assign(result,{ success :true ,data :data }));
                }
            })
        }else{
            resolve(Object.assign(result,{ msg :'删除属性为空' }));
        }
    });
}

const create = (notify) => {
    let result = { success :false }
    return new Promise((resolve ,reject) => {
        UserNotify.create(notify,(err, data) => { 
            if(err){
                resolve(Object.assign(result,{ msg :'创建失败' }));
            }else{
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
}

module.exports = {
    find,
    createUserAnnounce,
    createRemind,
    createFansRemind,
    findUserIDAndRemove,
    createUserPrivateLetter,
    createAdminPrivateLetter,
    removeByID,
    create
}