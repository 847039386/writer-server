const CommentSCH = require('../models').Comment;
const ReplyCommentModel = require('../models').ReplyComment;
const Drama = require('../models').Drama;
const UserNotify = require('./user_notify');
const Config = require('../config');
const Async = require('async');

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

const create = (user_id ,drama_id ,content) => {
    return new Promise((resolve ,reject) => {
        CommentSCH.create({ user_id ,drama_id ,content },function(err ,commentData){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                // 因为评论失败(剧本ID不存在)会直接报错所以同步查找下数据添加消息
                Drama.findById(drama_id,'_id user_id').then(async (data) => {
                    if(data.user_id.toString() !== user_id.toString()){
                        await UserNotify.createRemind({
                            type : 2,
                            sender : user_id,
                            targetType : 'comment',
                            action : 'normal',
                            user_id : data.user_id,
                            drama_id : drama_id,
                            content : content,
                            opids :{
                                one : commentData._id,
                            }
                        })
                    }
                })
                resolve({ data :commentData , success :true })
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

// 获得评论与 评论回复
const getCommentAndReply = ( drama_id , page ,pageSize) => {
    pageSize = pageSize || 10;
    const realPage = page <= 0 ? 0 : page - 1;
    return new Promise((resolve ,reject) => {
        Async.auto({
            getComment : (callback) => {            // 获取该剧本下 评论 10条数据
                CommentSCH.find({ drama_id })
                .limit(pageSize)
                .skip(realPage * pageSize)
                .lean()
                .populate({ path :'user_id' ,select:'avatar name' })
                .sort({'create_at' :-1 })
                .exec((err ,comments) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null,comments)
                    }
                })
            },
            getCommentPagination : (callback) => {      // 获取改剧本下的所有评论数量
                CommentSCH.count({ drama_id }).exec((err ,data) => {
                    if(err){
                        callback(err)
                    }else{
                        callback(null,data)
                    }
                })
            },
            getReply : ['getComment',(result ,callback) => {
                let comments = result.getComment;
                if(comments.length > 0){
                    Async.map(comments ,function(comment ,cb){
                        ReplyCommentModel.find({ comment_id :comment._id })
                        .populate({ path :'from_uid' ,select:'avatar name' })
                        .populate({ path :'to_uid' ,select:'name' })
                        .sort({'create_at' :-1 })
                        .limit(10)
                        .skip(0)
                        .exec((err ,rc_dosc) => {
                            if(err){
                                cb(null,[])
                            }else{
                                cb(null,rc_dosc);
                            }
                        })
                    },(err, arrReply ) => {
                        callback(null,arrReply);
                    })
                }else{
                    callback(null,[])
                }
            }],
            getReplyPagination : ['getComment',(result ,callback) => {
                let comments = result.getComment;
                if(comments.length > 0){
                    Async.map(comments ,function(comment ,cb){
                        ReplyCommentModel.count({ comment_id :comment._id }).exec((err ,data) => {
                            if(err){
                                cb(err)
                            }else{
                                cb(null,data)
                            }
                        })
                    },(err, arrReply ) => {
                        callback(null,arrReply);
                    })
                }else{
                    callback(null,[])
                }
            }]
        },(err ,result) => {
            if(!err){
                let comments = result.getComment;
                let commentPagination = result.getCommentPagination
                let replys = result.getReply;
                let replyPagination = result.getReplyPagination;
                if(comments.length > 0){
                    comments.map((comment ,idx) => {
                        let replysData = {
                            data : {
                                list : replys[idx],
                                pagination : {
                                    total :replyPagination[idx],
                                    current :1,
                                    size :10 
                                }
                            }
                        }
                        comment = Object.assign(comment,{ replys :replysData })
                        return comment;
                    });
                }else{
                    comments = [];
                }
                resolve({ 
                    success :true ,
                    data : {
                        list :comments,
                        pagination : { total :commentPagination,current :page  ,size :pageSize }
                    },
                })
            }else{
                resolve({ success :false , msg :'错误的'})
            }
        })
    })
}


module.exports = {
    find ,create ,removeById ,remove ,getCommentAndReply
}