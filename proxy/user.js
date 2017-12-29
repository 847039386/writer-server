const User = require('../models').User;
const Config = require('../config');

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let usersPromise = new Promise((resolve ,reject) => {
        User.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort(options.sort || {})
             .select(options.select || 'name avatar follow')
             .exec((err ,users) => {
                if(err){
                    reject(err)
                }else{
                    resolve(users)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        User.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([usersPromise,countPromise]).then((result) => {
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

const create = (name ,avatar) => {
    return new Promise((resolve ,reject) => {
        User.create({ name ,avatar },function(err ,data){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data :data , success :true })
            }
        })
    })
}

const updateByID = (id ,newData ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        User.findByIdAndUpdate(id,newData,options).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data :data , success :true })
            }
        })
    })
}

const findById = ( id ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        User.findById( id )
            .select(options.select || '')
            .exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data : data , success :true })
            }
        })
    })
}

module.exports = {
    create,
    findById,
    find,
    updateByID
}