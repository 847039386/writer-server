const config = {
    debug :true,
    host :'http://localhost:3000',                  // 域名
    JwtKey : 'ffa5fcd751e4b994',                    // jwt钥匙
    port : 5555,                                    // 端口
    admin : 'adm847039386@qq.com',                  // 超级管理员邮箱，这里必须是有效的邮箱
    db : {
        database : 'drama',                         // 数据库名称
        host : 'localhost',                         // 数据库地址
        port : 27017                                // 数据库端口
    },
    email : {                                       // email设置
        smtp :'smtp.qq.com',
        user : '847039386@qq.com',
        token : 'ccjspvbpzmiibehi'
    },
    OAuth : {                                       // 第三方
        qq : {                                      // 第三方QQ的配置
            appID : '101447649',
            appKEY :'ffa5fca3cd1558221abe58d751e4b994',
            redirectURL : 'http://localhost:5555/lauth'         
        }
    }
}

module.exports = config;