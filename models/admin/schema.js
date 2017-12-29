const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name : { type :String },                // 管理员昵称
    email : { type :String },                   // 邮箱
    pac : { type :String },                     // 验证码
    pac_time : { type :Date ,default :Date.now },                  //  验证码创建时间，登陆时的时间。
    create_at : { type :Date ,default :Date.now },  // 用户创建时间
    token : { type :String },                   // 验证token
});

module.exports = AdminSchema;