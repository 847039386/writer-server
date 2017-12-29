const Topic = require('../models').Topic;
const Config = require('../config');

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let topicsPromise = new Promise((resolve ,reject) => {
        Topic.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort({ 'weight' :-1 ,'create_at' :-1 })
             .select('title create_at weight')
             .exec((err ,topics) => {
                if(err){
                    reject(err)
                }else{
                    resolve(topics)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Topic.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([topicsPromise,countPromise]).then((result) => {
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

const create = (title ,content) => {
    return new Promise((resolve ,reject) => {
        Topic.create({ title ,content },function(err ,data){
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
        Topic.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}

const findById = (id) => {
    return new Promise((resolve ,reject) => {
        Topic.findById(id).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}

module.exports = {
    find ,create ,removeById ,findById
}