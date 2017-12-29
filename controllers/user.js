const User = require('../proxy').User;

const create = async (ctx, next) => { 
    let name = ctx.query.name;
    let result = { success :false };
    if(name){
        result = await User.create(name ,'http://aaa')
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
} 

const getInfo = async (ctx ,next) => {
    let id = ctx.query.id;
    let result = { success :false };
    if(id){
        result = await User.findById(id)
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则。'});
    }
    ctx.body = result;
}


const getAuthors= async (ctx, next) => { 
    let page = parseInt(ctx.query.page) || 1;
    let size = parseInt(ctx.query.size) || 10;
    let result = await User.find(page ,size);
    ctx.body = result;
} 

const getPresentation = async (ctx ,next) => {
    let id = ctx.query.id;
    let result = { success :false };
    if(id){
        result = await User.findById(id ,{ select : 'presentation' })
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则。'});
    }
    ctx.body = result;
}

const setPresentation = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let content = ctx.request.body.content;
    let result = { success :false };
    if(id){
        result = await User.updateByID(id,{ presentation :content },{new: true, fields :'presentation'});
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则。'});
    }
    ctx.body = result;
}

module.exports = {
    getInfo,
    create,
    getPresentation,
    setPresentation
}