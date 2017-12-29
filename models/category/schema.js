const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name : { type :String ,unique:true },                // 剧情类型名称
    create_at : { type :Date ,default :Date.now }   // 创建时间

});

module.exports = CategorySchema;