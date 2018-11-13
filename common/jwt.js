const CryptoJS = require("crypto-js");
const uuid = require('uuid');

/**
 * 
 * @param {*} options 
 */
const issueToken = (options) => {
    const iss = options.iss || 'admin';
    const sub = options.sub || 'token';
    const aud = options.aud;                        // 必填
    const jti = options.jti || uuid.v1();
    const secretKey = options.secretKey;            // 必填
    const role = options.role || 'user';
    const exp = options.exp || Date.now() + 1000 * 60 * 60 * 24;
    const result = {
        iss : iss,              // 签发者
        sub : sub,              // 标题
        aud : aud,              // 接收者
        jti : jti,              // jwt唯一ID
        iat : Date.now(),       // 签发时间
        exp : exp,              // 过期时间
        role : role,            // 角色
    }
    return {
        data  : result,
        token : CryptoJS.AES.encrypt(JSON.stringify(result) ,secretKey).toString(),
    }
}

const decrypt = ( token ,secretKey ) => {
    const bytes  = CryptoJS.AES.decrypt(token, secretKey);
    let decryptedData;
    try {
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        decryptedData = null
    }
    return decryptedData;
}

module.exports = {
    issueToken ,decrypt
}