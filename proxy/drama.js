const Drama = require('../models').Drama;
const Category = require('../models').Category;
const Book = require('../models').Book;
const UserNotify = require('../models').UserNotify;
const AdmLog = require('../models').Log;
const Handling = require('../common').Handling
const Config = require('../config');
const Async = require('async');
const array = require('array');

const find = (page ,pageSize ,options) => {
    let result = { success :false }
    const realPage = page <= 0 ? 0 : page - 1;
    pageSize = pageSize || 10;
    options = options || {};
    let dramasPromise = new Promise((resolve ,reject) => {
        Drama.find(options.query || {})
             .limit(pageSize || 10)
             .skip(realPage * pageSize)
             .sort(options.sort || { 'weight' :-1 ,'create_at' :-1 })
             .select(options.select || '')
             .populate(options.populate || '')
             .exec((err ,dramas) => {
                if(err){
                    reject(err)
                }else{
                    resolve(dramas)
                }
             })
    });

    let countPromise = new Promise((resolve ,reject) => {
        Drama.count(options.query || {}).exec((err ,count) => {
            if(err){
                reject(err)
            }else{
                resolve(count)
            }
        })  
    });

    return new Promise((resolve ,reject) => {
        Promise.all([dramasPromise,countPromise]).then((result) => {
            resolve({ 
                data : {
                    list : result[0],
                    pagination : { total :result[1],current :page || 1 ,size :pageSize }
                },
                success :true
            })
        }).catch((err) => {
            resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
        })
    })

}

const create = (options) => {
    const title = options.title ;
    const description = options.description;
    const user_id = options.user_id;
    const book_id = options.book_id;
    const category_id = options.category_id || [];
    const state = options.state || 0;
    const ustatus = options.ustatus || 0;
    return new Promise((resolve ,reject) => {
        Drama.create({ title , book_id ,category_id ,description ,user_id ,state ,ustatus },function(err ,data){
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ data :data , success :true })
            }
        })
    })
}

const removeById = (id) => {
    return new Promise((resolve ,reject) => {
        Drama.findByIdAndRemove(id).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true , data :data})
                }else{
                    resolve({ success :false , msg :'错误的ID'})
                }
            }
        })
    })
}

const updateById = (id , newDate ,options) => {
    options = options || {}
    return new Promise((resolve ,reject) => {
        Drama.findByIdAndUpdate(id,newDate,options).exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                if(data){
                    resolve({ success :true , data :data})
                }else{
                    resolve({ success :false , msg :'错误的ID'})
                }
            }
        })
    })
}


const findById = (id ,options) => {
    options = options || { };
    return new Promise((resolve ,reject) => {
        Drama.findById(id)
             .populate(options.populate || '')
             .select(options.select || '')
             .exec((err ,data) => {
            if(err){
                resolve({ success:false , msg :Config.debug ? err.message :'未知错误' })
            }else{
                resolve({ success :true , data :data})
            }
        })
    })
}




const getMaxCategoryCount = () =>{
    return new Promise((resolve ,reject) => {
        Async.auto({
            getCategorys : function(callback){
                Category.find({},'name').lean().exec((err ,dosc) => {
                    if(!err && dosc.length > 0){
                        callback(null,dosc)
                    }else{
                        callback(true)
                    }
                })
            },
            getCategorysCount: ['getCategorys' , function(asr ,callback) {
                let categorys = asr.getCategorys;
                Async.map(categorys ,function(category ,cb){
                    Drama.count({ category_id : category._id }).exec((err ,count) => {
                        if(err){
                            cb(null)
                        }else{
                            cb(null,Object.assign(category,{count}))
                        }
                    })
                },function(err ,counts){
                    if(err){
                        callback(true)
                    }else{
                        callback(null,counts.sort(Handling.compare('count')))
                    }
                })
            }],
        }, function(err, results) {
            if(err){
                resolve([])
            }else{
                resolve(results.getCategorysCount)
            }
        });
    })
}

const hotCategoryData = (categorys ,maxcount) => {
    return new Promise((resolve ,reject) => {
        if(categorys.length > maxcount){
            categorys = categorys.slice(0,maxcount)
        }
        Async.map(categorys ,function(category ,cb){
            Drama.find({ category_id : category._id ,status :0 ,ustatus :0 },'title').limit(10).sort({ 'reading_week_count' : -1 }).exec((err,dosc) => {
                if(err){
                    cb(null)
                }else{
                    cb(null,Object.assign(category,{data :dosc}))
                }
            })
        },function(err ,datas){
            if(err){
                resolve([])
            }else{
                resolve(datas)
            }
        })
    })
}

/**
 * 这里没调用一次 周、月浏览自增1 。定时任务每月每日清零周月浏览量。利用redis缓存客户端IP判断是否自增。这里只调取方法
 * @param {*} id 文章id 
 */
