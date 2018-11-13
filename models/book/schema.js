const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    name : { type :String ,unique:true },                // 剧本类型名称
    create_at : { type :Date ,default :Date.now }   // 创建时间
});

module.exports = BookSchema;