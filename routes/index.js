const router = require('koa-router')();
const auth = require('../middlewares').Auth
const midd_Info = require('../middlewares').Info;
const { JwtAuth,isLogin } = require('../middlewares').Auth
const Config = require('../config');
const Reading = require('../middlewares').Reading

const { Home ,Chapter ,Drama ,UserAuth ,User ,UserNotify ,Collect ,ThirdPartyAuth } = require('../controllers')
const UserAuthPROXY = require('../proxy').UserAuth

router.get('/' ,midd_Info.home , Home.index);                               // 首页
router.get('/dramas/:page', midd_Info.home , Drama.list);               // 剧本列表
router.get('/dramasBookType', Drama.selectedBookType);                         // 剧本列表
router.get('/dramasCategoryType', Drama.selectedCategoryType);                 // 剧本列表
router.get('/drama' ,Reading.drama ,Drama.article);
router.get('/amalist/search', midd_Info.home ,Drama.search);                                  // 剧本搜索
router.get('/chapter', Chapter.chapterAndDirectory);                                   // 剧本剧集
router.get('/personal', User.personal);  


router.get('/login', Home.login);               // 登陆
router.get('/register', Home.register);               // 登陆
router.get('/loginout', UserAuth.loginout);     // 注销

router.get('/user', isLogin , Home.userHome);                               // 用户后台 首页
router.get('/user/dramas', isLogin , Drama.userDramaList);                  // 用户后台 剧本列表页面
router.get('/user/chapters', Chapter.list);                                 // 用户后台 剧集页面
router.get('/user/info',isLogin, User.getInfo);                             // 用户后台 个人信息页面
router.get('/user/safety',isLogin, UserAuth.safety);                        // 用户安全页面
router.get('/user/other',isLogin, Drama.otherGongneng); 
router.get('/user/drama/setting',isLogin, Drama.userDramaSetting);          
router.get('/user/drama/create',isLogin, Drama.createDramaHtml);      
router.get('/user/collects',isLogin, Collect.userLike);  

 


router.get('/user/hbemail',isLogin, UserAuth.bindEmailHtml);                // 用户后台 绑定邮箱
router.get('/user/bnduname',isLogin, UserAuth.bindUserName);                // 用户后台 绑定站内用户名
router.get('/user/upumail',isLogin, UserAuth.upUserEmail);                  // 用户后台 修改邮箱
router.get('/user/uppass',isLogin, UserAuth.upPass);                        // 用户后台 修改站内用户名密码
router.get('/user/notify',isLogin, UserNotify.notify);                      // 用户后台 提醒


router.get('/api/OAuth/weixin' ,ThirdPartyAuth.weixin);                     // weixin第三方登陆
router.get('/api/OAuth/qq' ,ThirdPartyAuth.qq);                             // QQ第三方登陆




router.get('/exception' ,async (ctx, next) => {
    await ctx.render('default/exception', { 
        img:'',
        title :'呃！服务器君打瞌睡了',
        desc :'错误代码：500（服务器内部错误）联系客服解决。'
    })
})



// 后台页面
router.get(Config.admin.path,async (ctx, next) => {
    await ctx.render('admin/index.html', { })
})


module.exports = router
