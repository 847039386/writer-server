const mongoose = require("mongoose");

const RelationSchema = new mongoose.Schema({
    from_user_id  : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },                // 关注者(粉丝)
    to_user_id  : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },                 // 被关注者(大佬)
    rel_type  :{ type :Number ,default :1 },         // 类型  1：关注  ,0：拉黑
});

module.exports = RelationSchema;