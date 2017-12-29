const Jwt = require('../common').Jwt;
const secretKey = 'key';

const token = async ( ctx , next ) => {
    let result = { success :false }
    if(ctx.headers['authorization']){
        let decryptedData = Jwt.decrypt(ctx.headers['authorization'] ,secretKey);
        if(decryptedData){
            if( Date.now() < decryptedData.exp){
                await next();
            }else{
                ctx.body = Object.assign(result,{ msg :'验证过期' });
            }
        }else{
            ctx.body = Object.assign(result,{ msg :'验证失败' });
        }
    }else{
        ctx.body = Object.assign(result,{ msg :'验证不通过' });
    }
}


module.exports = {
    token
}