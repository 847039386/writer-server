// 只负责用户的身份验证（登陆注册等）
const UserAuth = require('../models').User;
const Config = require('../config');
const UUID = require('uuid');
const Email = require('../common').Email;
const Async = require('async');
const { Jwt ,qqOAuth } = require('../common');
var md5 = require("md5")


/**
 * 查找 返回一条数据
 * @param {String} user_id 用户id
 */
const findAuthIdentity = (id) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findById(id).select({identity : 1}).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data : data , success :true })
            }
        })
    })
}

/**
 * 
 * 本站的用户名登陆
 * @param {String} username  用户名
 * @param {String} password  密码
 */ 

const hostLogin = ( username , password ) => {
    return new Promise(( resolve ,reject ) => {
        UserAuth.findOne({ "identity.username.identifier" :username }).exec(async (err ,ua) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else if(ua){
                if(ua.identity.username.token === password){
                    resolve({ success:true , data :ua }); 
                }else{
                    resolve({ success:false , msg :'密码错误' })
                }
            }else{
                resolve({ success:false , msg :'不存在的用户' })
            }
        })
    })
}


/**
 * 第三方注册。。
 * @method  thirdPartyRegister
 * @param   {Object}    identityINFO    身份信息 
 * @param   {Object}    userSchema      user注册信息
 * @return  {Promise} 
 * @example 
 * thirdPartyRegister({ type :'qq' ,identifier :'IDENTIFIER' },{ name :'BEIMEN' ,avatar :'http://xxx.xxx.com/avatar/xxx.png' })
 */
const thirdPartyRegister = (identityINFO ,userSchema) => {
    return new Promise(async (resolve ,reject) => {
        let identifier = '';
        let token = '';
        if(!identityINFO.type || !identityINFO.identifier){
            resolve({ success:false , msg :'未知注册' })
        }
        switch(identityINFO.type){
            case "qq" :
                identifier = "identity.qq.identifier";
            break;
            case "weixin" :
                identifier = "identity.weixin.identifier";
            break;
            default :
                resolve({ success:false , msg :'未知注册' })
            break;
        } 

        // 创建登陆用户
        let userAuthSchema = { }
        userAuthSchema[identifier] = identityINFO.identifier;
        userAuthSchema = Object.assign(userAuthSchema,{ 
            name    :userSchema.name ,
            avatar  :userSchema.avatar ,
        })
        UserAuth.create(userAuthSchema,(err ,userAuthDosc) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(userAuthDosc){
                    const token = Jwt.issueToken({ aud :userAuthDosc._id ,secretKey :Config.JwtKey ,role :'user' }).token;
                    let newUser = userAuthDosc.toObject();
                    newUser = Object.assign(newUser, { token });
                    resolve({ success:true , msg :'注册成功' ,data :newUser }) 
                }else{
                    resolve({ success:false , msg :'注册失败' })
                }
            }
        })
    })
}

/**
 * 查看是否重复的用户名。这里包括(email , username qq weixin)
 */
const findRepeatUIdentifier = (identityINFO) => {
    return new Promise((resolve ,reject) => {
        let identifier = '';
        switch(identityINFO.type){
            case "username" :
                identifier = "identity.username.identifier";
            break;
            case "email" :
                identifier = "identity.email.identifier";
            break;
            case "qq" :
                identifier = "identity.qq.identifier";
            break;
            case "weixin" :
                identifier = "identity.weixin.identifier";
            break;
            default :
                resolve({ success:false , msg :'未知身份' })
            break;
        } 
        let userAuthSchema = {  }
        userAuthSchema[identifier] = identityINFO.identifier;
        UserAuth.findOne(userAuthSchema).lean().exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true ,data :data })
            }
        })
    })
}

/**
 * 根据email 发送一个验证码。用于绑定邮箱修改密码修改邮箱等操作
 * @param {*} email 
 */
