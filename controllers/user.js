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

module.exports = {
    getInfo,
    getPresentation,
    setPresentation,
    utAvatarAndName,
    getAuthors
}