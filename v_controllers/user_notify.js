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

const createUserPrivateLetter = async (ctx ,next) => {
    let result = { success : false }
    let sid =  ctx.request.body.sid;
    let uid =  ctx.request.body.uid;
    let content =  ctx.request.body.content;
    let action =  ctx.request.body.action ? ctx.request.body.action : 'normal';
    if(sid && uid && content){
        result = await UserNotify.createUserPrivateLetter(sid,uid,content,action)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const createAdminPrivateLetter = async (ctx ,next) => {
    let result = { success : false }
    let uid =  ctx.request.body.uid;
    let content =  ctx.request.body.content;
    if(uid && content){
        result = await UserNotify.createAdminPrivateLetter(uid ,content);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 


const removeByID = async (ctx ,next) => {
    let result = { success : false }
    const id =  ctx.request.body.id;
    if(id){
        result = await UserNotify.removeByID(id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}



module.exports = {
    getNotifyByUserID,
    findUserIDAndRemove,
    createUserPrivateLetter,
    createAdminPrivateLetter,
    removeByID
}