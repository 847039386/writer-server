const AdmLog = require('../proxy').Log;

const findDataByOpid = async (ctx, next) => { 
    const opid = ctx.query.opid;
    const type = ctx.query.type;
    let result = { }
    if( opid && type){
        result = await AdmLog.findDataByOpid(opid,type)
    }else{
        result = { msg :'参数不符合规则。' }
    }
    ctx.body = result;
} 


module.exports = {
    findDataByOpid
}