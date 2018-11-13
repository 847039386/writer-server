const ReplyComment = require('../models').ReplyComment;
const Drama = require('../models').Drama;
const UserNotify = require('../models').UserNotify;
const Config = require('../config');
const Async = require('async');

const find = (comment_id ,page ,pageSize ,options) => {
    options = options || {};
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    let replyCommentsPromise = new Promise((resolve ,reject) => {
        ReplyComment.find(options.query || { comment_id })
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .populate({ path :'from_uid' ,select:'avatar name' })
             .populate({ path :'to_uid' ,select:'name' })
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
        ReplyComment.count(options.query || { comment_id }).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([replyCommentsPromise,countPromise]).then((result) => {
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

const create = (reply_Comment) => {
    return new Promise((resolve ,reject) => {
        Async.auto({
            setReplyComment : (callback) => {          // 创建一条评论回复
                ReplyComment.create(reply_Comment,function(err ,data){
                    if(err){
                        callback(err)
                    }else{
                        callback(null,data)
                    }
                })
            },
            setMessage : ['setReplyComment',(result , callback)=>{
                let replyData = result.setReplyComment
                let drama_id = replyData.drama_id;
                let sender = replyData.from_uid;
                let content = replyData.content;
                let user_id = replyData.to_uid;
                UserNotify.create({ 
                    type :2 
                    ,action :'reply' 
                    ,targetType : 'comment' 
                    ,drama_id 
                    ,sender 
                    ,content 
                    ,user_id 
                    ,opids :{
                        one : replyData.comment_id,
                        two : replyData._id
                    }
                },(err, data) => {
                    if(err){
                        callback(err)
                    }else{  
                        callback(null,data)
                    }
                })
            }],
            incCommentCount :  ['setReplyComment',(result , callback)=>{
                let replyData = result.setReplyComment;
                let drama_id = replyData.drama_id;
                Drama.findByIdAndUpdate(drama_id,{ 
                    $inc : { "count.comment" : 1 }
                }).exec((err , data) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null,data)
                    }
                })
            }],
        },(err , result) => {
            let data = result.setReplyComment;
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}

module.exports = {
    create,
    find
}