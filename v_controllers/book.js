const Book = require('../proxy').Book;
const Handling = require('../common').Handling;

const getResult = async ( ctx ,next ) => {
    let dramaBookList = await ctx.redis.get(`DRAMA-TYPE-BOOK-LIST`);
    if(dramaBookList){
        dramaBookList = JSON.parse(dramaBookList);
    }else{
        let mogoBooks = await Drama.findDramaCountSortBook();
        if(mogoBooks.success){
            ctx.redis.set(`DRAMA-TYPE-BOOK-LIST`,JSON.stringify(mogoBooks),'EX',1000  * 60 * 60 * 1)            // 1小时清除一次
        }
        dramaBookList = mogoBooks;
    }
    const result = dramaBookList;
    ctx.body = result;
}

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Book.removeById(id);
    }else{
        result = Object.assign(result,{ msg :'删除的键不能为空'});
    }
    ctx.body = result;
}

const create = async (ctx, next) => { 
    let name = Handling.strLength(ctx.request.body.name ,10);
    let result = { success :false };
    if(name){
        result = await Book.create(name);
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
        result = await Book.updateById(id ,name);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'});
    }
    ctx.body = result;
}

const search = async ( ctx ,next ) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let name = ctx.query.name || ''
    let result = await Book.find(page,size,{ query : { name : new RegExp(name, 'i') } });
    ctx.body = result;
}


module.exports = {
    getResult,
    removeById,
    create,
    updateById,
    search
}