const addReadingCount = (id) => {
    return updateById(id , { 
        $inc : { 
            "uv.day" : 1 
            ,"uv.week" : 1 
            ,"uv.month" : 1 
            ,"uv.total" : 1 
        }
    } ,{ fields :'uv create_at' });
}

/**
 * 管理员管理剧本展示
 * @method lmtShow  
 * @param {Object} option 选项 
 * @return {Promise} promise对象
 * @example 
 * option.id 剧本id
 * option.adminid 管理员id 
 * option.status 剧本的管理状态
 * option.userid 所属用户id
 * option.log 日志备注
 * option.message 像用户发送消息
 */
const lmtShow = (option) => {
    const id = option.id;
    const status = option.status;
    const user_id = option.userid;
    const log = option.log;
    const message = option.message || '';
    const adminid = option.adminid || '';
    return new Promise((resolve ,reject) => {
        Async.auto({
            // 修改剧本
            update : ( callback ) => {
                Drama.findByIdAndUpdate(id,{ status },{ new :true ,fields :'title status' }).exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            // 当前剧本是否有日志
            isLog : (callback) => {
                AdmLog.findOne({ type :'drama' ,opid : id }).exec((err ,dosc) => {
                    if(err){
                        callback(err)
                    }else{
                        if(dosc){
                            callback(null,dosc._id);
                        }else{
                            callback(null,null);
                        }
                    }
                })
            },
            // 给用户发送信息
            sendMessage :(callback) => {
                if(message && user_id){
                    UserNotify.create({ type :3 , action :'normal' ,targetType : 'admin' ,user_id ,content :message },(err, dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }else{
                    callback(null,message);
                }
            },
            // 添加日志信息
            recordLog :['isLog',(results ,callback) => {
                let logid = results.isLog;      // 如果有值则得到查找到的日志ID
                if(logid){
                    AdmLog.findByIdAndUpdate(logid,{ 
                        $push : {
                            log : {
                                adminid,
                                content :log
                            }
                        }
                    }).exec((err ,dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }else{
                    AdmLog.create({ opid :id ,type :'drama' ,log : [{ adminid ,content :log }] },(err ,dosc) => {
                        err ? callback(err) : callback(null,dosc)
                    })
                }
            }]
        },(err ,results) => {
            let result = { success :false , msg :'未知错误' }
            if(err){
                result = Object({ msg : err.message });
            }else{
                const data = results.update;
                result = { success :true ,data }
            }
            resolve(result);
        })
    })
} 

const fakeChartData = () => {
    return new Promise((resolve ,reject) => {
        const oneday = 1000 * 60 * 60 * 24;     // 一天时间
        let today = new Date();                 // 今天
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        Async.auto({
            getDramaCount :(callback) => {
                Drama.count({}).exec((err ,count) => {
                    err ? callback(err) : callback(null,count)
                })
            },
            getBooks :(callback) => {
                Book.find({},'name').lean().exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            getCategorys :(callback) => {
                Category.find({},'name').lean().exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            BookCount :(callback) => {
                Drama.aggregate([
                    {$project: { _id: 1, book_id : 1 } },
                    {$group : {_id : '$book_id',count: { $sum:1 }}},
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            CategoryCount :(callback) => {
                Drama.aggregate([
                    { "$unwind" : "$category_id" },
                    { $group : { _id : '$category_id',count: { $sum: 1 } } },
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            DramaTimeCtCount :(callback) => {
                Drama.aggregate([
                    { $match: {create_at: { $gte: new Date(today - (30 * oneday) ), $lte: new Date() }}},
                    { $project : { day : {$substr: ["$create_at", 0, 10] }}},          
                    { $group   : { _id : "$day" ,y : { $sum : 1 }}},
                    { $project : { x:'$_id' ,y:'$y' }},   
                    { $sort    : { _id : -1 }},
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            totalUV :(callback) => {
                Drama.aggregate([
                    { $project:{ uv :1}},
                    { $group   : { _id :null ,count : { $sum : '$uv.total' }}},  
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            yesterdayCount :(callback) => {
                Drama.count({ create_at : { "$gte" : new Date(today -oneday) , "$lt" : new Date(today) } }).exec((err ,count) => {
                    err ? callback(err) : callback(null,count)
                })
            },
            handleBookCount :['getBooks','BookCount',(results ,callback) => {
                let oldBooks = results.getBooks;
                const oldBooksCount = results.BookCount;
                let newBooks = []
                oldBooks.map((obk) => {
                    const id = obk._id;
                    let y = 0;
                    oldBooksCount.map((obc) => {
                        if(obc._id.toString() == id.toString()){
                            y = obc.count;
                        }
                    })
                    newBooks.push({ _id:obk._id ,x :obk.name ,y })
                })
                callback(null,newBooks)
            }],
            handleCategoryCount :['getCategorys','CategoryCount',(results ,callback) => {
                let oldBooks = results.getCategorys;
                const oldBooksCount = results.CategoryCount;
                let newBooks = []
                oldBooks.map((obk) => {
                    const id = obk._id;
                    let y = 0;
                    oldBooksCount.map((obc) => {
                        if(obc._id.toString() == id.toString()){
                            y = obc.count;
                        }
                    })
                    newBooks.push({ _id:obk._id ,x :obk.name ,y })
                })
                callback(null,newBooks)
            }],
        },(err ,results) => {
            err ? resolve(err) : resolve({
                count : results.getDramaCount,                                  // 剧本总数量
                BookCount : results.handleBookCount,                            // 剧本类型数量（占比）
                categoryCount : results.handleCategoryCount,                    //剧情类型数量（占比）
                ctDramaCount : results.DramaTimeCtCount,                        // 近30日剧本创建数量
                totalUv :results.totalUV[0] ? results.totalUV[0].count : 0,      // 总UV
                yesterdayCount : results.yesterdayCount,
            })
        })
    })
}

/**
 * 根据 剧本数量 排序 剧本类型
 */
const findDramaCountSortBook = () => {
    return new Promise((resolve ,reject) => {
        Async.auto({
            getBookAll :(callback) => {
                Book.find({},'name').lean().exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            getExistBooks :(callback) => {
                Drama.aggregate([
                    {$project: { _id: 1, book_id : 1 } },
                    {$group : {_id : '$book_id',count: { $sum:1 }}},
                    {$sort  : { count : -1 }}
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            handleBookCount :['getBookAll','getExistBooks',(results ,callback) => {
                const bookAll = results.getBookAll;
                let existBook = results.getExistBooks;
                let newBooks = []
                bookAll.map((obk) => {
                    const id = obk._id;
                    let count = 0;
                    existBook.map((obc) => {
                        if(obc._id.toString() == id.toString()){
                            count = obc.count;
                        }
                    })
                    newBooks.push({ _id:obk._id ,name :obk.name ,count })
                })
                const sortList = array(newBooks).sort('count',-1);
                callback(null,sortList)
            }],
        },(err ,results) => {
            err ? resolve({ success :false ,msg : err.message }) : resolve({ success :true ,data :{ list : results.handleBookCount } })
        })
    })
}

const findDramaCountSortCategory = () => {
    return new Promise((resolve ,reject) => {
        Async.auto({
            getCategoryAll :(callback) => {
                Category.find({},'name').lean().exec((err ,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            getExistCategorys :(callback) => {
                Drama.aggregate([
                    { "$unwind" : "$category_id" },
                    { $group : { _id : '$category_id',count: { $sum: 1 } } },
                    { $sort  : { count : -1 }}
                ])
                .exec((err,dosc) => {
                    err ? callback(err) : callback(null,dosc)
                })
            },
            handleCategoryCount :['getCategoryAll','getExistCategorys',(results ,callback) => {
                const categoryAll = results.getCategoryAll;
                let existCategory = results.getExistCategorys;
                let newCategorys = []
                categoryAll.map((obk) => {
                    const id = obk._id;
                    let count = 0;
                    existCategory.map((obc) => {
                        if(obc._id.toString() == id.toString()){
                            count = obc.count;
                        }
                    })
                    newCategorys.push({ _id:obk._id ,name :obk.name ,count })
                })
                const sortList = array(newCategorys).sort('count',-1);
                callback(null,sortList)
            }],
        },(err ,results) => {
            err ? resolve({ success :false ,msg : err.message }) : resolve({ success :true ,data :{ list : results.handleCategoryCount } })
        })
    })
}

/**
 * 根据数组筛选drama
 * @param {string[]} list 
 */
const findDramasByArray = (list ,options) => {
    return new Promise((resolve ,reject) => {
        options = options || { };
        Async.map(list,(item ,callback) => {
            Drama.findById(item)
            .populate(options.populate || '')
            .select(options.select || '')
            .exec((err,dosc) => {
                if(err){
                    callback(null,{})
                }else{
                    callback(null,dosc)
                }
            })
        },(err ,results) => {
            let result = { };
            if(err){
                results = results.filter(item => {
                    return item._id;
                })
                result = { 
                    success :false , 
                    msg : '未知错误',
                    data : { 
                        list :[] ,
                    }
                }
            }else{
                result = { 
                    success :true , 
                    data : { 
                        list :results ,
                    }
                }
            }
            resolve(result);
        })
    }) 
}







module.exports = {
    find 
    ,create 
    ,removeById 
    ,findById 
    ,updateById 
    ,addReadingCount 
    ,getMaxCategoryCount 
    ,hotCategoryData 
    ,lmtShow 
    ,fakeChartData
    ,findDramaCountSortBook
    ,findDramaCountSortCategory
    ,findDramasByArray
}