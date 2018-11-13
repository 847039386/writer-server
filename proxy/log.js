const AdmLog = require('../models').Log;
const Config = require('../config');

/**
 * 根据 opid 与类型 查找数据
 * @param {ObjectID} opid 
 * @param {String} type 
 * @return {Promise}
 */
const findDataByOpid = (opid ,type) => {
    return new Promise((resolve ,reject) => {
        AdmLog.findOne({ opid ,type }).populate({ path : 'log.adminid' ,select :'name avatar' }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true , data :data})
                }else{
                    resolve({ success :true , data : { log :[] }})
                }
            }
        })
    })
}

module.exports = {
    findDataByOpid
}