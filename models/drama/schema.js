const mongoose = require("mongoose");

const DramaSchema = new mongoose.Schema({
    title : { type :String },                // 标题
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },    // 连接于user表
    book_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'book' },            // 剧本类型
    category_id : [{ type :mongoose.Schema.Types.ObjectId ,ref: 'category' }],            // 剧情类型
    description : { type :String },                     // 简单描述 
    abstract : { type :String },                        // 剧本大纲
    character : { type :String },                       // 人物小传
    reading_count : { type :Number , default : 0 },     // 阅读数
    weight : { type :Number , default : 0 },            // 权重 越高排名越靠前
    create_at : { type :Date ,default :Date.now }       // 创建时间
});

module.exports = DramaSchema;