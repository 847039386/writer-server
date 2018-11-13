const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name : { type :String },                                  // 管理员昵称

    avatar : {type :String },                                 // 头像

    email : { type :String ,unique:true },                    // 邮箱
    token : { type :String },                                 // 令牌

    new_ip : { type :String },                                // 本次IP
    old_ip : { type :String },                                // 上次登陆IP

    authority : { type :String ,default :'guest' },           // 权限

    create_at : { type :Date ,default :Date.now },            //  管理员 创建时间
    create_ut : { type :Date ,default :Date.now },            //  管理员 创建时间
});

module.exports = AdminSchema;