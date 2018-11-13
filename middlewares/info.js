const { Topic ,Drama ,User ,Chapter ,Book ,Category } = require('../proxy')
const Config = require('../config')


const expiration_time = 1 * 60 * 60 * 5;             //到期时间，秒为单位,这里设置五小时


// 开启此功能必须设置nginx获取用户真实ip即可
const home = async ( ctx , next ) => {
    let result = await ctx.redis.get(`DRAMA-HOME-DATA`);
    if ( result ){
        result = JSON.parse(result)
    } else {
        const hot = await ctx.redis.zrevrange('DRAMA-SCORE-LIST',0,10);
        let hotPromise = function (){
            if(hot.length < 10){
                return Drama.find(1,15 ,{
                    query :{ status :0 ,ustatus :0 }
                    ,select :'title description count uv status ustatus create_at'
                    ,sort :{ 'create_at' : -1 }
                    ,populate : { path :'category_id book_id user_id' ,select:'name avatar' } 
                })
            }else{
                return Drama.findDramasByArray(hot,{
                    populate : { path :'category_id book_id user_id' ,select:'name avatar' }
                })
            }
        }
        result = await Promise.all([
            // 热门剧本
            hotPromise()
            // 热门编剧
            ,User.find(1,5,{
                select :'avatar name follow'
                ,sort :{ 'count.follow' : -1  }
            })
            // 最新剧本
            ,Drama.find(1,14,{ 
                select :'title'
                ,sort :{ 'create_at' : -1 }
                ,query :{ status :0 ,ustatus :0 }
            })
            // 周排行榜
            ,Drama.find(1,10,{ 
                select :'title'
                ,sort :{ 'reading_week_count' : -1  }
                ,query :{ status :0 ,ustatus :0 }
            })
            // 月排行榜
            ,Drama.find(1,10,{ 
                select :'title'
                ,sort :{ 'reading_month_count' : -1  }
                ,query :{ status :0 ,ustatus :0 }
            })
            // 最近更新过剧集的剧本
            // ,Chapter.find(1,5,{ 
            //     select :'title description'
            //     ,sort :{ 'create_at' : -1 }
            //     ,populate : { path :'drama_id' ,select:'title description book_id' ,populate: { path: 'book_id' } } 
            // })
            ,Chapter.latelyUpdateDrama()
            ,Drama.getMaxCategoryCount()
        ])
        ctx.redis.set(`DRAMA-HOME-DATA`,JSON.stringify(result),'EX',1 * 60 * 60);
    }
    ctx.homeData = result;
    await next();
}



module.exports = {
    home
}