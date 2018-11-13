const { Drama } = require('../proxy');
const Config = require('../config'); 



// 首页
const index = async ( ctx , next ) => {
    const result = ctx.homeData;
    const remen = result[0].data.list;         // 热门
    const authors = result[1].data.list        // 最佳编剧
    const zuixin = result[2].data.list           // 最新剧本
    const weekRanking = result[3].data.list     // 周排行
    const monthRanking = result[4].data.list         // 月排行
    const newsChapter = result[5].data.list          // 最近剧集更新
    const hotCategory = result[6]          // 热门的剧情信息
    let hotCategoryList = []

    if(hotCategory.length > 0) {
        hotCategoryList = await Drama.hotCategoryData(hotCategory,3);
    }

    await ctx.render('index', {
        remen  
        ,authors
        ,zuixin
        ,weekRanking
        ,monthRanking
        ,newsChapter
        ,hotCategory
        ,hotCategoryList
    })
}

const login = async ( ctx , next ) => {
    let referer = ctx.header.referer;
    ctx.session.login_referer = referer
    const wx = {
        appid :Config.OAuth.weixin.appID,
        redirectUri : Config.OAuth.weixin.redirectURL,
        state : "1*$*0",
        baseSite :'https://open.weixin.qq.com/connect/qrconnect'
    }
    const qq = {
        appid :Config.OAuth.qq.appID,
        redirectUri : Config.OAuth.qq.redirectURL,
        state : '1*$*0',
        baseSite :'https://graph.qq.com/oauth2.0/authorize'
    }


    if(ctx.session.user){
        await ctx.redirect('/')
    }else{
        await ctx.render('login', { 
            wx : {
                href :`${wx.baseSite}?appid=${wx.appid}&redirect_uri=${wx.redirectUri}&response_type=code&scope=snsapi_login&state=${wx.state}#wechat_redirect`
            },
            qq : {
                href: `${qq.baseSite}?response_type=code&client_id=${qq.appid}&state=${qq.state}&redirect_uri=${qq.redirectUri}`
            }
        })
    }
}

const register = async ( ctx , next ) => {
    let referer = ctx.header.referer;
    ctx.session.login_referer = referer
    const wx = {
        appid :Config.OAuth.weixin.appID,
        redirectUri : Config.OAuth.weixin.redirectURL,
        state : "1*$*0",
        baseSite :'https://open.weixin.qq.com/connect/qrconnect'
    }
    const qq = {
        appid :Config.OAuth.qq.appID,
        redirectUri : Config.OAuth.qq.redirectURL,
        state : '1*$*0',
        baseSite :'https://graph.qq.com/oauth2.0/authorize'
    }
    if(ctx.session.user){
        await ctx.redirect('/')
    }else{
        await ctx.render('register', { 
            wx : {
                href :`${wx.baseSite}?appid=${wx.appid}&redirect_uri=${wx.redirectUri}&response_type=code&scope=snsapi_login&state=${wx.state}#wechat_redirect`
            },
            qq : {
                href: `${qq.baseSite}?response_type=code&client_id=${qq.appid}&state=${qq.state}&redirect_uri=${qq.redirectUri}`
            }
        })
    }
} 



const userHome =  async ( ctx , next ) => {
    let referer = ctx.header.referer;
    let user = ctx.session.user;
    await ctx.render('user/index', {  })
}




module.exports = {
    index
    ,login
    ,userHome
    ,register
}