const Comment = require('../proxy').Comment;
const Handling = require('../common').Handling;
const reckonScore = require('../common').Score

const findByDramaID = async (ctx, next) => { 
    let result = { success :false };
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let id = ctx.query.id;
    if( id ){
        result = await Comment.find(id ,page ,size,{ populate : { path :'user_id' ,select: { _id :0 ,name:1 ,avatar :1 } } });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const create = async (ctx, next) => { 
    let uid = ctx.request.body.uid;
    let did = ctx.request.body.did;
    let content = Handling.strLength(ctx.request.body.content ,5000);
    let result = { success :false };
    if( uid && did && content ){
        result = await Comment.create(uid ,did ,content);
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

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Comment.removeById(id)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}


const getCommentAndReply = async (ctx, next) => { 
    let result = { success :false };
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let id = ctx.query.id;
    if( id ){
        result = await Comment.getCommentAndReply(id,page,size);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

module.exports = {
    findByDramaID,
    create,
    removeById,
    getCommentAndReply
}