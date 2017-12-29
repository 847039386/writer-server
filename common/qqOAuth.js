const superagent = require('superagent')
const baseSite = 'https://graph.qq.com'


function QQ(options) {
    options = options || {};
    this.appID = options.appID;
    this.appKEY = options.appKEY;
    this.redirectURL = options.redirectURL;
}

QQ.prototype = {
    getTOKEN(code) {
        let result = { success :false }
        return new Promise((resolve ,reject) => {
            superagent.get(`${baseSite}/oauth2.0/token`).query({
                grant_type :'authorization_code',
                client_id :this.appID,
                client_secret :this.appKEY,
                code :code,
                redirect_uri :this.redirectURL
              }).end(function(err,response){
                    if(err){
                        reject('getToken request error')
                    }else{
                        try {
                            let access_token = new RegExp(/^access_token=(.*?)&/,'g').exec(response.text)[1];
                            if(access_token){
                                resolve(access_token)
                            }else{
                                reject('getToken error')
                            }
                        } catch (error) {
                            reject('getToken regexp error')
                        }
                    }
              })
        })
    },

    getOpenID(token){
        let result = { success :false }
        return new Promise((resolve ,reject) => {
            superagent.get(`${baseSite}/oauth2.0/me`).query({
                access_token : token
            }).end(function(err,response){
                if(err){
                    reject('getOpenID request error')
                }else{
                    let openid;
                    try {
                        openid = JSON.parse(new RegExp(/callback\((.*)\)/,'g').exec(response.text)[1]).openid;
                        if(openid){
                            resolve(openid)
                        }else{
                            reject('getOpenID error')
                        }
                    } catch (error) {
                        reject('openId regexp error')
                    }
                }
            })
        })
    },

    getUserInfo( openid ,token ){
        let result = { success :false }
        return new Promise((resolve ,reject) => {
            superagent.get(`${baseSite}/user/get_user_info`).query({
                access_token : token,
                oauth_consumer_key :this.appID,
                openid :openid
            }).end(function(err ,response){
                if(err){
                    reject('userInfo request error')
                }else{
                    let userInfo = null;
                    try {
                        userInfo = JSON.parse(response.text); 
                        if(userInfo.ret === 0){
                            resolve(userInfo);
                        }else{
                            reject('userinfo error ret not 0')
                        }
                    } catch (error) {
                        reject('userInfo json error')
                    }
                }
            })
        })
    }

}

module.exports = QQ