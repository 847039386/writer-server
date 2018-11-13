const mongoose = require("mongoose");

const CollectSchema = new mongoose.Schema({
    drama_id  : { type :mongoose.Schema.Types.ObjectId ,ref: 'drama' ,required :true },                // 剧本ID
    user_id  : { type :mongoose.Schema.Types.ObjectId ,ref: 'user' ,required :true },                 // 用户
    rel_type  :{ type :Number ,default :1 },         // 类型  1 收藏
});

module.exports = CollectSchema;