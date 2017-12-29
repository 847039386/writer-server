const Category = require('../proxy').Category;
const Handling = require('../common').Handling;

const getResult = async ( ctx ,next ) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await Category.find(page,size);
    ctx.body = result;
}

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Category.removeById(id);
    }else{
        result = Object.assign(result,{ msg :'删除的键不能为空'});
    }
    ctx.body = result;
}

const create = async (ctx, next) => { 
    let name = Handling.strLength(ctx.request.body.name ,10);
    let result = { success :false };
    if(name){
        result = await Category.create(name);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
} 

const updateById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let name = Handling.strLength(ctx.request.body.name ,10);
    let result = { success :false };
    if(id && name){
        result = await Category.updateById(id ,name);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'});
    }
    ctx.body = result;
}

const search = async ( ctx ,next ) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let name = ctx.query.name || ''
    let result = await Category.find(page,size,{ query : { name : new RegExp(name, 'i') } });
    ctx.body = result;
}


module.exports = {
    getResult,
    removeById,
    create,
    updateById,
    search
}