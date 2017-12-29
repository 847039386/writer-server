const Category = require('../models').Category;
const Config = require('../config');

const create = ( name ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        Category.create({ name :name },(err, data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    });
}

const updateById = ( id , name) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        Category.findByIdAndUpdate(id,{name},{new:true}).exec((err ,data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    })
}

const removeById = ( id ) => {
    let result = { success :false };
    return new Promise((resolve ,reject) => {
        Category.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                resolve(Object.assign(result,{ msg :Config.debug ? err.message :'未知错误' }));
            }else{  
                resolve(Object.assign(result,{ success :true ,data :data }));
            }
        })
    })
}

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let categorysPromise = new Promise((resolve ,reject) => {
        Category.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort({ 'create_at' :-1 })
             .exec((err ,categorys) => {
                if(err){
                    reject(err)
                }else{
                    resolve(categorys)
                }
        })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Category.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        }) 
    });
    
    return new Promise((resolve ,reject) => {
        Promise.all([categorysPromise,countPromise]).then((result) => {
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

module.exports = {
    create ,updateById ,removeById ,find
}