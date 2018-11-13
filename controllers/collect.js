const { Collect } = require('../proxy');



const userLike = async ( ctx , next ) => {
    const uid = ctx.session.user._id.toString();
    const page = ctx.query.page || 1;
    const pageSize = ctx.query.pageSize || 10;
    let dramas = await Collect.find(page,pageSize,{ 
        query: { user_id :uid , rel_type : 1 }
        ,select :'drama_id'
        ,sort :{ 'reading_week_count' : -1 ,'like_count' :-1 ,'weight' :-1  }
        ,populate : { 
            path :'drama_id',
            select : 'title uv count weight create_at',
            populate : {
                path : 'category_id book_id',
                select :'name'
            } 
        } 
    })

    await ctx.render('user/drama/collects', {
        Dramas :dramas.data.list
        ,current : {
            total :dramas.data.pagination.total
            ,page :dramas.data.pagination.current
            ,pageSize :dramas.data.pagination.size
        }
    })
}



module.exports = {
    userLike
}