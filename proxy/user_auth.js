const UserAuth = require('../models').UserAuth;
const User = require('./user');
const Config = require('../config');
const UUID = require('uuid');
const Email = require('../common').Email;
const { Jwt ,qqOAuth } = require('../common')


/**
 * 用户绑定电子邮箱
 * @param {String} user_id 用户id
 * @param {String} email  电子邮箱
 */
const bindEmail = ( user_id ,email ) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({identifier :email ,identity_type :'email' } ).select({ id :-1,identifier : 1 }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if( data ){
                    resolve({ success :false , msg :'该用户已重复' })
                }else{
                    UserAuth.create({identifier :email,token :'' ,identity_type :'email',user_id :user_id  }).then((cerr , cdata) => {
                        if(cerr){
                            resolve({ success:false , msg :Config.debug ? cerr.message :'未知错误' })
                        }else{
                            if(cdata){
                                resolve({ data : email , success :true })
                            }else{
                                resolve({ success :false ,msg :'邮箱绑定失败' })
                            }
                        }
                    })
                }
            }
        })
    })
}


/**
 * 查看用户当前绑定的所有信息
 * @param {String} user_id  用户id
 */
const userBindStatus = ( user_id ) =>{
    return new Promise((resolve ,reject) => {
        UserAuth.find({user_id } ).select({ id :-1,identity_type : 1 ,identifier :1 }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data && data.length > 0){
                    resolve({ success:true , data :data })
                }else{
                    resolve({ success:false , msg :'并没有该用户' })
                }
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
        UserAuth.findOne({ identifier :username ,identity_type :'username' }).exec(async (err ,ua) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else if(!ua){
                resolve({ success:false , msg :'不存在的用户' })
            }else{
                if(ua.token === password){
                    let user = await User.findById(ua.user_id);
                    if(user.success){
                        let token = Jwt.issueToken(Config.admin,ua.user_id,Config.JwtKey);
                        if(token){
                            let userResult = user.data.toObject();
                            userResult = Object.assign(userResult ,{ token }) 
                            resolve({ success:true , data :userResult })
                        }else{
                            resolve({ success:false , msg :'签发失败' })
                        }
                    }else{
                        resolve({ success:false , msg :'不存在的用户' })
                    }
                }else{
                    resolve({ success:false , msg :'密码错误' })
                }       
            }
        })
    })
}


/**
 * 用户简易注册。。这里非本站用户绑定
 */

const toRegister = (identity_type ,name ,identifier ,avatar ,password ) => {
    return new Promise(async (resolve ,reject) => {
       let user = await User.create(name ,avatar);
       if(user.success){
          let user_id = user.data._id;
          UserAuth.create({identifier ,token :password ,identity_type ,user_id :user_id },(err ,ua) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                let token = Jwt.issueToken(Config.admin,ua.user_id,Config.JwtKey);
                if(token){
                    let userResult = user.data.toObject();
                    userResult = Object.assign(userResult ,{ token })
                    resolve({ success:true , msg :'注册成功' ,data :userResult }) 
                }else{
                    resolve({ success:false , msg :'签发失败' })
                }    
            }
          })
       }else{
            resolve(user)
       }
    })
}

/**
 * 查看是否重复的用户名。这里包括(email , username qq weixin)
 */
const findRepeatUIdentifier = (identifier ,identity_type) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({ identifier ,identity_type }).populate('user_id').exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true ,data : data.user_id })
                }else{
                    resolve({ success :true , data :null ,msg :'并没有该用户' })
                }
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
        let pac = UUID.v4().substr(0,6);
        Email.send(email,pac).then((result) => {
            if(result.success){
                resolve({ success :true ,data :pac })
            }else{
                resolve({ success :false , msg :result.msg })
            }
        });
    })
}

/**
 * qq登陆
 * @param {*} code 
 */
