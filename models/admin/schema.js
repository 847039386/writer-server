const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    name : { type :String },                // 管理员昵称
    email : { type :String ,unique:true },                   // 邮箱
    create_at : { type :Date ,default :Date.now },  // 用户创建时间
    is_root : { type : Number ,default :0 },        // 是否是超级管理员 1：是 2：否
    popedom_id : [{ type :mongoose.Schema.Types.ObjectId ,ref: 'admin_popedom' }],      // 权限
    new_ip : { type :String },          // 本次IP
    old_ip : { type :String },          // 上次登陆IP

});

module.exports = AdminSchema;