const findEmailSendPAC = (email ) =>{
    return new Promise((resolve ,reject) => {
        const code = Math.floor(Math.random()*(999999-100000+1)+100000);        // 6位 随机数
        Email.send(email,code).then((result) => {
            if(result.success){
                resolve({ success :true ,data :code })
            }else{
                resolve({ success :false , msg :result.msg })
            }
        });
    })
}

/**
 * 修改邮箱时发送验证码
 * @param {*} uid 用户id 
 * @param {*} new_mail 新的邮箱 
 */
const changeEmailPac = (uid,new_mail) => {
    return new Promise((resolve ,reject) => {
        let pac = Math.floor(Math.random()*(999999-100000+1)+100000);
        let new_pac = Math.floor(Math.random()*(999999-100000+1)+100000);
        UserAuth.findById(uid).select({ id :-1,identity : 1 }).exec((err ,data) => {
            if(err){
                resolve({ success :false , msg :result.msg })
            }else{
                if(data && data.identity.email.identifier){
                    let old_mail = data.identity.email.identifier;
                    if(old_mail === new_mail){
                        resolve({ success :false , msg :'新邮箱不许与旧邮箱一致'})
                    }else{
                        Async.auto({
                            oldMail : function(callback){
                                Email.send(old_mail,pac).then((result) => {
                                    if(result.success){
                                        callback(null, { data : pac })
                                    }else{
                                        callback({ message :'旧邮件发送失败' })
                                    }
                                });
                            },
                            newMail : function(callback){
                                Email.send(new_mail,new_pac).then((result) => {
                                    if(result.success){
                                        callback(null, { data : new_pac })
                                    }else{
                                        callback({ message :'新邮件发送失败' })
                                    }
                                });
                            }
                        }, function(err,results) {
                            if(err){
                                resolve({ success :false , msg :err.message})
                            }else{
                                resolve({ success :true , data : {
                                    old_mail :old_mail,
                                    new_mail :new_mail,
                                    old_pac :results.oldMail.data,
                                    new_pac :results.newMail.data,
                                }})
                            }
                        })
                    }
                }else{
                    resolve({ success :false , msg :'未知的身份'})
                }
            }
        })
    })
}

/**
 * 绑定用户邮箱
 * @param {*} user_id // 用户id
 * @param {*} email // 用户邮箱
 */
const bindUserEmail = ( user_id ,email ) => {
    return new Promise((resolve ,reject) => {
        Async.auto({
            mailExist : function(callback){
                UserAuth.findOne({ "identity.email.identifier" : email }).exec((err ,dosc) => {
                    if(err){
                        callback(err);
                    }else{
                        if(dosc){
                            callback(null,true)
                        }else{
                            callback(null,false);
                        }
                    }
                })
            },
            userAuh : function(callback){
                UserAuth.findById(user_id).exec((err ,dosc) => {
                    if(err){
                        callback(err);
                    }else{
                        if(dosc){
                            callback(null,dosc)
                        }else{
                            callback({ message :'不存在的信息' });
                        }
                    }
                })
            },
            bindMail : ['mailExist','userAuh',(results ,callback) => {
                const mailExist = results.mailExist;
                if(mailExist){
                    callback(null,{ success :false , msg :'该邮箱已被绑定。' })
                }else{
                    const userAuh = results.userAuh;
                    if(userAuh.identity.email.identifier){
                        callback(null,{ success :false , msg :'已绑定邮箱，请勿重复绑定' })
                    }else{
                        UserAuth.findByIdAndUpdate(user_id,{ 'identity.email.identifier' : email  },{ new :true }).exec((err ,dosc) => {
                            if(err){
                                callback(err)
                            }else{
                                if(dosc){
                                    callback(null,{ success :true , data :dosc.identity.email.identifier ,msg :'邮箱绑定成功' });
                                }else{
                                    callback({ message :'不存在的信息' });
                                }
                            }
                        })
                    }
                }
            }]
        },(err ,results) => {
            const bindMail = results.bindMail;
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve(bindMail)
            }
        })
    })
}

