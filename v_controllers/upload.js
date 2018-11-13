const path = require('path')
const ko2_upload = require('../common/k2_upload')
const { User } = require('../proxy')
const { removeFile } = require('../common/removeUploadFile');
const config = require('../config')


exports.userAvatar = async function (ctx, next){
    let user_id = ctx.session.user ? ctx.session.user._id.toString() : null;
    let result = { success : false}
    if(user_id){
        let k2up = new ko2_upload({
            // uploadPath : 'public/upload/user/avatar'    // 本地
            qn_access : config.upload.qn_access      // 七牛
        });
        let k2Result = await k2up.init( ctx )
        if(k2Result.success){
            result = await User.updateByID(user_id,{ 
                avatar : k2Result.data.url
            })
            if(result.success){
                result = Object.assign(result,{ newAvatar : k2Result.data.url })
                const oldAvatarUrl = result.data.avatar;
                await removeFile(oldAvatarUrl)
                ctx.session.user = Object.assign(ctx.session.user,{
                    avatar : k2Result.data.url
                })
            }
    
        }else{
            result = k2Result;
        }
    }else{
        result = Object.assign(result,{ msg :'验证不通过' })
    }
    ctx.body = result;
}
