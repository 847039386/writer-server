const reckonScore = require('../common').Score;
const UserNotify = require('../proxy').UserNotify;
const Drama = require('../proxy').Drama

/**
 * 点赞 + 0.5分
 */
const thumbsUp = async (ctx, next) => { 
    const drama_id = ctx.request.body.did;          // 剧本ID
    const createAt = ctx.request.body.createAt;     // 剧本发布时间
    const uid = ctx.USERID;                         // 用户ID
    const sid = ctx.request.body.sid;               // 该该剧本的ID
    if(drama_id && createAt && uid){
        const start = await ctx.redis.sismember(`DRAMA-LIKE-ID-${drama_id}`,uid);
        if(!start){
            await ctx.redis.sadd(`DRAMA-LIKE-ID-${drama_id}`,uid);
            const score = reckonScore.heat(createAt,0.5)  
            if(score > 0){
                const isSCORE = await ctx.redis.zrank(`DRAMA-SCORE-LIST`,`${drama_id}`);
                if(isSCORE == null){
                    await ctx.redis.zadd(`DRAMA-SCORE-LIST`,score,`${drama_id}`);
                }else{
                    await ctx.redis.zincrby("DRAMA-SCORE-LIST",score,`${drama_id}`);
                }
            }
            if(uid && sid){
                // 剧本赞 +1
                await Drama.updateById(drama_id,{ 
                    $inc : { 
                        "count.like" : 1 
                    }
                },{ fields :'count create_at' })
                // 给用户发送提醒
                if(uid != sid){
                    UserNotify.create({
                        type : 2,
                        sender : uid,
                        targetType : 'drama',
                        action : 'like',
                        user_id : sid,
                        drama_id : drama_id,
                    })
                }
            }
        }
    }
    ctx.body = {
        success : true,
    }
}

module.exports = {
    thumbsUp
}