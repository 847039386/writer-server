const router = require('koa-router')();
const { CF ,Topic ,Admin ,Book ,Category ,UserAuth ,Drama ,User ,Comment ,Chapter } = require('../controllers');


router.prefix('/v1')

router.get('/cf/home', CF.Home);

router.get('/topic/fd', Topic.getResult);
router.get('/topic/fdi', Topic.findById);
router.post('/topic/ct', Topic.create);
router.post('/topic/rm', Topic.removeById);

router.post('/adm/register', Admin.register);
router.post('/adm/sendpac', Admin.sendPac);
router.post('/adm/lg', Admin.login);


router.get('/drama/fd', Drama.find);
router.get('/drama/fdbui', Drama.findByUserID);
router.get('/drama/details' ,Drama.details);
router.get('/drama/abstract' ,Drama.getAbstract);
router.get('/drama/character' ,Drama.getCharacter);
router.post('/drama/search', Drama.search);
router.post('/drama/abstract' ,Drama.setAbstract);
router.post('/drama/character' ,Drama.setCharacter);
router.post('/drama/ct', Drama.create);
router.post('/drama/rm' ,Drama.remove);

router.get('/chapter/fd' ,Chapter.findByDramaID);
router.get('/chapter/fdi' ,Chapter.findById);
router.post('/chapter/ct' ,Chapter.create);
router.post('/chapter/rm' ,Chapter.removeById);
router.post('/chapter/ut',Chapter.updateById);
router.post('/chapter/utorder' ,Chapter.updateOrder);

router.get('/book/fd', Book.getResult);
router.get('/book/search' ,Book.search);
router.post('/book/ct', Book.create);
router.post('/book/ut',Book.updateById);
router.post('/book/rm', Book.removeById);

router.get('/category/fd', Category.getResult);
router.get('/category/search' ,Category.search);
router.post('/category/ct', Category.create);
router.post('/category/ut',Category.updateById);
router.post('/category/rm', Category.removeById);

router.get('/comment/fd',Comment.findByDramaID);
router.post('/comment/ct', Comment.create);
router.post('/comment/rm', Comment.removeById);

router.post('/us/hct', UserAuth.hostRegister);       //本站注册
router.post('/us/hlg', UserAuth.hostLogin);          //本站登陆
router.get('/us/hrun', UserAuth.findRepeatUName);    // 是否重复的用户名
router.get('/us/fdbi',User.getInfo );
router.get('/us/qlg' ,UserAuth.qqLogin)
router.get('/us/presentation' ,User.getPresentation)
router.post('/us/presentation' ,User.setPresentation)



module.exports = router
