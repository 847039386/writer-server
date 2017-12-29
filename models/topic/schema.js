const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    title : { type :String },                // 标题
    content : { type :String },              // 内容
    weight : { type :Number ,default : 0 },               // 权重
    create_at : { type :Date ,default :Date.now }   // 创建时间

});

module.exports = TopicSchema;