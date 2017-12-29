const Drama = require('../models').Drama;
const Config = require('../config');

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let dramasPromise = new Promise((resolve ,reject) => {
        Drama.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort({ 'weight' :-1 ,'create_at' :-1 })
             .select(options.select || '')
             .populate(options.populate || '')
             .exec((err ,dramas) => {
                if(err){
                    reject(err)
                }else{
                    resolve(dramas)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Drama.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([dramasPromise,countPromise]).then((result) => {
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

const create = (title ,description ,user_id ,book_id ,category_id) => {
    book_id = book_id || '';
    category_id = category_id || [];
    return new Promise((resolve ,reject) => {
        Drama.create({ title , book_id ,category_id ,description ,user_id },function(err ,data){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data :data , success :true })
            }
        })
    })
}

const removeById = (id) => {
    return new Promise((resolve ,reject) => {
        Drama.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}

const updateById = (id , newDate ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        Drama.findByIdAndUpdate(id,newDate,options).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}


const findById = (id ,options) => {
    options = options || { };
    return new Promise((resolve ,reject) => {
        Drama.findById(id)
             .populate(options.populate || '')
             .select(options.select || '')
             .exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}

module.exports = {
    find ,create ,removeById ,findById ,updateById
}