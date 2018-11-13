const Jwt = require('../common').Jwt;
const Admin = require('../proxy').Admin;
const Config = require('../config')

const JwtAuth = (authType) => {
    return async ( ctx , next ) => {
        let result = { success :false };
        const Aud = ctx.headers['aud'];
        const Token = ctx.headers['authorization'];
        if(Token && Aud){
            const decryptedData = Jwt.decrypt(Token,Config.JwtKey);
            const role = decryptedData.role;
            if(authType === 'admin' && role === 'admin'){                                           // 当验证类型是Admin时,role只能是admin
                const redis_jwt = await ctx.redis.get(`TOKEN-ADMIN-${Aud}`);
                if(isAdmin(ctx , decryptedData ,redis_jwt)){
                    await next();
                }else{
                    ctx.body = Object.assign(result,{ msg :'验证出错，请重新登陆' });
                }
            }else if(authType === 'user' && role === "user"){                 
                const redis_jwt = await ctx.redis.get(`TOKEN-USER-${Aud}`);
                if(isUser(ctx , decryptedData ,redis_jwt)){
                    ctx.USERID = Aud;
                    await next();
                }else{
                    ctx.session.user = "";
                    ctx.body = Object.assign(result,{ msg :'验证出错，请重新登陆' });
                }
            }else{
                ctx.session.user = "";
                ctx.body = Object.assign(result,{ msg :'验证不通过，请重新登陆' });
            }
        }else{
            ctx.session.user = "";
            ctx.body = Object.assign(result,{ msg :'验证不通过，请重新登陆' });
        }
    }
}

const isUser = (ctx , jwt ,redis) => {
    const rds = JSON.parse(redis);
    const jwt_header = ctx.headers['aud'];
    const jwt_aud = jwt.aud;
    const jwt_jti = jwt.jti;
    const jwt_redis_jti = rds ? rds.id : null;
    if(jwt_header == jwt_aud && jwt_jti === jwt_redis_jti){
        return true;
    }else{
        return false;
    }
}

const isAdmin = (ctx ,jwt ,redis) => {
    const rds = JSON.parse(redis);
    const jwt_header = ctx.headers['aud'];
    const jwt_aud = jwt.aud;
    const jwt_jti = jwt.jti;
    const jwt_redis_jti = rds ? rds.id : null;
    if(jwt_header == jwt_aud && jwt_jti === jwt_redis_jti){
        return true;
    }else{
        return false;
    }
}

const isLogin = async ( ctx , next ) => {
    let userSession = ctx.session.user;
    if(userSession){
        await next();
    }else{
        await ctx.redirect('/login')
    }
}

const isRoot = () => {
    return async ( ctx , next ) => {
        let result = { success :false }
        if(ctx.headers['authorization']){
            let decryptedData = Jwt.decrypt(ctx.headers['authorization'] ,Config.JwtKey);
            if(decryptedData){
                if(decryptedData.iss){
                    let result = await Admin.isRoot(decryptedData.aud)
                    if(result.success){
                        await next();
                    }else{
                        ctx.body = Object.assign(result,{ msg :'验证出错,没有权限' });
                    }
                }else{
                    ctx.body = Object.assign(result,{ msg :'验证出错' });
                }
            }else{
                ctx.body = Object.assign(result,{ msg :'验证失败' });
            }
        }else{
            ctx.body = Object.assign(result,{ msg :'验证不通过' });
        }
    }
}






module.exports = {
    JwtAuth,
    isRoot,
    isLogin
}