const qqLogin = ( code ) => {
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
                return findRepeatUIdentifier(openid,'qq')
            }).then((userData) => {
                if(userData.success && userData.data){
                    let user_id = userData.data._id
                    let token = Jwt.issueToken(Config.admin,user_id,Config.JwtKey);
                    if(token){
                        let userResult = userData.data.toObject();
                        userResult = Object.assign(userResult ,{ token }) 
                        resolve({ success:true , data :userResult })
                    }else{
                        resolve({ success:false , msg :'签发失败' })
                    }
                    resolve(userData);
                }else{
                    qqoa.getUserInfo(MyOpenid,MyToken).then((userInfo) => {
                        toRegister('qq',userInfo.nickname,MyOpenid,userInfo.figureurl_2,MyToken).then((huserInfo) => {
                            resolve(huserInfo)
                        })
                    }).catch((userInfoError) => {
                        resolve({success :false ,msg :userInfoError})
                    })
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
 * 绑定用户邮箱或修改
 * @param {*} user_id // 用户id
 * @param {*} email // 用户邮箱
 */
const bindUserEmail = ( user_id ,email ) => {
    let pac = UUID.v4().substr(0,6);
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({ user_id ,identity_type:'email' }).exec((err ,emailData) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(emailData){
                    UserAuth.findByIdAndUpdate(emailData._id,{ identifier :email  },{ new :true}).exec((ut_err ,ut_data) => {
                        if(ut_err){
                            resolve({ success:false , msg :Config.debug ? ut_err.message :'未知错误' })
                        }else{
                            if(ut_data){
                                resolve({ success:true , data :ut_data })
                            }else{
                                resolve({ success:false , msg :'不存在的信息' })
                            }
                        }
                    })
                }else{
                    UserAuth.create({ user_id ,identity_type:'email' ,token :pac ,identifier:email },(ct_err ,ct_data) => {
                        if(ct_err){
                            resolve({ success:false , msg :Config.debug ? ct_err.message :'未知错误' })
                        }else{
                            if(ct_data){
                                resolve({ success:true , data :ct_data })
                            }else{
                                resolve({ success:false , msg :'未知错误' })
                            }
                        }
                    })
                }
            }
        })
    })
}

/**
 * 为用户绑定本站用户名或修改密码(这里用旧密码修改密码)
 * @param {*} user_id 
 * @param {*} username 
 * @param {*} password 
 */
const bindHostUserNameOrUpdatePassword = (user_id ,username ,password ,old_password) =>{
    return new Promise((resolve ,reject) => {
        UserAuth.find({ identity_type:'username' ,user_id }).exec((find_err,user_auth) => {
            if(find_err){
                resolve({ success:false , msg :Config.debug ? find_err.message :'未知错误' })
            }else if(user_auth.length == 0){
                UserAuth.create({ identifier :username ,identity_type:'username' , user_id , token :password },(create_err ,data) => {
                    if(create_err){
                        resolve({ success:false , msg :Config.debug ? create_err.message :'未知错误' })
                    }else{
                        resolve({ success:true ,data :username, msg :'绑定了用户名' })
                    }
                })
            }else if(user_auth.length == 1){
                let userA = user_auth[0];
                if(userA.token === old_password){
                    UserAuth.findByIdAndUpdate(userA._id,{ token :password }).exec((ut_err ,data) => {
                        if(ut_err){
                            resolve({ success:false , msg :Config.debug ? ut_err.message :'未知错误' })
                        }else{
                            if(data){
                                resolve({ success:true ,data:userA.identifier ,msg :'修改密码成功' })
                            }else{
                                resolve({ success:false , msg :'未知错误' })
                            }
                        }
                    })
                }else{
                    resolve({ success:false , msg :'旧密码输入错误' })
                }
            }else{
                resolve({ success:false , msg :'出现了严重的错误' })
            }
        })
    })
}

/**
 * 根据用户id 修改密码
 * @param {*} user_id 
 * @param {*} password 
 */
const updatePassByUserID = (user_id ,password ,identity_type) => {
    identity_type = identity_type || 'username'
    return new Promise((resolve ,reject) => {
        UserAuth.findOneAndUpdate({ user_id ,identity_type },{ token :password }).exec((ut_err ,data) => {
            if(ut_err){
                resolve({ success:false , msg :Config.debug ? ut_err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success:true ,data:data.identifier ,msg :'修改密码成功' })
                }else{
                    resolve({ success:false , msg :'未知错误' })
                }
            }
        })
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
                return findRepeatUIdentifier(openid,'qq')
            }).then((userData) => {
                if(userData.success){
                    if(userData.data){
                        resolve({success :false ,msg :'该QQ已被绑定'});
                    }else{
                        UserAuth.create({ identifier :MyOpenid ,identity_type:'qq' , user_id , token :MyToken },(create_err ,data) => {
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

module.exports = {
    hostLogin,
    toRegister,
    findRepeatUIdentifier,
    qqLogin,
    userBindStatus,
    findEmailSendPAC,
    bindUserEmail,
    bindHostUserNameOrUpdatePassword,
    bindUserQQ,
    updatePassByUserID
}