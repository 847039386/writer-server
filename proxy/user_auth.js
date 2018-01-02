const UserAuth = require('../models').UserAuth;
const User = require('./user');
const Config = require('../config');
const { Jwt ,qqOAuth } = require('../common')

const onLogin = (name ,avatar) => {
    return new Promise((resolve ,reject) => {
        
    })
}

const findRepeatUName = ( username ) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({identifier :username ,identity_type :'username' } ).select({ id :-1,email : 1 }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if( data ){
                    resolve({ success :false , msg :'该用户已重复' })
                }else{
                    resolve({ data : username , success :true })
                }
            }
        })
    })
}


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

const findBYIdentifier = (identifier ,identity_type) => {
    return new Promise((resolve ,reject) => {
        UserAuth.findOne({ identifier ,identity_type }).populate('user_id').exec((err ,data) => {
            if(err){
                reject('select userAuth error')
            }else{
                if(data){
                    resolve({ success :true ,data : data.user_id })
                }else{
                    resolve({ success :false ,msg :'并没有该用户' })
                }
            }
        })
    })
}


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
                return findBYIdentifier(openid,'qq')
            }).then((userData) => {
                if(userData.success){
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



module.exports = {
    hostLogin,
    toRegister,
    findRepeatUName,
    qqLogin
}