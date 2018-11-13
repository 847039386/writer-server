const host = "http://localhost:80";                         // host 例如：www.baidu.com || localhost:80        

const config = {
    debug :true,
    host :host,                                             // 域名
    JwtKey : 'JwtKey',                                      //  jwt钥匙    用来解析token
    port : 'port',                                          //  端口       @number 类型   
    admin : {
        path :'houtai path',                                //  后台地址         例如 : /houtai/home     
        email : 'admin email',                              //  管理员邮箱       注意：这里必须是有效邮箱
        token : 'initial password',                         //  管理员初始密码
        avatar : '/images/avatar/5.png'                     //  管理员头像
    },                                              
    db : {
        database : 'database name',                         // 数据库名称
        host : 'database host',                             // 数据库地址    例如：localhost
        port : 'database port'                              // 数据库端口    例如：27017                    注意：number类型
    },
    redis : {                                       
        host :'redis host',                                  // redis 地址     例如：127.0.0.1             
        port :'redis port',                                  // redis 端口     例如：6379                    注意：number类型
        keyPrefix :'redis keyPrefix'                         // redis 前缀     例如：REDIS:                       
    },
    email : {                                      
        smtp :'email smtp',                                     //  email 协议   
        user : 'email user',                                    //  email 用户名
        token : 'email token'                                   //  email token|password
    },
    OAuth : {                                                   // 第三方开放平台
        //  QQ第三方
        qq : {                                                  
            appID : 'appID',
            appKEY :'appKEY',
            redirectURL : `redirectURL`     
        },
        //  微信第三方
        weixin : {
            appID : 'appID',
            appKEY :'appKEY',
            redirectURL : `redirectURL`
        }
    },
    upload: {  
        //  七牛上传                                     
        qn_access: {
            accessKey :'accessKey',
            secretKey :'secretKey',
            bucket :'bucket',
            origin :'origin',
            uploadURL :'uploadURL'
        },
    },
}

module.exports = config;
