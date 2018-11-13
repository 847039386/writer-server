const mongoose = require("mongoose");

const ReplyCommentSchema = new mongoose.Schema({
    comment_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'comment' ,required :true },    // 连接于评论表  评论ID
    drama_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' ,required :true },
    reply_type :{ type: Number ,default :0 },   // 0：回复评论  1：回复的回复
    content : { type :String },
    reply_id : { type :mongoose.Schema.Types.ObjectId },        // 如果是回复评论 则是评论ID  如果是回复人 则是回复人 ID
    create_at : { type :Date ,default :Date.now },   // 创建时间
    from_uid :{ type :mongoose.Schema.Types.ObjectId ,ref: 'user'  }, // 回复用户id
    to_uid :{ type :mongoose.Schema.Types.ObjectId ,ref: 'user' } // 目标用户id
});

module.exports = ReplyCommentSchema;