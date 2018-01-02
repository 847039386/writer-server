const Jwt = require('../common').Jwt;
const Config = require('../config')

const JwtAuth = (authType) => {
    return async ( ctx , next ) => {
        let result = { success :false }
        if(ctx.headers['authorization']){
            let decryptedData = Jwt.decrypt(ctx.headers['authorization'] ,Config.JwtKey);
            if(decryptedData){
                if(authType === 'user'){
                    if(decryptedData.iss === Config.admin && decryptedData.aud === ctx.headers['aud']){
                        await next();
                    }else if(decryptedData.aud === Config.admin){
                        await next();
                    }else{
                        ctx.body = Object.assign(result,{ msg :'验证出错' });
                    }
                }else if(authType === 'admin'){
                    if(decryptedData.iss == Config.admin && decryptedData.aud == Config.admin,decryptedData.iss){
                        await next();
                    }else{
                        ctx.body = Object.assign(result,{ msg :'验证出错' });
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
}