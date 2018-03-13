const CommentSCH = require('../models').Comment;
const Drama = require('../models').Drama;
const UserNotify = require('./user_notify')
const Config = require('../config');

const find = (drama_id ,page ,pageSize ,options) => {
    options = options || {};
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    let commentsPromise = new Promise((resolve ,reject) => {
        CommentSCH.find(options.query || { drama_id })
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .populate(options.populate || '')
             .sort({'create_at' :-1 })
             .exec((err ,comments) => {
                if(err){
                    reject(err)
                }else{
                    resolve(comments)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        CommentSCH.count(options.query || { drama_id }).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([commentsPromise,countPromise]).then((result) => {
            resolve({ 
                data : result[0],
                pagination : { total :result[1],current :page || 1 ,size :pageSize },
                success :true
            })
        }).catch((err) => {
            resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
        })
    })

}

const create = (user_id ,drama_id ,content) => {
    return new Promise((resolve ,reject) => {
        CommentSCH.create({ user_id ,drama_id ,content },function(err ,data){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                // 因为评论失败(剧本ID不存在)会直接报错所以同步查找下数据添加消息
                Drama.findById(drama_id,'_id user_id').then(async (data) => {
                    if(data.user_id){
                        await UserNotify.createDramaRemind(user_id, 'comment' ,data.user_id ,drama_id ,content)
                    }
                })
                resolve({ data :data , success :true })
            }
        })
    })
}

const removeById = (id) => {
    return new Promise((resolve ,reject) => {
        CommentSCH.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}



const remove = (conditions) => {
    return new Promise((resolve ,reject) => {
        if(conditions){
            CommentSCH.remove(conditions).exec((err ,data) => {
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


module.exports = {
    find ,create ,removeById ,remove
}