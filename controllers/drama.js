const { Drama ,Chapter ,Book ,Category ,Comment } = require('../proxy')
const { Handling } = require('../common');
const async = require('async');

// 剧本列表页
const list = async ( ctx , next ) => {
    const homeData = ctx.homeData;
    const hotCategory = homeData[6];            // 热门的剧情信息
    const page = ctx.params['page'] || 1;       // 页数

    let book = ctx.session.dramasBookType;
    let bookKey = book;
    if(book == 'ALL' || book == '' || !book ){
        book = ''
        bookKey = 'ALL'
    }
    let category = ctx.session.dramasCategoryType;
    let categoryKey = category;
    if(category == 'ALL' || category == '' || !category ){
        category = ''
        categoryKey = 'ALL'
    }

    let default_condition= {     
        query :{ status :0 ,ustatus :0 }
        ,select :'title description count uv status ustatus create_at'
        ,sort :{ 'create_at' : -1 }
        ,populate : { path :'category_id book_id user_id' ,select:'name avatar' } 
    } 

    let default_condition_query = { };
    if(book){
        default_condition_query = { book_id : book }
    }

    if(category){
        Object.assign(default_condition_query,{ category_id : category })
    }

    default_condition = Object.assign(default_condition,{ query : Object.assign(default_condition.query || {},default_condition_query) })

    // 获取数据 
    let dramaList = {};
    let redisDramaData = await ctx.redis.get(`DRAMA-TLIST-${page}-${bookKey}-${categoryKey}`);
    if(redisDramaData){
        dramaList = JSON.parse(redisDramaData);
    }else{
        let mogoDramaData = await Drama.find(page,10,default_condition);
        if(mogoDramaData.success){
            ctx.redis.set(`DRAMA-TLIST-${page}-${bookKey}-${categoryKey}`,JSON.stringify(mogoDramaData),'EX',1000  * 60 * 60 * 1);   // 一小时清空一次
        }
        dramaList = mogoDramaData;
    }

    // 获取 剧本类型列表
    let dramaBookList = await ctx.redis.get(`DRAMA-TYPE-BOOK-LIST`);
    if(dramaBookList){
        dramaBookList = JSON.parse(dramaBookList);
    }else{
        let mogoBooks = await Drama.findDramaCountSortBook();
        if(mogoBooks.success){
            ctx.redis.set(`DRAMA-TYPE-BOOK-LIST`,JSON.stringify(mogoBooks),'EX',1000  * 60 * 60 * 1)            // 1小时清除一次
        }
        dramaBookList = mogoBooks;
    }

    // 获取列表点赞行为
    if(dramaList.success && ctx.UID && dramaList.data.list.length > 0){
        let goodPromise = function () {
            return new Promise((resolve ,reject) => {
                async.map(dramaList.data.list,(item, callback) => {
                    async.auto({
                        status : (cb) => {
                            ctx.redis.sismember(`DRAMA-LIKE-ID-${item._id}`,ctx.UID,function(err,res){
                                if(err){
                                    cb(null,0)
                                }else{
                                    cb(null,res);
                                }
                            });
                        }
                    },(err ,results) => {
                        if(err){
                            callback(null,{ status :0 });
                        }else{
                            callback(null,{ status :results.status });
                        }
                    })
                }, function(err,results) {
                    if(err){
                        resolve([])
                    }else if(results.length > 0){
                        resolve(results)
                    }else{
                        resolve([])
                    }
                });
            });
        }
        const goodList = await goodPromise();
        if(goodList.length > 0){
            dramaList.data.list.map((item ,i) => {
                item.ugood = goodList[i].status;       // 该用户的点赞情况
            })
        }
    }

    // 获取剧情类型
    let dramaCategoryList = await ctx.redis.get(`DRAMA-TYPE-CATEGORY-LIST`);
    if(dramaCategoryList){
        dramaCategoryList = JSON.parse(dramaCategoryList);
    }else{
        let mogoCategorys = await Drama.findDramaCountSortCategory();
        if(mogoCategorys.success){
            ctx.redis.set(`DRAMA-TYPE-CATEGORY-LIST`,JSON.stringify(mogoCategorys),'EX',1000  * 60 * 60 * 1)            // 1小时清除一次
        }
        dramaCategoryList = mogoCategorys;
    }

    let dramas = dramaList.data         // 热门
    let categorys = dramaCategoryList.data
    let books = dramaBookList.data;
    await ctx.render('drama-list', {
        dramas  
        ,categorys
        ,books
        ,current : {
            book : book || ''
            ,category : category || ''
            ,total : dramas.pagination.total
            ,page :dramas.pagination.current
            ,pageSize :dramas.pagination.size
        }
        ,weekRanking : homeData[3].data.list
        ,monthRanking : homeData[4].data.list
        ,hotCategory
    })
}

// 剧本详情页

