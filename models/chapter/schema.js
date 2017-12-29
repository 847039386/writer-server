const mongoose = require("mongoose");

const ChapterSchema = new mongoose.Schema({
    title : { type :String },                // 分集标题
    drama_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' ,required :true },     // 剧本ID  
    chapterorder : { type :Number },          // 排序 越小越靠前 
    content : { type :String , required :true},
    create_at : { type :Date ,default :Date.now },   // 创建时间
    update_at : { type :Date ,default :Date.now }    // 修改时间
});

module.exports = ChapterSchema;