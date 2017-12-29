const mongoose = require("mongoose");




// identity_type 类型 1. host 2. qq
const UserAuthSchema = new mongoose.Schema({
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },
    identity_type : { type :String },                // 身份类型  weixin,qq,email
    identifier : { type :String ,unique:true },                    // 存储唯一标识   比如账号、邮箱、手机号、第三方获取的唯一标识等 如 QQ的OpenID
    token : { type :String },                          // 令牌   例如：手机号对应验证码，邮箱对应密码 ,第三方则对应自己的token
    expires_time : { type :Date ,default :Date.now }    // 令牌过期时间
});

module.exports = UserAuthSchema;