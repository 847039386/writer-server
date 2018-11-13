const { UserAuth ,User } = require('../proxy');
const JWT = require('../common/jwt');
const Config = require('../config');
const UserAuthPROXY = require('../proxy').UserAuth
const weiXinOAuth = require('wechat-oauth');
var WXClient = new weiXinOAuth(Config.OAuth.weixin.appID, Config.OAuth.weixin.appKEY);



const WXOAuth = {
    getAccessToken(code){
        return new Promise((resolve ,reject) => {
            WXClient.getAccessToken(code, function (err, result) {
                if(err){
                    resolve({ success :false ,msg :err.message })
                }else{
                    resolve({ success :true ,data :result.data })
                }
            });
        })
    }
    ,getUser(openid){
        return new Promise((resolve ,reject) => {
            WXClient.getUser(openid, function (err, result) {
                if(err){
                    resolve({ success :false ,msg :err.message })
                }else{
                    resolve({ success :true ,data:result })
                }
            });
        })
    }
}

const qq = async ( ctx , next ) => {
    let query = ctx.query;
    let code = query.code
    let state = query.state
    const state_split = state.split("*$*");
    const platform = state_split[0] || 0;            // 0为API登陆 1为PC登陆。。
    const status = state_split[1] || 0;              // 0为login 1为绑定。
    if(status == 1){
        const USERID = state_split[2];
        result = await UserAuthPROXY.bindUserQQ(USERID,code);
    }else{
        result = await UserAuthPROXY.qqLogin(code);
        if(result.success){
            const jwt = JWT.decrypt(result.data.token,Config.JwtKey);
            await ctx.redis.set(`TOKEN-USER-${result.data._id.toString()}`,JSON.stringify({ id :jwt.jti ,token :result.data.token }),'EX',1000  * 60 * 60 * 24);
        }
    }

    if(platform == 1){
        if(status == 1){
            if(result.success){
                ctx.redirect('/user/safety')
            }else{
                await ctx.render('default/exception', { 
                    img:'',
                    title :'绑定失败' ,
                    desc :`第三方QQ绑定失败，原因可能是：${result.msg}`,
                    other :true
                })
            }
        }else{
            if(result.success){
                ctx.session.user = result.data;
                if(ctx.session.login_referer){
                    ctx.redirect(ctx.session.login_referer)
                }else{
                    ctx.redirect('/')
                }
            }else{
                await ctx.render('default/exception', { 
                    img:'',
                    title :'登陆失败' ,
                    desc :`第三方QQ登陆失败，原因可能是：${result.msg}`,
                    other :true
                })
            }
        }
    }else{
        ctx.body = result
    }

}

const weixin = async ( ctx , next ) => {
    let query = ctx.query;
    let code = query.code;
    let state = query.state;
    const state_split = state.split("*$*");
    const platform = state_split[0] || 0;            // 0为API登陆 1为PC登陆。。
    const status = state_split[1] || 0;              // 0为login 1为绑定。

    let results = { success :false };
    const token = await WXOAuth.getAccessToken(code);
    if(token.success){
        const openid = token.data.openid;
        const userDesc = await UserAuthPROXY.findRepeatUIdentifier({ type :'weixin' ,identifier :openid });
        if(userDesc.success){
            let USERDATA = userDesc.data
            if(status == 1){
                if(USERDATA){
                    results = Object.assign(results,{msg :'该微信已被注册' });
                }else{
                    const USERID = state_split[2];
                    if(USERID){
                        const bindWX = await User.updateByID(USERID, {
                            'identity.weixin.identifier' : openid
                        });
                        if(bindWX.success){
                            results = Object.assign(results,{ success :true ,data :bindWX.data });
                        }else{
                            results = Object.assign(results,{ msg :bindWX.msg });
                        }
                    }else{
                        results = Object.assign(results,{ msg :'未存在绑定用户' });
                    }
                }
            }else{
                if(USERDATA){
                    // 已被注册，可以登录
                    const access_token = JWT.issueToken({ aud :USERDATA._id ,secretKey :Config.JwtKey ,role :'user'});
                    USERDATA = Object.assign(USERDATA,{ token : access_token.token });
                    if(USERDATA.status == 0){
                        results = Object.assign(results,{ success :true ,data :USERDATA });
                        await ctx.redis.set(`TOKEN-USER-${USERDATA._id.toString()}`,JSON.stringify({ id :access_token.data.jti ,token :access_token.token }),'EX',1000  * 60 * 60 * 24);
                        ctx.session.user = USERDATA;
                    }else{
                        results = Object.assign(results,{ msg :'该用户已被限制登陆。' });
                    }
                }else{
                    //注册
                    const WXuser = await WXOAuth.getUser(openid);
                    if(WXuser.success){
                        const registerDesc = await UserAuth.thirdPartyRegister({ type :'weixin' ,identifier :openid },{
                            name :WXuser.data.nickname 
                            ,avatar :WXuser.data.headimgurl 
                        });
                        if(registerDesc.success){
                            ctx.session.user = registerDesc.data;
                            const jwt = JWT.decrypt(registerDesc.data.token,Config.JwtKey);
                            await ctx.redis.set(`TOKEN-USER-${registerDesc.data._id.toString()}`,JSON.stringify({ id :jwt.jti ,token :registerDesc.data.token }),'EX',1000  * 60 * 60 * 24);
                            results = Object.assign(results,{ success :true ,data :registerDesc.data });
                        }else{
                            results = Object.assign(results,{msg :registerDesc.msg });
                        }
                    }else{
                        results = Object.assign(results,{ msg : WXuser.msg });
                    }
                }
            }
        }else{
            results = Object.assign(results,{ msg : userInfo.msg });
        }
    }else{
        results = Object.assign(results,{ msg : token.msg });
    }


    if(platform == 1){
        if(status == 1){
            if(results.success){
                ctx.redirect('/user/safety')
            }else{
                await ctx.render('default/exception', { 
                    img:'',
                    title :'绑定失败' ,
                    desc :`第三方微信绑定失败，原因可能是：${results.msg}`,
                    other :true
                })
            }
        }else {
            if(results.success){
                if(ctx.session.login_referer){
                    ctx.redirect(ctx.session.login_referer)
                }else{
                    ctx.redirect('/')
                }
            }else{
                await ctx.render('default/exception', { 
                    img:'',
                    title :'登陆失败',
                    desc :`第三方微信登陆失败，原因可能是：${results.msg}`,
                    other :true
                })
            }
        }
    }else{
        ctx.body = results
    }
}

module.exports = {
    qq
    ,weixin
}


