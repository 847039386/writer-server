const router = require('koa-router')();
const { CF ,Topic ,Admin ,Book ,Category ,UserAuth ,Drama ,User ,Comment ,Chapter ,Relation ,DramaLike  } = require('../controllers');
const { JwtAuth ,isRoot } = require('../middlewares').Auth
const Reading = require('../middlewares').Reading

router.prefix('/v1')

router.get('/cf/home', CF.Home);                                    // 主页面需要的数据

/**
 *  站内文章 
 */
router.get('/topic/fd', Topic.getResult);                           // 查找所有文章
router.get('/topic/fdi', Topic.findById);                           // 查找某片文章
router.post('/topic/ct' ,JwtAuth('admin') ,Topic.create);           // 文章创建
router.post('/topic/rm' ,JwtAuth('admin') ,Topic.removeById);       // 文章删除

/**
 * 管理员 
 */
router.get('/adm/register', Admin.register);                        // 注册（废弃）
router.get('/adm/fd', Admin.find);                                  // 查找所有管理员
router.post('/adm/sendpac', Admin.sendPac);                         // 发送登陆验证码。
router.post('/adm/lg', Admin.login);                                // 登陆
router.post('/adm/cct' ,Admin.childAdminRegister)                    // 子用户注册
router.post('/adm/cdkey', isRoot(), Admin.generateCDKEY);           // 超级管理员生成注册激活码
router.post('/adm/rm',isRoot(),Admin.remove)                        // 删除管理员，这里只有超级管理员有权限

/**
 * 剧本 
 */
router.get('/drama/fd', Drama.find);                                    // 查找所有剧本
router.get('/drama/fdbui', Drama.findByUserID);                         // 查找用户下所有剧本呢
router.get('/drama/details' ,Reading.drama,Drama.details);              // 查找某篇文章
router.get('/drama/abstract' ,Drama.getAbstract);                       // 该剧本的大纲
router.get('/drama/character' ,Drama.getCharacter);                     // 该剧本的人物小传
router.post('/drama/search', Drama.search);                             // 模糊查询剧本
router.post('/drama/abstract' ,JwtAuth('user') ,Drama.setAbstract);     // 设置剧本大纲
router.post('/drama/character',JwtAuth('user') ,Drama.setCharacter);    // 设置剧本人物小传
router.post('/drama/ct',JwtAuth('user') , Drama.create);                // 剧本创建
router.post('/drama/rm',JwtAuth('user') , Drama.remove);                // 剧本删除

/**
 * 剧本分集（章）
 */
router.get('/chapter/fd' ,Chapter.findByDramaID);                       // 该剧本的所有分集查询
router.get('/chapter/fdi' ,Chapter.findById);                           // 剧本的某一分集
router.post('/chapter/ct' ,JwtAuth('user') ,Chapter.create);            // 剧本的集创建
router.post('/chapter/rm' ,JwtAuth('user') ,Chapter.removeById);        // 剧本集删除
router.post('/chapter/ut' ,JwtAuth('user') ,Chapter.updateById);        // 剧本集修改
router.post('/chapter/utorder' ,JwtAuth('user') ,Chapter.updateOrder);  // 剧本集排序

/**
 * 剧本分类
 */
router.get('/book/fd', Book.getResult);                                 // 剧本分类查询
router.get('/book/search' ,Book.search);                                // 剧本分类模糊查询
router.post('/book/ct' ,JwtAuth('admin') ,Book.create);                 // 新增剧本分类
router.post('/book/ut' ,JwtAuth('admin') ,Book.updateById);             // 修改剧本分类
router.post('/book/rm',JwtAuth('admin') ,Book.removeById);              // 删除剧本分类

/**
 * 剧情分类
 */
router.get('/category/fd', Category.getResult);                         // 剧情分类查询
router.get('/category/search' ,Category.search);                        // 剧情分类模糊查询
router.post('/category/ct' ,JwtAuth('admin') ,Category.create);         // 新增剧情分类
router.post('/category/ut' ,JwtAuth('admin') ,Category.updateById);     // 修改剧情分类
router.post('/category/rm' ,JwtAuth('admin') ,Category.removeById);     // 删除剧情分类

/**
 * 评论
 */
router.get('/comment/fd',Comment.findByDramaID);                        // 指定剧本下的所有评论
router.post('/comment/ct' ,JwtAuth('user') ,Comment.create);            // 在指定剧本下创建一条评论
router.post('/comment/rm' ,JwtAuth('user') ,Comment.removeById);        // 删除某条评论

/**
 * 用户
 */
router.post('/us/hct', UserAuth.hostRegister);                                              // 本站注册
router.post('/us/hlg', UserAuth.hostLogin);                                                 // 本站登陆
router.post('/us/hrun', UserAuth.findRepeatUIdentifier);                                    // 是否重复的登陆账号。这里包括 email username qq的openid等
router.get('/us/fdbi',User.getInfo );                                                       // 获取用户基本信息
router.get('/us/presentation' ,User.getPresentation)                                        // 获取用户简介
router.post('/us/presentation' ,JwtAuth('user') ,User.setPresentation)                      // 设置用户简介
router.post('/us/qlg' ,UserAuth.qqLogin)                                                    // qq登陆
router.post('/us/bs' ,JwtAuth('user') ,UserAuth.userBindStatus)                             // 用户绑定的所有信息 
router.post('/us/sendpac' ,UserAuth.findEmailSendPAC)                                       // 用户绑定邮箱时发送验证码
router.post('/us/bndemail' ,JwtAuth('user') ,UserAuth.bindUserEmail)                        // 修改邮箱或者绑定邮箱
router.post('/us/bndunop' ,JwtAuth('user') ,UserAuth.bindHostUserNameOrUpdatePassword)      // 修改密码或者绑定本站用户名
router.post('/us/utpwbmail' ,JwtAuth('user') ,UserAuth.updatePassByEmail)                   // 根据email发出的验证码修改密码
router.post('/us/bndqq' ,JwtAuth('user') ,UserAuth.bindUserQQ)                              // 绑定QQ邮箱
router.post('/us/utan' ,JwtAuth('user') ,User.utAvatarAndName)                              // 设置用户昵称与头像

/**
 * 用户与编剧关系
 */
router.get('/relation/fans' ,Relation.fans)                                                 // 获取大佬的粉丝们
router.get('/relation/stars' ,Relation.stars)                                               // 获取粉丝的大佬们
router.get('/relation/isfollow' ,Relation.isfollow)                                         // 是否关注
router.post('/relation/follow' ,JwtAuth('user') ,Relation.follow)                           // 关注或取消关注

/**
 * 赞行为 
 */
router.get('/dlike/is' ,DramaLike.isLike)                                                   // 是否点赞
router.post('/dlike/ct' ,DramaLike.addLike)                                                 // 点赞


module.exports = router
