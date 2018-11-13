const ReplyComment = require('../proxy').ReplyComment;
const Handling = require('../common').Handling;
const reckonScore = require('../common').Score

const add = async (ctx, next) => { 
    let cid = ctx.request.body.cid;     // 评论ID
    let did = ctx.request.body.did;     // 剧本id
    let rt = ctx.request.body.rt;       // 是回复评论 还是回复回复人
    let content = ctx.request.body.content; //内容
    let rid = ctx.request.body.rid          // 评论id 或回复ID
    let from_uid = ctx.request.body.from_uid // 回复用户 也就是该用户
    let to_uid = ctx.request.body.to_uid //目标ID 也就是要通知的这个人
    let result = { success :false };
    if( to_uid && from_uid && cid && content ){
        result = await ReplyComment.create({
            comment_id : cid,    
            drama_id : did,
            reply_type : rt || 0,   
            content : content,
            reply_id : rid,        
            from_uid :from_uid, 
            to_uid :to_uid 
        })
        if(result.success){
            const createAt = ctx.request.body.create_at;
            const score = reckonScore.heat(createAt,1)    
            if(score > 0 && did){
                const isSCORE = await ctx.redis.zrank(`DRAMA-SCORE-LIST`,`${did}`);
                if(isSCORE == null){
                    await ctx.redis.zadd(`DRAMA-SCORE-LIST`,score,`${did}`);
                }else{
                    await ctx.redis.zincrby("DRAMA-SCORE-LIST",score,`${did}`);
                }
            }
        }


    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 


const find = async (ctx, next) => { 
    let cid = ctx.query.cid;
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await ReplyComment.find(cid,page,size);
    ctx.body = result;
} 


module.exports = {
    add,
    find
}