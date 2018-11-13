const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa-cors');

const index = require('./routes/index');
const v1 = require('./routes/v1');
const koa_redis = require('./middlewares').Redis;
const session = require('koa-session-minimal');
const uuid = require('uuid');

require('./schedule');        // 定时任务在这里;
app.use(koa_redis());          // redis中间件
onerror(app);                  // error handler

// session 中间件
app.use(session({
  key: 'ubmzww',          // cookie 中存储 session-id 时的键名, 默认为 koa:sess
  cookie: {                   // 与 cookie 相关的配置
      // domain: 'localhost',    // 写 cookie 所在的域名
      path: '/',              // 写 cookie 所在的路径
      maxAge: 1000 * 60 * 60 ,      // cookie 有效时长
      httpOnly: true,         // 是否只用于 http 请求中获取
      overwrite: false        // 是否允许重写
  }
}))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors());
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'swig',
}))

app.use(async (ctx, next) => {
  // 分配一个唯一值
  if(!ctx.cookies.get('onlyid')){
    ctx.cookies.set('onlyid', uuid.v1())
  }
  await next();
})

// 获取session 用户信息
app.use(async (ctx, next) => {
  const User = ctx.session.user;
  if(User){
    ctx.UID = User._id.toString();
  }
  ctx.state = Object.assign(ctx.state, { User });
  await next();
})


// routes
app.use(index.routes(), index.allowedMethods())
app.use(v1.routes(), v1.allowedMethods())

module.exports = app
