const Drama = require('../proxy').Drama
const Chapter = require('../proxy').Chapter
const Comment = require('../proxy').Comment

const find = async (ctx ,next) => {
    const page = parseInt(ctx.query.page) || 1;
    const size = parseInt(ctx.query.size) || 10;
    let select = 'title create_at description count status state weight book_id category_id uv user_id';
    let query = { }
    if(ctx.session.role == "admin"){
        select = 'title create_at description count ustatus status state weight book_id category_id uv user_id'
    }else{
        query = { status :0 ,ustatus :0 };
    }
    let result = await Drama.find(page,size,{ 
        query :query,
        select : select,
        populate : { path :'category_id book_id user_id' ,select:'name avatar' } 
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
    let ustatus = body.status;
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

    if(ustatus){
        query = Object.assign(query,{ ustatus })
    }

    let result = await Drama.find(page,size,{ 
        query : query,
        select : 'title create_at description count ustatus status state weight book_id category_id uv user_id',
        populate : { path :'category_id book_id user_id' ,select:'name avatar' } 
    });
    ctx.body = result;
}

const create = async ( ctx ,next ) => {
    let result = { success :false };
    // 正则
    var regEC = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。、？]",'im')
    var regTitleLength = new RegExp("^.{1,15}$",'im')
    var regDescriptLength = new RegExp("^.{20,300}$",'im')
    
    const body =  ctx.request.body
    const title = body.title;
    const description = body.description;
    const user_id = body.user_id;
    const book_id = body.book_id;
    const category_id = body.category_id;
    const state = body.state || 0;
    const ustatus = body.ustatus || 0;
    if( title && user_id && book_id && regDescriptLength.test(description) && regTitleLength.test(title) && !regEC.test(title)){
        result = await Drama.create({ title,description,user_id,book_id,category_id });
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
        result = await Drama.find(page,size,{ 
            query :{ user_id :id ,status :0 ,ustatus :0 } , 
            select : 'title create_at description category_id' ,
            populate : { path :'category_id book_id' ,select:'name' } 
        });
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
        let promise = Promise.all([Drama.removeById(id),Chapter.remove({ drama_id :id }),Comment.remove({drama_id :id})]);
        let datas = await promise;
        if(datas && datas.length == 3){
            if(datas[0].success && datas[1].success && datas[2].success){
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

const userUpdateById = async ( ctx ,next ) => {
    let result = { success :false };
    var regEC = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。、？]",'im')
    var regTitleLength = new RegExp("^.{1,15}$",'im')
    var regDescriptLength = new RegExp("^.{20,300}$",'im')
    const body =  ctx.request.body;
    const id = body.id;
    const title = body.title;
    const description = body.description;
    const book_id = body.book_id;
    const state = body.state;
    const ustatus = body.ustatus;
    const category_id = body.category_id;
    if( id && title && book_id && regDescriptLength.test(description) && regTitleLength.test(title) && !regEC.test(title)){
        result = await Drama.updateById(id ,{ 
            title,description,book_id,category_id,state,ustatus
        }, { new: true });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const lmtShow = async ( ctx ,next) => {
    let result = { success :false };
    const body =  ctx.request.body;
    let id = body.id;
    let status = body.status;
    let userid = body.userid;
    let logContent = body.logContent;
    let message = body.message
    if( id ){
        result = await Drama.lmtShow({
            id :id
            ,adminid : ctx.headers['aud']
            ,status :status
            ,userid
            ,log :logContent
            ,message
        })
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}



const fakeChartData = async ( ctx ,next) => {
    const result = await Drama.fakeChartData();
    ctx.body = {
        api_chart : result
    };
}



module.exports = {
    find 
    ,create 
    ,findByUserID 
    ,details 
    ,remove 
    ,getAbstract 
    ,getCharacter 
    ,setAbstract 
    ,setCharacter 
    ,search 
    ,userUpdateById
    ,lmtShow
    ,fakeChartData
}