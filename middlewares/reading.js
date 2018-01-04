const Drama = require('../proxy').Drama
const Config = require('../config')

const expiration_time = 1 * 60 * 60 * 5;             //到期时间，秒为单位,这里设置五小时

// 开启此功能必须设置nginx获取用户真实ip即可
const drama = async ( ctx , next ) => {
    let drama_id = ctx.query.id; 
    let ips = ctx.headers['x-forwarded-for'];
    if(ips && drama_id){
        try {
            let ip_regular = /^(\d+\.\d+\.\d+\.\d+)/;
            let ip_validate = ip_regular.exec(ips)
            if(ip_validate && ip_validate[0]){
                let ip = ip_validate[0];        // 用户的真实ip
                let isReading = await ctx.redis.get(`reading-${drama_id}-${ip}`);
                if(isReading){
                    // 该IP浏览过了
                    await next();
                }else{
                    // 该IP未浏览
                    Drama.addReadingCount(drama_id).then((result) => {
                        if(result.success){
                            ctx.redis.set(`reading-${drama_id}-${ip}`,Date.now(),'EX',expiration_time);
                        }
                    })
                    await next();
                }
            }else{
                await next();
            }
        } catch (error) {
            await next();
        }
    }else{
        await next();
    }
}

module.exports = {
    drama,
}