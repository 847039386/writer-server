const router = require('koa-router')();
const auth = require('../middlewares/auth')
const Config = require('../config')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/lauth' ,async (ctx, next) => {
  let query = ctx.query;
  let code = query.code
  let state = query.state
  let options = decodeURIComponent(state);
  try {
    options = JSON.parse(options);
    let urlString = `${Config.host}/#/lauth?code=${query.code}`
    let redirectURI = encodeURIComponent(options.referer) || '#/';
    let platform = options.platform || '';
    let uid = options.uid || ''
    let type = options.type || '';
    if(redirectURI){
      urlString += `&redirectURI=${redirectURI}`
    }
    if(platform){
      urlString += `&platform=${platform}`
    }
    if(type){
      urlString += `&type=${type}`
    }
    if(uid){
      urlString += `&uid=${uid}`
    }
    ctx.redirect(urlString)
  } catch (error) {
    ctx.redirect(`${Config.host}/#/`)
  }
})


module.exports = router
