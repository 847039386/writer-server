const { UserAuth } = require('../proxy');
const JWT = require('../common/jwt');
const Config = require('../config');

const loginout = async ( ctx , next ) => {
    if(ctx.session.user && ctx.session.user._id){
        ctx.redis.del(`TOKEN-USER-${ctx.session.user._id}`);
        ctx.session.user = "";
    }
    await ctx.redirect('/');
}

const safety = async ( ctx , next ) => {
    let user_id = ctx.session.user._id.toString();
    let result  = await UserAuth.findAuthIdentity(user_id);
    let inMail = false;

    const wx = {
        appid :Config.OAuth.weixin.appID,
        redirectUri : Config.OAuth.weixin.redirectURL,
        state : `1*$*1*$*${user_id}`,
        baseSite :'https://open.weixin.qq.com/connect/qrconnect'
    }

    const qq = {
        appid :Config.OAuth.qq.appID,
        redirectUri : Config.OAuth.qq.redirectURL,
        state : `1*$*1*$*${user_id}`,
        baseSite :'https://graph.qq.com/oauth2.0/authorize'
    }

    if(result.success && result.data){
        if(result.data.identity.email.identifier){
            await ctx.render('user/setting/safety', { 
                safety : result.data,
                wx : {
                    href :`${wx.baseSite}?appid=${wx.appid}&redirect_uri=${wx.redirectUri}&response_type=code&scope=snsapi_login&state=${wx.state}#wechat_redirect`
                },
                qq : {
                    href: `${qq.baseSite}?response_type=code&client_id=${qq.appid}&state=${qq.state}&redirect_uri=${qq.redirectUri}`
                }
            })
        }else{
            await ctx.redirect('/user/hbemail')
        }
    }else{
        await ctx.redirect('/')
    }
}

const bindEmailHtml = async ( ctx , next ) => {
    await ctx.render('user/setting/bind-email', {})
}


const bindUserName = async ( ctx , next ) => {
    await ctx.render('iframe/user/setting/bind-user', {  })
}

const upUserEmail = async ( ctx , next ) => {
    let result  = { success : false }
    let uid = ctx.session.user._id.toString();
    result = await UserAuth.findAuthIdentity(uid);
    await ctx.render('iframe/user/setting/up-user-mail', { 
        userAuth : result.data
    })
}


const upPass = async ( ctx , next ) => {
    let result  = { success : false }
    let uid = ctx.session.user._id.toString();
    result = await UserAuth.findAuthIdentity(uid);
    await ctx.render('iframe/user/setting/up-user-pass', { 
        userAuth : result.data
    })
}


module.exports = {
    loginout,
    safety,
    bindEmailHtml,
    upPass,
    bindUserName,
    upUserEmail
}