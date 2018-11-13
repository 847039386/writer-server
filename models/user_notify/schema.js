const mongoose = require("mongoose");

const UserNotifySchema = new mongoose.Schema({
    content :{ type :String },                                              // 内容
    type  :{ type :Number },                                                // 消息的类型，1: 公告 Announce，2: 提醒 Remind，3：信息 Message
    targetType  :{ type:String },                                           // 目标的类型, 如: drama :剧本、comment ：评论，fans：粉丝 ,reply :用户 letter
    drama_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' },      // 剧本ID
    user_id : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' },        // 消息所属者 ID     
    action  :{ type :String },                                              // 提醒消息的动作类型, 如: comment :评论、like ：赞 、collect：收藏 
    sender :{ type :mongoose.Schema.Types.ObjectId ,ref: 'user' },          // 发送者ID
    create_at : { type :Date ,default :Date.now },                           // 创建时间
    add_content :{type :String},                                             //  追加内容。。比如用户回复了评论 将回复信息添加至该字段     
    
    opids : {                                                               // 根据action，与targetType 建立伪连接 可为空
        one : {  type :mongoose.Schema.Types.ObjectId },     
        two : {  type :mongoose.Schema.Types.ObjectId }      
    },
});

module.exports = UserNotifySchema;

// 


/**
 *  消息的类型，1: 公告 Announce，2: 提醒 Remind，3：信息 Message
 * 
 *  消息的类型为：提醒(2)的时候 @param {targetType} 可选值
 *  1. drama：剧本
 *      @param { action } comment : 评论
 *      @param { action } like : 赞
 *      @param { action } collect : 收藏
 *  2. comment：评论
 *      @param { action } normal ：普通评论
 *      @param { action } reply ：回复评论
 *  3. fans：粉丝
 *      @param { action } follow : 关注
 *      @param { action } like : 赞
 * 
 * 
 *  当消息类型为：信息(3)的时候 @param {targetType} 可选值
 *  1. letter：用户私信
 *      @param { action } normal ：普通私信
 *      @param { action } reply  ：回复私信
 *  2. admin ：管理员私信
 *      @param { action } normal ：普通私信
 * 
 * 
 * 
 * 
 * 
 */

