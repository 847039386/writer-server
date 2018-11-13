const User = require('../proxy').User;

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
    let result = await User.find({ page ,pageSize :size });
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

const utAvatarAndName = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let name = ctx.request.body.name;
    let avatar = ctx.request.body.avatar;
    let result = { success :false };
    if(id && name && avatar){
        if(name.length > 0 && name.length <= 10){
            result = await User.updateByID(id,{ name ,avatar },{new:true});
        }else{
            result = Object.assign(result,{ msg :'昵称的长度应在1-10长度内'});
        }
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则。'});
    }
    ctx.body = result;
}

const utName = async (ctx ,next) => {
    let id = ctx.request.body.id;
    let name = ctx.request.body.name;
    let result = { success :false };
    if(id && name){
        if(name.length > 0 && name.length <= 10){
            result = await User.updateByID(id,{ name },{new:true ,fields:'name'});
        }else{
            result = Object.assign(result,{ msg :'昵称的长度应在1-10长度内'});
        }
    }else{
        result = Object.assign(result,{ msg :'参数不符合规则。'});
    }
    ctx.body = result;
}

// 限制登陆
const constraintLogin = async (ctx ,next) => {
    let result = { success :false };
    const body =  ctx.request.body;
    let id = body.id;
    let status = body.status;
    let logContent = body.logContent;
    let message = body.message
    if( id ){
        result = await User.constraintLogin({
            id :id
            ,adminid : ctx.headers['aud']
            ,status :status
            ,log :logContent
            ,message
        })
    }else{
        result = Object.assign(result ,{ msg :'参数不符合规则。' });
    }
    ctx.body = result;
}

const asearch = async (ctx ,next) => {
    const body =  ctx.request.body
    let page = parseInt(body.page) || 1;
    let size = parseInt(body.size) || 10;
    let _id = body.uid;
    let name = body.name;
    let status = body.status;
    let query = {};

    if(_id){
        query = Object.assign(query,{ _id })
    }

    if(name){
        query = Object.assign(query,{ name :new RegExp(name, 'i')  })
    }

    if(!isNaN(status)){
        query = Object.assign(query,{ status })
    }

    let result = await User.find({ 
        page :page,
        pageSize :page,
        query : query,
    });
    ctx.body = result;
}

module.exports = {
    getInfo,
    getPresentation,
    setPresentation,
    utAvatarAndName,
    getAuthors,
    utName,
    constraintLogin,
    asearch
}