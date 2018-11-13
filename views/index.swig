<html>
<head>
<meta charset="utf-8">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> 
<title>北门中文网 - 一个编剧汇集的平台</title>
<meta name="keywords" content="关键词,5个左右,单个8汉字以内"> 
<meta name="description" content="网站描述，字数尽量空制在80个汉字，160个字符以内！"> 
<link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
<!--[if lt IE 9]> 
<script type="text/javascript" src="Lib/html5.js"></script>
<script type="text/javascript" src="Lib/respond.min.js"></script>
<![endif]--> 
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/reset.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<script src="/js/layui.js"></script>
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head> 
<body>
{% include "./includes/header/head.swig" %}
<div class="container ovh">
    <!-- 第一板块区域 -->
    <div class="ovh">
        <!-- 左侧 热门剧本 -->
        <div style="width:750px;height:488px;" class="f-left">
            <div class="bm-list-warp">
                <div class="warp-title"><p>热门剧本</p></div>
                <div class="warp-pList-2">
                    <div class="f-left" style="width:370px;">
                        <img src="/image/index-1.jpg" width="370" height="160" alt="" >
                        <div class="warp-tList" style="margin-top:30px;">
                            <!-- 16 -->
                            {% for key, drama in remen %}
                                <dl>
                                    <dt>{{ key + 1 }}</dt>
                                    <dd><a href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></dd>
                                </dl>
                            {% endfor %}
                        </div>
                    </div>
                    <div class="f-right" style="width:345px;">
                        <div class="warp-taList">
                            {% for key, drama in remen %}
                                {% if key < 3 %}
                                <dl>
                                    <dt><a style="color:#2e2e2e;" href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></dt>
                                    <dd class="actions">
                                        {% if drama.category_id.length > 0 %}
                                            {% for category in drama.category_id %}
                                                <span class="layui-badge layui-bg-gray">{{ category.name }}</span>
                                            {% endfor %}
                                        {% else %}
                                            <span class="layui-badge layui-bg-gray">其他</span>
                                        {% endif %}
                                    </dd>
                                    <dd class="content">{{ drama.description }}</dd>
                                </dl>
                                {% endif %}
                            {% endfor %}


                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧 最新剧本 -->
        <div style="width:204px;height:488px;" class="f-right">
            <div class="bm-list-warp">
                <div class="warp-title"><p>最新剧本</p></div>
                <div class="warp-tList">
                    <!-- 14 -->
                    {% for key, drama in zuixin %}
                        <dl>
                            <dt>{{ key + 1 }}</dt>
                            <dd><a href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></dd>
                        </dl>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
    <!-- 第二板块区域 -->
    <div class="author-warp" style="margin-top:40px;">
        <div class="title"><p class="horizontal-divider"><span>热门编剧</span></p></div>
        <div class="pList">
            <!-- 5 -->
            {% for author in authors %}
                <a href="/personal?id={{ author._id.toString() }}">
                    <dl>
                        <dd><img src="{{ author.avatar }}"></dd>
                        <dd>
                            <p>{{ author.name }}</p>
                            <p class="text-muted">关注 {{ author.count.follow }}</p>
                        </dd>
                    </dl>
                </a>
            {% endfor %}
        </div>
    </div>
    <!-- 第三板块区域 -->
    <div class="ovh"  style="margin-top:50px;">
            <!-- 左侧 热门剧本 -->
        <div style="width:476px;" class="f-left">
            <div class="bm-list-warp">
                <div class="warp-title"><p>最近更新</p></div>
                <div class="warp-pList-3">
                    <!-- 5 -->
                    {% for key ,chapter in newsChapter %}
                        {% if key == 0 %}
                            <div class="ovh" style="margin-bottom:20px;">
                                <div class="f-left"><img src="/image/index-2.jpg" alt=""></div>
                                <div class="f-right" style="width:276px;" >
                                    <p><a style="color: #2e2e2e; font-size: 16px; font-weight: 700; display: block;" href="/drama?id={{ chapter.drama_id._id.toString() }}">{{ chapter.drama_id.title }}</a></p>
                                    <p style="height: 88px; line-height: 22px; color: grey; overflow: hidden;margin: 8px 0 14px;">{{ chapter.drama_id.description }}</p>
                                    <p>更新至 ：<a href="/chapter?id={{ chapter.chapter_id.toString() }}&did={{ chapter.drama_id._id.toString() }}">{{ chapter.title }}</a></p>
                                </div>
                            </div>
                        {% else %}
                            <dl>
                                <dt>[{{ chapter.drama_id.book_id.name }}]&nbsp;<a href="/drama?id={{ chapter.drama_id._id.toString() }}">{{ chapter.drama_id.title }}</a></dt>
                                <dd><a href="/chapter?id={{ chapter.chapter_id.toString() }}&did={{ chapter.drama_id._id.toString() }}">{{ chapter.title }}</a></dd>
                            </dl>
                        {% endif %}
                    {% endfor %}
                </div>
            </div>
        </div>
        <!-- 右侧 最新剧本 -->
        <div style="width:226px;" class="f-right">
            <div class="bm-list-warp">
                <div class="warp-title"><p>月排行榜</p></div>
                <div class="warp-tList">
                    <!-- 10 -->
                    {% for key, drama in monthRanking %}
                        <dl>
                            <dt>{{ key + 1 }}</dt>
                            <dd><a href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></dd>
                        </dl>
                    {% endfor %}
                </div>
            </div>
        </div>
        <div style="width:226px;margin-right:36px;" class="f-right">
            <div class="bm-list-warp">
                <div class="warp-title"><p>周排行榜</p></div>
                <div class="warp-tList">
                    <!-- 10 -->
                    {% for key, drama in weekRanking %}
                        <dl>
                            <dt>{{ key + 1 }}</dt>
                            <dd><a href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></dd>
                        </dl>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
    <!-- 第四板块区域 banner -->
    <div style="margin:50px 0;"><img src="./image/index-3.jpg" alt=""></div>
    <!-- 第五板块区域 最热门的4个剧情分类 -->
    <div>
        {% for key, hotCategoryItem in hotCategoryList %}
            {% if key == 0 %}
                <div style="width:476px;margin-right:40px;" class="f-left">
                    <div class="bm-list-warp">
                        <div class="warp-title"><p>最新{{ hotCategoryItem.name }}</p></div>
                        <div class="ovh">
                            <div class="f-left" style="margin-right:56px;"><img src="./image/index-4.jpg" width="174" height="280" alt=""></div>
                            <div class="f-left">
                                <div class="warp-tList">
                                    {% for idx, item in hotCategoryItem.data %}
                                        <dl>
                                            <dt>{{ idx + 1 }}</dt>
                                            <dd><a href="/drama?id={{ item._id.toString() }}">{{ item.title }}</a></dd>
                                        </dl>
                                    {% endfor %}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {% else %}
                {% if key === hotCategoryList.length - 1 %}
                    <div style="width:220px;" class="f-left">
                {% else %}
                    <div style="width:220px;margin-right:40px;" class="f-left">
                {% endif %}
                        <div class="bm-list-warp">
                            <div class="warp-title"><p>最新{{ hotCategoryItem.name }}</p></div>
                            <div class="warp-tList">
                                {% for idx, item in hotCategoryItem.data %}
                                    <dl>
                                        <dt>{{ idx + 1 }}</dt>
                                        <dd><a href="/drama?id={{ item._id.toString() }}">{{ item.title }}</a></dd>
                                    </dl>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
            {% endif %}
        {% endfor %}
    </div>

</div>
{% include "./includes/footer/footer.swig" %}
<script>
    layui.use(['element'], function(){
        
    });
</script>
<!-- <script type="text/javascript" src="h-ui/js/h-ui.js"></script>  -->
</body>
</html>