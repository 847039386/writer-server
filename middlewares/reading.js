const Drama = require('../proxy').Drama;
const Config = require('../config');
const reckonScore = require('../common').Score


// UV浏览 加热度 0.2
const drama = async ( ctx , next ) => {
    let drama_id = ctx.query.id; 
    const onlyid = ctx.cookies.get('onlyid');           // 获取唯一服务器给用户的唯一标识符
    const redisKey = await ctx.redis.sismember(`DRAMA-UV-ID-${drama_id}`,onlyid);
    if(redisKey === 1){
        await next();    // 浏览过
    }else{
        Drama.addReadingCount(drama_id).then(async (result) => {
            if(result.success){
                const createAt = result.data.create_at;
                const score = reckonScore.heat(createAt,0.1)
                ctx.redis.sadd(`DRAMA-UV-ID-${drama_id}`,onlyid);
                if(score > 0){
                    const isSCORE = await ctx.redis.zrank(`DRAMA-SCORE-LIST`,`${drama_id}`);
                    if(isSCORE == null){
                        await ctx.redis.zadd(`DRAMA-SCORE-LIST`,score,`${drama_id}`);
                    }else{
                        await ctx.redis.zincrby("DRAMA-SCORE-LIST",score,`${drama_id}`);
                    }
                }
            }
        })
        await next();
    }
}


module.exports = {
    drama,
}