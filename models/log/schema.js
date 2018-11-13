const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
    opid : { type :mongoose.Schema.Types.ObjectId },                        //  公共ID  用于查询 任何表。
    log : [{                                                                //  操作信息  备注
        adminid : { type :mongoose.Schema.Types.ObjectId ,ref: 'admin'},    //  管理员ID
        content : { type :String },                        //  日志内容
        create_at :{ type :Date ,default :Date.now  },                      //  日志生成时间
    }],                                            
    create_at : { type :Date ,default :Date.now },
    type : { type : String }    // 类型
});

module.exports = LogSchema;