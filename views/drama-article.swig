<html>
<head>
<meta charset="utf-8">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> 
<title>《{{ drama.title }}》_北门中文网</title>
<meta name="keywords" content="{{ drama.title }},{{ drama.user_id.name }}"> 
<link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
<!--[if lt IE 9]> 
<script type="text/javascript" src="Lib/html5.js"></script>
<script type="text/javascript" src="Lib/respond.min.js"></script>
<![endif]--> 
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<link href="/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
<script src="/js/layui.js"></script>
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head>
<style>
    .layui-layer-min{ display: none !important; }
    .my-tab-content { padding :20px; min-height:300px; width:900px;margin:auto;background:#fff;margin-top:10px;}
    .my-tab-title {width:900px;margin:auto;background:#fff;margin-top:10px;}
    .my-tab-title li {   margin:0 6px; }
    .my-catalog ul{ display: block;overflow: hidden; }
    .my-catalog ul li{width: 270px;height: 40px;padding-right: 16px;border-bottom: 1px solid #ebebeb;float:left;line-height:40px;}
    .my-catalog ul li a{ white-space: nowrap; text-overflow: ellipsis; color:#000; }
    .my-catalog ul li a:hover{ color: #ed4259; }

    .layui-tab .layui-tab-title li { font-size: 16px;  color: #1a1a1a;}
    .layui-tab .layui-this{ color:#1a1a1a !important;  font-weight:600; }
    .layui-tab-brief>.layui-tab-more li.layui-this:after, .layui-tab-brief>.layui-tab-title .layui-this:after{ border-bottom:3px solid #0084ff;}
</style> 
<body>
{% include "./includes/header/head.swig" %}
<label id="dramaID" data-id="{{ drama._id.toString() }}" data-uid="{{ User._id.toString() }}" data-authoid="{{ drama.user_id._id.toString() }}" data-createat="{{ drama.create_at.toString() }}" ></label>
<label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}" data-avatar="{{ User.avatar }}" data-name="{{ User.name }}" ></label>
<div style="padding:30px 0;">
    <div class="card2" style="padding:50px;width:900px;margin:auto;background:#fff;">
        <ul>
            <li style="margin-bottom:30px;">
                <p style="position: relative;">
                    <span style="font-size:24px;color:#2e2e2e;font-weight:600;vertical-align:middle;margin-right:50px;">{{ drama.title }}</span>
                    <a target="_blank" href="/personal?id={{ drama.user_id._id.toString() }}"><img style="width:25px;height:25px;border-radius: 50%;" src="{{ drama.user_id.avatar }}"/>&nbsp;<span style="font-size:14px;color:#7f7f7f;font-weight:normal;display: inline-block;position:absolute;bottom:2px;">{{ drama.user_id.name }}</span></a>
                    
                </p>
            </li>

            <li style="margin-bottom:30px;">
                <div>
                    <span class="layui-badge">{{ drama.book_id.name }}&nbsp;</span>
                    {% if drama.state %}
                        <span class="layui-badge layui-bg-green">完结&nbsp;</span>
                    {% else %}
                        <span class="layui-badge layui-bg-green">连载&nbsp;</span>
                    {% endif %}
                    {% for item in drama.category_id %}
                        <span class="layui-badge layui-bg-black">{{ item.name }}&nbsp;</span>
                    {% endfor %}
                    <span class="layui-badge layui-bg-blue">{{ drama.create_at | date('Y-m-d') }}</span>
                    <span class="layui-badge-rim" style="height:20px;line-height:20px;"><i class="fa fa-eye" style="font-size:16px;"></i>&nbsp;{{ drama.uv.total }}</span>
                </div>
            </li>

            <li style="margin-bottom:30px;min-height:63px;color: #8590a6;font-size:16px;text-indent:50px;">
                {% if drama.description %}
                    <p>{{ drama.description }}</p>
                {% else %}
                    <p>暂无描述</p>
                {% endif %}
                
            </li>

            {% if newsChapter.title %}
                <li style="margin-bottom:30px;">
                    <p style="font-size: 14px; color: #99a2aa; font-weight: 400;">最新更新
                        <span data-title='{{ newsChapter.title }}' data-id='{{ newsChapter._id.toString() }}' class="getChapter">
                            <a style="color:#f22bf3" href="/chapter?id={{ newsChapter._id.toString() }}&did={{ drama._id.toString() }}">{{ newsChapter.title }}</a>
                        </span>
                        {{ newsChapter.create_at | date('Y-m-d') }}
                    </p>
                </li>
            {% endif %}

            <li>
                <p>
                    {% if oneChapter._id.toString() %}
                        <a href="/chapter?id={{ oneChapter._id.toString() }}&did={{ drama._id.toString() }}" class="layui-btn layui-btn-normal">开始阅读</a>
                    {% else %}
                        <a class="layui-btn layui-btn-disabled">暂无剧集</a>
                    {% endif %}
                    {% if User._id.toString() != drama.user_id._id.toString() %}
                        <button id="collect" class="layui-btn layui-btn-normal">加入收藏</button>
                    {% endif %}

                    {% if User._id.toString() %}
                        {% if drama.ugood == 0 || !drama.ugood %}
                            <button class="layui-btn layui-btn-primary active" data-sid="{{ drama.user_id._id.toString() }}" data-method="thumbsUp" data-did="{{ drama._id.toString() }}" data-date="{{ drama.create_at.toString() }}"><i class="fa fa-thumbs-o-up fa-lg"></i>&nbsp;赞&nbsp;<span>{{ drama.count.like || 0 }}</span></button>
                        {% else %}
                            <button class="layui-btn" style="background:#EA6055;"><i class="fa fa-thumbs-o-up fa-lg"></i>&nbsp;赞&nbsp;<span>{{ drama.count.like || 0 }}</span></button>
                        {% endif %}
                    {% else %}
                        <button class="layui-btn layui-btn-primary"><i class="fa fa-thumbs-o-up fa-lg"></i>&nbsp;赞&nbsp;<span>{{ drama.count.like || 0 }}</span></button>
                    {% endif %}

                    
                </p>
            </li>
        </ul>
    </div>

    
    <div class="layui-tab layui-tab-brief" lay-filter="dramaArticleTabs">
        <ul class="layui-tab-title my-tab-title card2" id="my-tab-title" style="height:42px;">
            <li lay-id="abstract" class="layui-this">剧本梗概</li>
            <li lay-id="character" >人物小传</li>
            <li lay-id="directory" >目录</li>
            <li lay-id="comment">评论</li>
        </ul>
        <div class="layui-tab-content my-tab-content card2">
            <div class="layui-tab-item layui-show" style="font-size:16px;line-height:30px;">
                {% if drama.abstract %}
                    {% autoescape %}{{ drama.abstract }}{% endautoescape %}
                {% else %}
                    <div style="color: #99a2aa; text-align: center;">暂无剧本梗概<br/></div>
                {% endif %}
            </div>
            <div class="layui-tab-item" style="font-size:16px;line-height:30px;">
                {% if drama.character %}
                    {% autoescape %}{{ drama.character }}{% endautoescape %}
                {% else %}
                    <div style="color: #99a2aa; text-align: center;margin:auto;">暂无人物小传<br/></div>
                {% endif %}
            </div>
            <div class="layui-tab-item">
                {% if chapter.length > 0 %}
                    <div class="my-catalog">
                        <ul>
                            {% for idx , item in chapter %}
                                <li>
                                    <a href="/chapter?id={{ item._id.toString() }}&did={{ drama._id.toString() }}">{{ item.title }}</a>
                                </li>
                            {% endfor %}
                        </ul>
                    </div>
                {% else %}
                    <div style="color: #99a2aa; text-align: center;margin:auto;font-size:16px;">暂无剧集<br/></div>
                {% endif %}
            </div>
            <div class="layui-tab-item">
                <div class="bb-comment" id="bb-comment">
                    <div style="margin-bottom:20px;">
                        {% if User._id.toString() %}
                            <input type="text" name="" id="commentdra_ipt" placeholder="写下您的评论..."  class="layui-input" style="width:600px;display:inline-block;">
                            <button id="commentdra_btn" class="layui-btn layui-btn-normal sendComment" width="100" >评论</button>
                        {% else %}
                            <input type="text"  placeholder="写下您的评论..." disabled  class="layui-input" style="width:600px;display:inline-block;">
                            <a style="color:#fff;" class="layui-btn layui-btn-normal sendComment" href='/login' width="100" >登陆</a>
                        {% endif %}
                    </div>
                    <div class="comment-list" id="comment-list">
                        
                    </div>
                    <div id="comment-page" class="comment-page"></div>
                </div>
            </div>
        </div>
    </div>
    
</div>


{% include "./includes/footer/footer.swig" %}
<script src="/js/man/drama_article.js"></script> 
</body>
</html>