const article = async ( ctx , next ) => {
    const id = ctx.query.id;
    let result = await Promise.all([
        Drama.findById(id,{
            populate : { path :'category_id book_id user_id' ,select:'name avatar' }
        })
        ,Chapter.find(1 ,999 ,{ 
            query : { drama_id : id } 
            ,sort :{ 'chapterorder' : 1 }
        })
    ]);
    let chapter = [];
    let drama = { };
    let oneChapter = {};
    if(result[0].success){
        drama = result[0].data;
        drama.abstract = drama.abstract ? drama.abstract.replace(/\n/g,'<br/>') : ''
        drama.character = drama.character ? drama.character.replace(/\n/g,'<br/>') : ''
    }

    if(result[1].success){
        chapter = result[1].data;
    }
    if(result[0].success && result[1].success){
        if(result[0].data.status == 1){
            await ctx.render('default/exception', { 
                img:'',
                title :'剧本限制',
                desc :`剧本已被管理员取消展示。`,
                other :true
            })
        }else if(result[0].data.ustatus == 1){
            await ctx.render('default/exception', { 
                img:'',
                title :'剧本限制',
                desc :`剧本已被作者取消展示。`,
                other :true
            })
        }else{
            if(ctx.UID){
                const like_status = await ctx.redis.sismember(`DRAMA-LIKE-ID-${id}`,ctx.UID)
                drama = Object.assign(drama ,{ ugood :like_status  })
            }
            await ctx.render('drama-article', {
                drama :drama,
                chapter :chapter.list,
                newsChapter :result[1].data.list[result[1].data.list.length - 1 ],
                oneChapter :result[1].data.list[0]
            })
        }
    }else{
        await ctx.render('default/exception', { 
            img:'',
            title :'剧本错误',
            desc :`原因是：剧本不存在。`,
            other :true
        })
    }



    
}

const selectedCategoryType = async ( ctx , next ) => {
    ctx.session.dramasCategoryType = ctx.query['id'] || 'ALL';
    if(ctx.query['t']){
        ctx.session.dramasBookType = '';
    }
    ctx.redirect('/dramas/1');
}

const selectedBookType = async ( ctx , next ) => {
    ctx.session.dramasBookType = ctx.query['id'] || 'ALL';
    ctx.redirect('/dramas/1');
}

const userDramaList = async ( ctx , next ) => {
    const page = ctx.query.page || 1;
    const user = ctx.session.user
    const dramas = await Drama.find(page,5,{ 
        query : { user_id : user._id.toString() } 
        ,select :'title description count create_at uv'
        ,sort :{ 'create_at' : -1 }
        ,populate : { path :'category_id book_id user_id' ,select:'name' } 
    })
    await ctx.render('user/drama/list', {
        Dramas :dramas.data.list
        ,current : {
            total :dramas.data.pagination.total
            ,page :dramas.data.pagination.current
            ,pageSize :dramas.data.pagination.size
        }
    })
}

const otherGongneng = async ( ctx , next ) => {
    const id = ctx.query.id;
    const drama = await Drama.findById(id,{
        select :'character abstract title create_at'
    })
    await ctx.render('user/drama/other', {
        drama :drama.data
    })
}

const userDramaSetting = async ( ctx , next ) => {
    const id = ctx.query.id;
    let result = await Promise.all([
        Drama.findById(id,{
            populate : { path :'category_id book_id' ,select:'name' } 
        })
        ,Book.find(1 ,999 ,{})
    ]);
    const drama = await Drama.findById(id,{
        populate : { path :'category_id book_id' ,select:'name' } 
    })
    await ctx.render('user/drama/setting', {
        drama :result[0].data,
        books :result[1].data.list
    })
}

const createDramaHtml = async ( ctx , next ) => {
    let result = await Book.find(1 ,999 ,{})
    await ctx.render('user/drama/create', {
        books :result.data.list
    })
}


const search = async ( ctx , next ) => {
    const field = ctx.query.field || '';
    const page = ctx.query.page || 1;
    const size = ctx.query.size || 10;
    const homeData = ctx.homeData;
    const dramas = await Drama.find(page,size,{ 
        query :{ 
            status :0 
            ,ustatus :0
            ,$or :[
                { title:new RegExp(field, 'i') },
                { description: new RegExp(field, 'i') } ,
            ]
        }
        ,select :'title description count create_at uv'
        ,sort :{ 'weight' :-1 ,'create_at' :-1 }
        ,populate : { path :'category_id book_id user_id' ,select:'name avatar' }  
    })
    if(dramas.success && ctx.UID && dramas.data.list.length > 0){
        let goodPromise = function () {
            return new Promise((resolve ,reject) => {
                async.map(dramas.data.list,(item, callback) => {
                    async.auto({
                        status : (cb) => {
                            ctx.redis.sismember(`DRAMA-LIKE-ID-${item._id}`,ctx.UID,function(err,res){
                                if(err){
                                    cb(null,0)
                                }else{
                                    cb(null,res);
                                }
                            });
                        }
                    },(err ,results) => {
                        if(err){
                            callback(null,{ status :0 });
                        }else{
                            callback(null,{ status :results.status });
                        }
                    })
                }, function(err,results) {
                    if(err){
                        resolve([])
                    }else if(results.length > 0){
                        resolve(results)
                    }else{
                        resolve([])
                    }
                });
            });
        }
        const goodList = await goodPromise();
        if(goodList.length > 0){
            dramas.data.list.map((item ,i) => {
                item.ugood = goodList[i].status;       // 该用户的点赞情况
            })
        }
    }
    await ctx.render('search-drama', {
        search_field : field
        ,Dramas :dramas.data.list
        ,current : {
            total :dramas.data.pagination.total
            ,page :dramas.data.pagination.current
            ,pageSize :dramas.data.pagination.size
        }
        ,weekRanking : homeData[3].data.list
        ,monthRanking : homeData[4].data.list
        ,hotCategory :homeData[6] 
    })
}




module.exports = {
    list,
    article,
    selectedCategoryType,
    selectedBookType,
    userDramaList,
    createDramaHtml,
    search,
    otherGongneng,
    userDramaSetting
}