const Admin = require('../models').Admin;
const UUID = require('uuid');
const Email = require('../common').Email;
const Config = require('../config');
const { Jwt } = require('../common');



/** 这里的管理员登陆因密码存储在redis里 所以只需要查询账号
 * 
 * @param {String} email 管理员email
 */

const login = (email) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        Admin.findOne({email :email}).exec((err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{
                if(admin){
                    let token = Jwt.issueToken(Config.admin,email,Config.JwtKey);
                    if(token){
                        let newAdmin = admin.toObject();
                        newAdmin.token = token;
                        resolve(Object.assign(result ,{ success :true , data :newAdmin }))
                    }else{
                        resolve({ success:false , msg :'签发失败' })
                    }
                }else{
                    resolve(Object.assign(result ,{ success :false ,msg: '不存在的用户名' }))
                }
            }
        });
    })
}

const register = (name ,email) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        let pac = UUID.v4().substr(0,6);
        let adminModel = { email :email ,name :name ,pac :pac };
        Admin.create(adminModel,(err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg : '未知错误' }));
            }else{
                let token = Jwt.issueToken(Config.admin,email,Config.JwtKey);
                if(token){
                    let newAdmin = admin.toObject();
                    newAdmin.token = token;
                    resolve(Object.assign(result ,{ success :true , data :newAdmin }))
                }else{
                    resolve({ success:false , msg :'签发失败' })
                }
                
            }
        });
    });
}


// 该管理员是否为超级管理员
const isRoot = ( email ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        Admin.findOne({ email },'is_root').exec((err ,admin) => {
            if(err){
                resolve(Object.assign(result,{ msg : '未知错误' }));
            }else{
                if(admin){
                    if(admin.is_root === 1){
                        resolve({ success :true });
                    }else{
                        resolve(Object.assign(result,{ msg : '没有权限' }));
                    }
                }else{
                    resolve(Object.assign(result,{ msg : '没有用户' }));
                }       
            }
        })
    });
}


// 向管理员邮箱里发送验证码
const sendPac = (email , pac) => {
    let result = { success :false }
    return new Promise(async (resolve ,reject) => {
        let pct = await Email.send(email,pac);
        resolve(Object.assign(pct));
    });
}

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let adminsPromise = new Promise((resolve ,reject) => {
        Admin.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort({ 'is_root' :-1 })
             .exec((err ,books) => {
                if(err){
                    reject(err)
                }else{
                    resolve(books)
                }
        })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Admin.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        }) 
    });
    
    return new Promise((resolve ,reject) => {
        Promise.all([adminsPromise,countPromise]).then((result) => {
            resolve({ 
                data : result[0],
                pagination : { total :result[1],current :page || 1 ,size :pageSize },
                success :true
            })
        }).catch((err) => {
            resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
        })
    })

}

const remove = (id) => {
    let result = { success :false }
    return new Promise(async (resolve ,reject) => {
        Admin.findById(id).exec((err ,admin) => {
            if(err) {
                resolve(Object.assign(result,{ msg : '未知错误' }));
            }else{
                if(admin){
                    if(admin.is_root == 1){
                        resolve(Object.assign(result,{ msg : '当前用户为最高权限不能删除！' }));
                    }else{
                        Admin.findByIdAndRemove(id).exec((err1 ,admin1) => {
                            if(err1){
                                resolve(Object.assign(result,{ msg : '未知错误' }));
                            }else{
                                if(admin1){
                                    resolve({ success :true });
                                }else{
                                    resolve(Object.assign(result,{ msg : '没有用户' }));
                                }       
                            }
                        })
                    }
                }else{
                    resolve(Object.assign(result,{ msg : '没有找到用户' }));
                }
            }
        })
    });
}


module.exports = {
    login,
    register,
    sendPac,
    find,
    isRoot,
    remove
}