/**
 * 为用户绑定本站用户名或修改密码
 * @param {*} user_id 
 * @param {*} username 
 * @param {*} password 
 */
const bindHostUserName = (user_id ,username ,password) =>{
    return new Promise((resolve ,reject) => {
        Async.auto({
            notRepeat : (callback) => {            
                UserAuth.findOne({ "identity.username.identifier" : username }).exec((err,data) => {
                    if(err){
                        callback(err)
                    }else{
                        if(data){
                            callback({message : '用户名重复，绑定失败'})
                        }else{
                            callback(null,true)
                        }
                    }
                })
            },
            notBind : (callback) => {            
                UserAuth.findById(user_id).exec((err,data) => {
                    if(err){
                        callback(err)
                    }else{
                        if(data && data.identity.username.identifier){
                            callback({message : '您已绑定过用户名，绑定失败'})
                        }else if(data && !data.identity.username.identifier){
                            callback(null,true)
                        }else{
                            callback({message : '不能存在的身份'})
                        }
                    }
                })
            },
            bindUserName :['notRepeat','notBind',(results ,callback) => {
                const notRepeat = results.notRepeat;
                const notBind = results.notBind;
                if(notRepeat && notBind){
                    var md5_token = md5(password);
                    UserAuth.findByIdAndUpdate(user_id,{ "identity.username.identifier" : username ,"identity.username.token" :md5_token },{new :true}).exec((err,data) => {
                        if(err){
                            callback(err)
                        }else{
                            if(data){
                                callback(null,{ success :true , data : data.identity.username.identifier,  msg:'绑定成功' })
                            }else{
                                callback({message : '不能存在的身份'})
                            }
                        }
                    })
                }else{
                    callback({message : '未知错误'})
                }
            }]
        },(err ,results) => {
            if(err){
                resolve({ success:false , msg :err.message })
            }else{
                const bindUserName = results.bindUserName;
                resolve(bindUserName)
            }
        })
    })
}


/**
 * 根据用户id 修改密码
 * @param {*} user_id 
 * @param {*} password 
 */
const updatePassByUserID = (user_id ,username ,password) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findOneAndUpdate(user_id,{ "identity.username.token" :md5(password) },{new :true}).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success:true ,data:data.identity.username.identifier ,msg :'修改密码成功' })
                }else{
                    resolve({ success:false , msg :'不能存在的身份' })
                }
            }
        })
    })
}

/**
 * 根据用户id 修改邮箱
 * @param {*} user_id 
 * @param {*} password 
 */
const updateEmailByUserID = (user_id ,email) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findByIdAndUpdate(user_id,{ "identity.email.identifier" :email },{new :true}).exec((ut_err ,data) => {
            if(ut_err){
                resolve({ success:false , msg :Config.debug ? ut_err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success:true ,data:data.identity.email.identifier ,msg :'修改邮箱成功' })
                }else{
                    resolve({ success:false , msg :'未知错误' })
                }
            }
        })
    })
}


/**
 * qq登陆
 * @param { String } code   // 第三方code
 */
