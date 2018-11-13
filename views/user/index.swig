<html>
<head>
<meta charset="utf-8">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> 
<title>北门中文网 - 一个编剧汇集的平台</title>
<meta name="keywords" content="关键词,5个左右,单个8汉字以内"> 
<meta name="description" content="网站描述，字数尽量空制在80个汉字，160个字符以内！"> 
<link rel="Bookmark" href="favicon.ico" > 
<link rel="Shortcut Icon" href="favicon.ico" /> 
<!--[if lt IE 9]> 
<script type="text/javascript" src="Lib/html5.js"></script>
<script type="text/javascript" src="Lib/respond.min.js"></script>
<![endif]--> 
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style-user.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<script src="/js/layui.js" charset="utf-8"></script> 
<!-- ZUI 标准版压缩后的 JavaScript 文件 -->
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head> 

<body>
{% include "../includes/header/head.swig" %}
<div class="bm-container-adm ovh">
    <div class="bm-container-uel">
        {% include "../includes/user/menu.swig" %}  
    </div>
    <div class="bm-container-uer">
            <!-- 头部展示信息 -->
            <div class="index-top-statistics">
                <div class="index-article-publish-btn-wrap">
                    <a class="index-article-publish-btn task" data-urlkey="首页-发布btn" href="/builder/rc/edit?type=news">
                        <i class="layui-icon layui-icon-read" style="font-size: 42px; color: #fff;"></i><br><br>
                        <span style="font-size:16px;">新建剧本</span>
                        <div class="index-article-publish-tast-place"></div>
                    </a>
                </div>
                <div class="index-statistics-main">
                    <a class="index-statistics-item index-income" data-record-urlkey="昨日收入" href="/builder/rc/market/analysis">
                        <p class="bc-title">剧本</p><p class="index-top-statistics-number">3</p>
                        <div class="border-line"></div>
                    </a>
                    <a class="index-statistics-item index-subscribe" data-record-urlkey="粉丝总人数" href="/builder/rc/analysisfans/basedata">
                        <p class="bc-title">粉丝总人数</p><p class="index-top-statistics-number">2,285</p>
                        <div class="border-line"></div>
                    </a>
                    <a class="index-statistics-item index-reading" data-record-urlkey="累计阅读数" href="/builder/rc/analysiscontent">
                        <p class="bc-title">累计阅读数&nbsp;&nbsp;
                            <div class="client_components_doubtPop">
                                <i class="anticon anticon-question-circle-o doubt-icon"></i>
                            </div>
                        </p>
                        <p class="index-top-statistics-number"><span>147.58<span class="index-statistics-number-icon">万</span></span>
                        </p>
                    </a>
                </div>
            </div>

            <div class="i-drama-list">
                <div class="title">我的收藏</div>
                <ul>
                    <li>
                        <a href="#">
                            <span class="title">西游降魔录</span>
                            <span class="layui-badge layui-bg-black">冒险</span>
                            <span class="layui-badge">治愈</span>
                            <span class="layui-badge layui-bg-black">爱情</span>
                            <span class="layui-badge layui-bg-black">战争</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="title">西游降魔录</span>
                            <span class="layui-badge layui-bg-black">冒险</span>
                            <span class="layui-badge">治愈</span>
                            <span class="layui-badge layui-bg-black">爱情</span>
                            <span class="layui-badge layui-bg-black">战争</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span class="title">西游降魔录</span>
                            <span class="layui-badge layui-bg-black">冒险</span>
                            <span class="layui-badge">治愈</span>
                            <span class="layui-badge layui-bg-black">爱情</span>
                            <span class="layui-badge layui-bg-black">战争</span>
                        </a>
                    </li>
                </ul>
            </div>
    </div>
</div>
{% include "../includes/footer/footer.swig" %}
</body>
<script>
    layui.use(['element'], function(){
        
    });
</script>
</html>