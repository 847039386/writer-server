const Admin = require('../models').Admin;
const UUID = require('uuid');
const Email = require('../common').Email;
const Config = require('../config');

const login = (email ,code) => {
    let result = { success :false };
    return new Promise((resovle ,reject) => {
        Admin.findOne({email :email},'pac pac_time token').exec((err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{
                if(admin){
                    let expires_time = new Date(admin.pac_time);
                    if(expires_time.getTime() + (1000 * 60 * 10) < Date.now()){
                        resovle(Object.assign(result ,{ msg : '验证码已过期！' }))
                    }else if(admin.pac != code){
                        resovle(Object.assign(result ,{ msg : '验证码错误！' }))
                    }else{
                        resovle(Object.assign(result ,{ success :true , data :admin }))
                    }
                }else{
                    resovle(Object.assign(result ,{ success :false ,msg: '不存在的用户名' }))
                }
            }
        });
    })
}

const register = (name ,email) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        let adminModel = { email :email ,name :name  };
        Admin.create(adminModel,(err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{
                resolve(Object.assign(result,{success :true ,data:admin}))
            }
        });
    });
}

const sendPac = (email) => {
    let result = { success :false }
    let pac = UUID.v4().substr(0,6);
    return new Promise((resolve ,reject) => {
        Admin.findOneAndUpdate({email },{
            token :UUID.v1(),
            pac_time :Date.now(),
            pac :pac,
        })
        .exec(async (err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else if(admin){
                let pct = await Email.send(email,pac);
                resolve(Object.assign(result,{success:pct}))       
            }else{
                resolve(Object.assign(result,{msg :'不存在的用户名' }))
            }
        })
    });
}


module.exports = {
    login,
    register,
    sendPac
}