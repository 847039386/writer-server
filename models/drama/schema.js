const mongoose = require("mongoose");

const DramaSchema = new mongoose.Schema({
    title : { type :String },                // 标题
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },    // 连接于user表
    book_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'book' },            // 剧本类型
    category_id : [{ type :mongoose.Schema.Types.ObjectId ,ref: 'category' }],            // 剧情类型
    description : { type :String },                     // 简单描述 
    abstract : { type :String },                        // 剧本大纲
    character : { type :String },                       // 人物小传
    weight : { type :Number , default : 0 },            // 权重 越高排名越靠前
    create_at : { type :Date ,default :Date.now },       // 创建时间
    state : { type :Number , default : 0 },                 // 状态  0：连载 1：完结          

    uv : {
       day : { type :Number ,default :0 },          // 日浏览
       week : { type :Number ,default :0 },         // 周浏览
       month : { type :Number ,default :0 },        // 月浏览
       total : { type :Number ,default :0 }         // 总浏览
    },

    count : {
        collect : { type :Number ,default :0 },     // 收藏数
        comment : { type :Number ,default :0 },     // 评论数
        like : { type :Number ,default :0 }         // 点赞数
    },

    status : {  type :Number ,default:0    },                   // 管理状态  0、可查看 1、不可查看
    ustatus : {  type :Number ,default:0    } ,                // 用户管理状态 0、可查看 1,不可查看





    // lable : { type :String },       
});

DramaSchema.index({ title: 'text', description: 'text' }); 

module.exports = DramaSchema;