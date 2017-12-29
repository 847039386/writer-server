const Comment = require('../proxy').Comment;
const Handling = require('../common').Handling;

const findByDramaID = async (ctx, next) => { 
    let result = { success :false };
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let id = ctx.query.id;
    if( id ){
        result = await Comment.find(id ,page ,size,{ populate : { path :'user_id' ,select: { _id :0 ,name:1 ,avatar :1 } } });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const create = async (ctx, next) => { 
    let uid = ctx.request.body.uid;
    let did = ctx.request.body.did;
    let content = Handling.strLength(ctx.request.body.content ,5000);
    let result = { success :false };
    if( uid && did && content ){
        result = await Comment.create(uid ,did ,content);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Comment.removeById(id)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

module.exports = {
    findByDramaID,
    create,
    removeById,
}