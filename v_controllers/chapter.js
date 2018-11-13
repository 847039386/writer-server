const Chapter = require('../proxy').Chapter;
const Handling = require('../common').Handling;

const findByDramaID = async (ctx, next) => { 
    let result = { success :false };
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let id = ctx.query.id;
    if(id){
        result = await Chapter.find(page ,size ,{ query : { drama_id : id } });
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则' });
    }
    ctx.body = result;
} 

const create = async (ctx, next) => { 
    let title = Handling.strLength(ctx.request.body.title ,15);
    let content = Handling.strLength(ctx.request.body.content ,5000);
    let id = ctx.request.body.id
    let result = { success :false };
    if( title && content && id ){
        result = await Chapter.create(id,title,content);
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const removeById = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let result = { success :false };
    if(id){
        result = await Chapter.removeById(id);
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const findById = async ( ctx ,next ) => {
    let id = ctx.query.id;
    let result = { success :false }
    if(id){
        result = await Chapter.findById(id)
        if(result.success){
            let newData = result.data;
            newData = Object.assign(newData,{ htmlContent : result.data.content.replace(/\r\n/g, '<br/><br/>').replace(/\n/g, '<br/><br/>').replace(/\s/g, ' ') })
            result = Object.assign(result, { data : newData } )
        }
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const updateById = async ( ctx ,next ) => {
    let id = ctx.request.body.id;
    let title = Handling.strLength(ctx.request.body.title ,15);
    let content = Handling.strLength(ctx.request.body.content ,5000);
    let result = { success :false }
    if( title && content && id ){
        result = await Chapter.updateById(id,{ 
            title
            ,content
            ,wordCount: content.length 
        },{ new: true})
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'})
    }
    ctx.body = result;
}

const updateOrder = async ( ctx ,next ) =>{
    let result = { success :false }
    let bid = ctx.request.body.bid;
    let eid = ctx.request.body.eid;
    if(bid === eid){
        result = Object.assign(result,{ msg :'参数一样驳回请求'});
    }else if( bid && eid ){
        if( eid === 'top'){
            result = await  Chapter.updateOrder(bid);
        }else {
            result = await  Chapter.updateOrder(bid,eid);
        }
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则'});
    }
    ctx.body = result;
}


module.exports = {
    findByDramaID,
    create,
    removeById,
    findById,
    updateById,
    updateOrder
}