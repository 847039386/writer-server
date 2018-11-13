const { UserNotify } = require('../proxy')

const notify = async ( ctx , next ) => {
    let uid = ctx.session.user._id.toString();
    const page = ctx.query.page || 1;
    const pageSize = ctx.query.pageSize || 10;
    let result = await UserNotify.find(page,pageSize,{ 
        query: { user_id :uid  }
        ,sort :{ 'create_at' : -1 , }
        ,populate : { 
            path :'sender drama_id',
            select : 'name title avatar',
        } 
    })
    await ctx.render('user/notify', { 
        notifys :result.data.list,
        current : {
            total :result.data.pagination.total
            ,page :result.data.pagination.current
            ,pageSize :result.data.pagination.size
        }
     })
}


module.exports = {
    notify
}