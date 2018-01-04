const router = require('koa-router')();
const { CF ,Topic ,Admin ,Book ,Category ,UserAuth ,Drama ,User ,Comment ,Chapter ,Relation  } = require('../controllers');
const { JwtAuth } = require('../middlewares').Auth
const Reading = require('../middlewares').Reading

router.prefix('/v1')

router.get('/cf/home', CF.Home);

router.get('/topic/fd', Topic.getResult);       
router.get('/topic/fdi', Topic.findById);
router.post('/topic/ct' ,JwtAuth('admin') ,Topic.create);
router.post('/topic/rm' ,JwtAuth('admin') ,Topic.removeById);

router.get('/adm/register', Admin.register);
router.post('/adm/sendpac', Admin.sendPac);
router.post('/adm/lg', Admin.login);


router.get('/drama/fd', Drama.find);
router.get('/drama/fdbui', Drama.findByUserID);
router.get('/drama/details' ,Reading.drama,Drama.details);
router.get('/drama/abstract' ,Drama.getAbstract);
router.get('/drama/character' ,Drama.getCharacter);
router.post('/drama/search', Drama.search);
router.post('/drama/abstract' ,JwtAuth('user') ,Drama.setAbstract);
router.post('/drama/character',JwtAuth('user') ,Drama.setCharacter);
router.post('/drama/ct',JwtAuth('user') , Drama.create);
router.post('/drama/rm',JwtAuth('user') , Drama.remove);

router.get('/chapter/fd' ,Chapter.findByDramaID);
router.get('/chapter/fdi' ,Chapter.findById);
router.post('/chapter/ct' ,JwtAuth('user') ,Chapter.create);
router.post('/chapter/rm' ,JwtAuth('user') ,Chapter.removeById);
router.post('/chapter/ut' ,JwtAuth('user') ,Chapter.updateById);
router.post('/chapter/utorder' ,JwtAuth('user') ,Chapter.updateOrder);

router.get('/book/fd', Book.getResult);
router.get('/book/search' ,Book.search);
router.post('/book/ct' ,JwtAuth('admin') ,Book.create);
router.post('/book/ut' ,JwtAuth('admin') ,Book.updateById);
router.post('/book/rm',JwtAuth('admin') ,Book.removeById);

router.get('/category/fd', Category.getResult);
router.get('/category/search' ,Category.search);
router.post('/category/ct' ,JwtAuth('admin') ,Category.create);
router.post('/category/ut' ,JwtAuth('admin') ,Category.updateById);
router.post('/category/rm' ,JwtAuth('admin') ,Category.removeById);

router.get('/comment/fd',Comment.findByDramaID);
router.post('/comment/ct' ,JwtAuth('user') ,Comment.create);
router.post('/comment/rm' ,JwtAuth('user') ,Comment.removeById);

router.post('/us/hct', UserAuth.hostRegister);       // 本站注册
router.post('/us/hlg', UserAuth.hostLogin);          // 本站登陆
router.get('/us/hrun', UserAuth.findRepeatUName);    // 是否重复的用户名
router.get('/us/fdbi',User.getInfo );
router.get('/us/qlg' ,UserAuth.qqLogin)
router.get('/us/presentation' ,User.getPresentation)
router.post('/us/presentation' ,JwtAuth('user') ,User.setPresentation)

router.get('/relation/fans' ,Relation.fans)        // 获取大佬的粉丝们
router.get('/relation/stars' ,Relation.stars)      // 获取粉丝的大佬们
router.get('/relation/isfollow' ,Relation.isfollow)  // 是否关注
router.post('/relation/follow' ,JwtAuth('user') ,Relation.follow)     // 关注或取消关注

module.exports = router
