const ReplyComment = require('../proxy').ReplyComment;
const Handling = require('../common').Handling;

const add = async (ctx, next) => { 
    let cid = ctx.request.body.cid.toString();     // 评论ID
    let did = ctx.request.body.did.toString();     // 剧本id
    let rt = ctx.request.body.rt;       // 是回复评论 还是回复回复人
    let content = ctx.request.body.content.toString(); //内容
    let rid = ctx.request.body.rid.toString()          // 评论id 或回复ID
    let from_uid = ctx.request.body.from_uid.toString() // 回复用户 也就是该用户
    let to_uid = ctx.request.body.to_uid.toString() //目标ID 也就是要通知的这个人
    let result = { success :false };
    if(to_uid == from_uid){
        result = Object.assign(result ,{ msg :'不可以自己评论自己' });
    }else if( to_uid && from_uid && cid && content ){
        result = await ReplyComment.create({
            comment_id : cid,    
            drama_id : did,
            reply_type : rt || 0,   
            content : content,
            reply_id : rid,        
            from_uid :from_uid, 
            to_uid :to_uid 
        })
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 


module.exports = {
    add
}