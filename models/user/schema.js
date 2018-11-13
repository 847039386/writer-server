const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name : { type :String },                // 昵称
    avatar : { type :String },              // 头像
    presentation :{type :String },           //用户介绍

    landing_time :{ type :Date ,default :Date.now },         // 登陆时间

    count : {
        fans : { type :Number ,default :0 },     // 粉丝数
        drama : { type :Number ,default :0 },      // 剧本数
        collect :  { type :Number ,default :0 },    // 收藏数 
        follow : { type :Number ,default :0 }       // 关注数
    },

    status : { type :Number ,default : 0 },            // 0: 可登陆   1：限制登陆

    // 身份验证
    identity : {
        username : { 
            identifier : { type :String ,default :''},
            token :{ type :String ,default :'' }
        },
        email : { 
            identifier :{ type :String ,default :''  },
        },
        qq : { 
            identifier :{ type :String ,default :''  },
        },
        weixin : { 
            identifier :{ type :String ,default :'' },
        },
    },
    
});

module.exports = UserSchema;