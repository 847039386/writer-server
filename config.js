const config = {
    debug :true,
    authRedirectURL :'http://localhost:3000',                  //这里对应着第三方登陆的回调测试的时候前后端分离是3000上线之后是本站的域名。
    JwtKey : 'ffa5fcd751e4b994',
    port : 4848,
    admin : 'adm847039386@qq.com',
    db : {
        database : 'drama',
        host : 'localhost',
        port : 27017
    },
    email : {
        smtp :'smtp.qq.com',
        user : '847039386@qq.com',
        token : 'ccjspvbpzmiibehi'
    },
    OAuth : {
        qq : {
            appID : '101447649',
            appKEY :'ffa5fca3cd1558221abe58d751e4b994',
            redirectURL : 'http://localhost:5555/lauth'
        }
    }
}

module.exports = config;