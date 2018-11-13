const User = require('../proxy').User;



const getInfo = async (ctx ,next) => {
    let id = ctx.session.user._id.toString();
    let result = { success :false };
    result = await User.findById(id,{
        select:'name avatar follow presentation'
    })
    await ctx.render('user/setting/info', {
        userInfo :result.data,
    })
}

const personal = async ( ctx , next ) => {
    let id = ctx.query.id;
    let result = { success :false };
    result = await User.findById(id,{
        select:'name avatar presentation count'
    })
    if(result.success){
        await ctx.render('personal', {
            userInfo :result.data,
        })
    }else{
        await ctx.render('default/exception', { 
            img:'',
            title :'作者信息',
            desc :`该作者可能不存在，或被限制。`,
            other :true
        })
    }
}

module.exports = {
    getInfo,
    personal
}