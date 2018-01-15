var schedule = require('node-schedule');
var Drama = require('../models').Drama;


// 每月1号凌晨0点  将drama表内所有数据的 月阅读量归零
var resetDramaMonthReading = schedule.scheduleJob('0 0 0 1 * ?', function(){
    Drama.update({},{ reading_month_count :0 },{multi :true},function(err,doc){
        console.log('drama :reading_month_count ' ,doc)
    })
});

// 每周一  将drama表内所有数据的 周阅读量归零
var resetDramaWeekReading = schedule.scheduleJob('0 0 0 * * 1', function(){
    Drama.update({},{ reading_week_count :0 },{multi :true},function(err,doc){
        console.log('drama :reading_week_count ' ,doc)
    })
});
