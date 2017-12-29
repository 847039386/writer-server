const CryptoJS = require("crypto-js");

const issueToken = (iss ,aud ,secretKey ,exp) => {
    if(!exp){
        exp = Date.now() + 1000 * 60 * 60 * 24;
    }
    const info = {
        iss : iss,           // 签发者
        aud : aud,          // 接收的一方
        iat : Date.now(),       // 签发时间
        exp : exp
    }
    return CryptoJS.AES.encrypt(JSON.stringify(info) ,secretKey).toString();
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