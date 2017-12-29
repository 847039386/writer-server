const config = {
    debug :true,
    port : 5555,
    admin : '847039386@qq.com',
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