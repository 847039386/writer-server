const Collect = require('../proxy').Collect;

const isLike = async ( ctx ,next ) => {
    let result = { success :false };
    let drama_id = ctx.query.did;
    let user_id = ctx.query.uid;
    if( drama_id && user_id ){
        result = await Collect.isLike(drama_id,user_id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const collect = async ( ctx ,next ) => {
    let result = { success :false };
    let drama_id = ctx.request.body.did;
    let user_id = ctx.request.body.uid;
    if( drama_id && user_id ){
        result = await Collect.collect(drama_id,user_id)
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const collectList = async ( ctx ,next ) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let uid = ctx.query.uid;
    let result = await Collect.find(page,size,{ 
        query :{ user_id : uid }
        ,select : 'drama_id rel_type user_id'
        ,populate : { 
            path :'drama_id' 
            ,select:'title create_at description category_id'
            ,populate :{ path :'category_id book_id' ,select:'name' } 
            ,match : {
                status :0 ,ustatus :0 
            }
        } 
    });
    let newDaram = []
    if(result.data.length > 0){
        result.data.forEach(item => {
            newDaram.push(item.drama_id)
        });
        result = Object.assign(result,{ data : newDaram });
    }
    ctx.body = result;
}


module.exports = {
    isLike ,collect ,collectList
}