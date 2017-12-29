const CommentSCH = require('../models').Comment;
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

module.exports = {
    find ,create ,removeById
}