const Drama = require('../proxy').Drama
const Chapter = require('../proxy').Chapter

const find = async (ctx ,next) => {
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await Drama.find(page,size,{ 
        select : 'title create_at description reading_count weight book_id category_id',
        populate : { path :'category_id book_id' ,select:'name' } 
    });
    ctx.body = result;
}

const search = async (ctx ,next) => {
    const body =  ctx.request.body
    let page = parseInt(body.page) || 1;
    let size = parseInt(body.size) || 10;
    let books = body.books;
    let categorys = body.categorys;
    let search = body.search;
    let timeBegin = body.timeBegin;
    let timeEnd = body.timeEnd;
    let query = {};
    if(books instanceof Array && books.length > 0){
        query = Object.assign(query,{ book_id : { $in :books } })
    }

    if(categorys instanceof Array && categorys.length > 0){
        query = Object.assign(query,{ category_id : { $in :categorys } })
    }

    if(search){
        query = Object.assign(query,{ title :new RegExp(search, 'i') })
    }

    if(timeBegin && timeEnd){
        query = Object.assign(query,{ create_at : { $gte :timeBegin ,$lte :timeEnd }});
    }

    let result = await Drama.find(page,size,{ 
        query : query,
        select : 'title create_at description reading_count weight book_id category_id',
        populate : { path :'category_id book_id' ,select:'name' } 
    });
    ctx.body = result;
}

const create = async ( ctx ,next ) => {
    let result = { success :false }
    const body =  ctx.request.body
    let title = body.title;
    let description = body.description;
    let user_id = body.user_id;
    let book_id = body.book_id;
    let category_id = body.category_id;
    if( title && user_id ){
        result = await Drama.create(title,description,user_id,book_id,category_id);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const findByUserID = async ( ctx ,next ) => {
    let result = { success :false }
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let id = ctx.query.id;
    if( id ){
        result = await Drama.find(page,size,{ query :{ user_id :id } , select : 'title create_at description ' });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const details = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.query.id;
    if( id ){
        result = await Drama.findById(id,{ 
            populate : { path :'category_id book_id user_id' ,select:'name' } 
        });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const remove = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.request.body.id;
    if( id ){
        let promise = Promise.all([Drama.removeById(id),Chapter.remove({ drama_id :id })]);
        let datas = await promise;
        if(datas && datas.length == 2){
            if(datas[0].success && datas[1].success){
                result = { success :true , data :datas[0].data }
            }else{
                result = Object.assign(result ,{ msg :'错误' ,data : datas });
            }
        }else{
            result = Object.assign(result ,{ msg :'错误' });
        }
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const getAbstract = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.query.id;
    if( id ){
        result = await Drama.findById(id,{ 
            select :{_id :0 ,abstract : 1 }
        });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const getCharacter = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.query.id;
    if( id ){
        result = await Drama.findById(id,{ 
            select :{_id :0 ,character : 1 }
        });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const setAbstract = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.request.body.id;
    let content = ctx.request.body.content;
    if( id ){
        result = await Drama.updateById(id ,{ abstract :content }, { new: true ,fields: {_id :0 ,abstract : 1 } });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const setCharacter = async ( ctx ,next ) => {
    let result = { success :false };
    let id = ctx.request.body.id;
    let content = ctx.request.body.content;
    if( id ){
        result = await Drama.updateById(id ,{ character :content }, { new: true ,fields: {_id :0 ,character : 1 } });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}



module.exports = {
    find ,create ,findByUserID ,details ,remove ,getAbstract ,getCharacter ,setAbstract ,setCharacter ,search
}