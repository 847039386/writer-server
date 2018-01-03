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
  let redirectURI = encodeURIComponent(state)
  ctx.redirect(`${Config.host}/#/lauth?code=${query.code}&state=${redirectURI}`)
})


module.exports = router
