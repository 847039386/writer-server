const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors');

const index = require('./routes/index')
const v1 = require('./routes/v1')
const koa_redis = require('./middlewares').Redis

require('./schedule');        // 定时任务在这里;
app.use(koa_redis());          // redis中间件
onerror(app);                  // error handler

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors());
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(v1.routes(), v1.allowedMethods())

module.exports = app
