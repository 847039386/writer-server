const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name : { type :String },                // 昵称
    avatar : { type :String },              // 头像
    presentation :{type :String},           //用户介绍
    follow : { type :Number ,default : 0 }  //关注度
});

module.exports = UserSchema;