const Relation = require('../proxy').Relation;


const follow = async ( ctx ,next ) => {
    let result = { success :false };
    let from_user_id = ctx.request.body.fid;
    let to_user_id = ctx.request.body.tid;
    if( from_user_id && to_user_id && from_user_id != to_user_id){
        result = await Relation.follow(from_user_id,to_user_id);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const isfollow = async ( ctx ,next ) => {
    let result = { success :false };
    let from_user_id = ctx.query.fid;
    let to_user_id = ctx.query.tid;
    if( from_user_id && to_user_id && from_user_id != to_user_id){
        result = await Relation.isfollow(from_user_id,to_user_id);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

/**
 * 获取大佬的粉丝们
 */
const fans = async (ctx ,next) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let to_user_id = ctx.query.id;
    if( to_user_id ){
        result = await Relation.find(page,size,{ 
            query : { to_user_id },
            select : {from_user_id :1 ,_id :0},
            populate : { path :'from_user_id' ,select: 'name avatar' } 
        });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}  
/**
 * 获取粉丝的大佬们
 */
const stars = async (ctx ,next) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let from_user_id = ctx.query.id;
    if( from_user_id ){
        result = await Relation.find(page,size,{ 
            query : { from_user_id },
            select : { to_user_id :1 ,_id :0},
            populate : { path :'to_user_id' ,select: 'name avatar' } 
        });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}  


module.exports = {
    follow ,fans ,stars ,isfollow
}