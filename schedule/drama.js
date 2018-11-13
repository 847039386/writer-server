const schedule = require('node-schedule');
const Config = require('../config');
const Redis = require('ioredis');
const { Drama } = require('../models');
const { Admin } = require('../proxy')
const { Util ,Email } = require('../common')

var redis = new Redis({
    host : Config.redis.host || '127.0.0.1',
    port : Config.redis.port || 6379,
    keyPrefix : Config.redis.keyPrefix || 'DRAMA:'
});

// 每月1号凌晨0点  将drama表内所有数据的 月阅读量归零
var resetDramaMonthReading = schedule.scheduleJob('0 0 0 1 * *', function(){
    Drama.update({},{ "uv.month" :0 },{multi :true},function(err,doc){
        console.log('drama.uv.month')
    })
});

// 每周一  将drama表内所有数据的 周阅读量归零
var resetDramaWeekReading = schedule.scheduleJob('0 0 0 * * 1', function(){
    Drama.update({},{ "uv.week" :0 },{multi :true},function(err,doc){
        console.log('drama.uv.week')
    })
});

// 每天凌晨  将drama表内所有数据的 日阅读量归零
var resetDramaDayReading = schedule.scheduleJob('0 0 0 * * *', function(){
    Drama.update({},{ "uv.day" :0 },{multi :true},function(err,doc){
        console.log('drama.uv.day')
    })
});

// 每天凌晨 清空redis剧本UV浏览量(使得同一用户用一篇文章浏览数可+1)
schedule.scheduleJob('0 0 0 * * *', async function(){
    const keyPrefix = Config.redis.keyPrefix;
    const keys = await redis.keys(`${keyPrefix}UV-DRAMA-ID-*`);
    let json = JSON.stringify(keys || []);
    const reg = new RegExp(keyPrefix,'g')
    json = json.replace(reg,'');
    const nKeys = JSON.parse(json);
    if(nKeys.length > 0){
        redis.del(nKeys)
    }
});

// 每天凌晨备份数据库发送超级管理员邮箱
schedule.scheduleJob('0 0 0 * * *', function(){
    let admin_Email = '';
    Admin.isRootAdmin().then((desc) => {
        admin_Email = desc.email
        return Util.mongoDump()
    }).then((path) => {
        return Util.compressFolder(path.filePath,path.outPath);
    })
    .then((outPath) => {
        return Email.sendFile(admin_Email,outPath,{ 
            title :`${Config.db.database}数据库备份文件`,
            html :`${Config.db.database}数据库备份文件`,
            filename :`database-${Config.db.database}-dump.zip` 
        });
    }).then(() => {
        console.log('send dump success')
    })
    .catch((error) => {
        console.log(error)
    })
});





