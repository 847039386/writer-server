const DramaLike = require('../proxy').DramaLike;


const addLike = async ( ctx ,next ) => {
    let result = { success :false };
    let drama_id = ctx.request.body.did;
    let user_id = ctx.request.body.uid;
    if( drama_id && user_id){
        result = await DramaLike.addLike(drama_id,user_id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const isLike = async ( ctx ,next ) => {
    let result = { success :false };
    let drama_id = ctx.query.did;
    let user_id = ctx.query.uid;
    if( drama_id && user_id ){
        result = await DramaLike.isLike(drama_id,user_id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

module.exports = {
    addLike ,isLike
}