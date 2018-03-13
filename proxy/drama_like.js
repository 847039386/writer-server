const DramaLike = require('../models').DramaLike;
const Drama = require('../models').Drama
const Config = require('../config');
const UserNotify = require('./user_notify')

/**
 * 
 */

 const addLike = ( drama_id , user_id ) =>{
    return new Promise((resolve ,reject) => {
        DramaLike.findOne({drama_id , user_id},'rel_type').exec((erro , dramalike) => {
            if(erro){
                resolve({ success:false , msg :Config.debug ? erro.message :'未知错误' })  
            }else{
                if(dramalike){
                    resolve({ success:false , msg :'已经点赞' })  
                }else{
                    DramaLike.create({ drama_id ,user_id },function(err ,data){
                        if(err){
                            resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })    
                        }else{
                            Drama.findByIdAndUpdate(drama_id,{ $inc :{ like_count :1 } },{ new :true ,fields : 'like_count' }).exec((errd , dramas) => {
                                if(errd){
                                    resolve({ success:false , msg :Config.debug ? errd.message :'未知错误' })  
                                }else{
                                    if(dramas){
                                        Drama.findById(drama_id,'_id user_id').then(async (data) => {
                                            if(data.user_id){
                                                await UserNotify.createDramaRemind(user_id, 'like' ,data.user_id ,drama_id)
                                            }
                                        })
                                        resolve({ success:true , data :dramas }) 
                                    }else{
                                        resolve({ success:false , msg :'错误的剧本键' })  
                                    }
                                }
                            })
                        }
                    })
                }
            }
       })
    })
 }

const isLike = (drama_id , user_id) => {
    return new Promise((resolve ,reject) => {
        DramaLike.findOne({ drama_id ,user_id ,rel_type : { $in : [0,1]} }).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })            
            }else{
                if(data){
                    resolve({success :true ,data :true}) 
                }else{
                    resolve({success :true ,data :false}) 
                }
            }
        })
    })
}


module.exports = {
    addLike ,isLike
}