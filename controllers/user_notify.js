const UserNotify = require('../proxy').UserNotify;
const Handling = require('../common').Handling;

const getNotifyByUserID = async (ctx, next) => { 
    let result = { success : false }
    let user_id = ctx.query.id
    if(user_id){
        let page = parseInt(ctx.query.page) || 1;
        let size = parseInt(ctx.query.size) || 10;
        result = await UserNotify.find(page ,size,{ 
            query :{ user_id },
            sort : { 'create_at' : -1 },
            populate :[
                {path: 'drama_id', select: 'title'},
                {path: 'user_id', select: 'name'},
                {path: 'sender', select: 'name'}
            ]
        });
    }
    ctx.body = result;
} 

const findUserIDAndRemove = async (ctx ,next) => {
    let result = { success : false }
    let user_id =  ctx.request.body.uid;
    if(user_id){
        result = await UserNotify.findUserIDAndRemove(user_id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

module.exports = {
    getNotifyByUserID,
    findUserIDAndRemove
}