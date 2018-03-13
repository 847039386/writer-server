const mongoose = require("mongoose");

const UserNotifySchema = new mongoose.Schema({
    content :{ type :String },                                              // 公告
    type  :{ type :Number },                                                // 消息的类型，1: 公告 Announce，2: 提醒 Remind，3：信息 Message
    targetType  :{ type:String },                                           // 目标的类型, 如: drama :剧本、comment ：评论，fans：粉丝
    drama_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' },      // 剧本ID
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' },        // 消息所属者 ID     
    action  :{ type :String },                                              // 提醒消息的动作类型, 如: comment :评论、like ：点赞 
    sender :{ type :mongoose.Schema.Types.ObjectId ,ref: 'user' },          // 发送者ID
    create_at : { type :Date ,default :Date.now }                           // 创建时间
});

module.exports = UserNotifySchema;

// 