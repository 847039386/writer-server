const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },    // 连接于user表      用户表
    drama_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' ,required :true },    // 连接于drama表   剧本表
    content : { type :String },
    create_at : { type :Date ,default :Date.now }   // 创建时间

});

module.exports = CommentSchema;