const qqLogin = ( code ) => {
    let qqoa = new qqOAuth({
        appID : Config.OAuth.qq.appID,
        appKEY : Config.OAuth.qq.appKEY,
        redirectURL : Config.OAuth.qq.redirectURL,
    });
    return new Promise((resolve ,reject) => {
        var MyOpenid = '';
        var MyToken = '';
        try {
            qqoa.getTOKEN(code).then((token) => {
                MyToken = token;
                return qqoa.getOpenID(token);               // 获取 openid  用户唯一id
            }).then((openid) => {
                MyOpenid = openid;
                return findRepeatUIdentifier({ type :'qq' ,identifier :openid });       // 查看该ID是否绑定
            }).then((userData) => {
                if(userData.success && userData.data){                                  // 如果绑定，获取用户信息
                    // 状态等于 0 允许登陆
                    if(userData.data.status == 0){
                        const token = Jwt.issueToken({ aud :userData.data._id ,secretKey :Config.JwtKey ,role :'user'}).token;
                        let userResult = userData.data;
                        userResult = Object.assign(userResult ,{ token }) 
                        resolve({ success:true , data :userResult })
                    }else{      //否则限制登陆
                        resolve({ success:false , msg:'该用户已被限制登陆。' })
                    }
                }else if(userData.success && !userData.data){                           // 如没有绑定，则注册用户信息
                    qqoa.getUserInfo(MyOpenid,MyToken).then((userInfo) => {
                        thirdPartyRegister({ type :'qq' ,identifier :MyOpenid },{ name :userInfo.nickname ,avatar :userInfo.figureurl_2 }).then((registerINFO) => {
                            resolve(registerINFO)
                        })
                    }).catch((userInfoError) => {
                        resolve({success :false ,msg :userInfoError})
                    })
                }else{
                    resolve({success :false ,msg :'未知错误'})
                }
            }).catch((error) => {
                resolve({success :false ,msg :error})
            })
        } catch (error) {
            resolve({success :false ,msg :'error'})
        }
    })
}


// 暂时测试
const bindUserQQ = (user_id ,code) =>  {
    let qqoa = new qqOAuth({
        appID : Config.OAuth.qq.appID,
        appKEY : Config.OAuth.qq.appKEY,
        redirectURL : Config.OAuth.qq.redirectURL,
    })
    return new Promise((resolve ,reject) => {
        var MyOpenid = '';
        var MyToken = '';
        try {
            qqoa.getTOKEN(code).then((token) => {
                MyToken = token;
                return qqoa.getOpenID(token);
            }).then((openid) => {
                MyOpenid = openid;
                return findRepeatUIdentifier({ type :'qq' ,identifier :openid }); 
            }).then((userData) => {
                if(userData.success){
                    if(userData.data){
                        resolve({success :false ,msg :'该QQ已被绑定'});
                    }else{
                        UserAuth.findByIdAndUpdate(user_id,{
                            'identity.qq.identifier' : MyOpenid
                        }).exec((create_err ,data) => {
                            if(create_err){
                                resolve({ success:false , msg :Config.debug ? create_err.message :'未知错误' })
                            }else{
                                resolve({ success:true ,data :true, msg :'绑定了QQ' })
                            }
                        })
                    }
                }else{
                    resolve({success :false ,msg :userData.msg});
                }
            }).catch((error) => {
                resolve({success :false ,msg :error})
            })
        } catch (error) {
            resolve({success :false ,msg :'error'})
        }
    })
}
/**
 * 站内注册
 * @param {*} nikename  昵称 
 * @param {*} username  用户名     
 * @param {*} avatar    头像
 * @param {*} pass      密码
 */
const toRegister = (nikename,username,avatar,pass) =>  {
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({ "identity.username.identifier" : username }).exec((uerr ,desc) => {
            if(uerr || desc){
                resolve({ success :false , msg :'用户名已被注册' })
            }else{
                UserAuth.create({
                    "name" :nikename,
                    "avatar" : avatar,
                    "identity.username.identifier" : username,
                    "identity.username.token" : md5(pass)
                },(err ,userAuthDosc) => {
                    if(err){
                        resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
                    }else{
                        if(userAuthDosc){
                            resolve({ success:true , msg :'注册成功' ,data :userAuthDosc }) 
                        }else{
                            resolve({ success:false , msg :'注册失败' })
                        }
                    }
                })
            }
        })
    })
}

module.exports = {
    findAuthIdentity,
    toRegister,
    hostLogin,
    findRepeatUIdentifier,
    qqLogin,
    findEmailSendPAC,
    bindUserEmail,
    bindHostUserName,
    bindUserQQ,
    updatePassByUserID,
    changeEmailPac,
    updateEmailByUserID,
    thirdPartyRegister
}