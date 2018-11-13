const Topic = require('../proxy').Topic;
const Handling = require('../common').Handling;

const getResult = async (ctx, next) => { 
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await Topic.find(page ,size);
    ctx.body = result;
} 

const create = async (ctx, next) => { 
    let title = Handling.strLength(ctx.request.body.title ,15);
    let content = Handling.strLength(ctx.request.body.content ,5000);
    let result = { success :false };
    if( title && content){
        result = await Topic.create(title,content);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    
    ctx.body = result;
} 

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Topic.removeById(id);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const findById = async ( ctx ,next ) => {
    let id = ctx.query.id;
    let result = { success :false }
    if(id){
        result = await Topic.findById(id)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

module.exports = {
    getResult,
    create,
    removeById,
    findById
}