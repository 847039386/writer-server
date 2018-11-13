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
<link href="/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
<script src="/js/layui.js"></script>
<!-- ZUI 标准版压缩后的 JavaScript 文件 -->
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head> 

<body>
{% include "./includes/header/head.swig" %}
<div class="bm-container ovh">
    <div class="bm-container-l">
        <div class="bc-submenu">
            <!-- a-this -->
            <div>
                <dl>
                    <dt><a href="#">剧本类型</a></dt>
                    <dd>
                        {% if !current.book %}
                            <a class="a-this" href="/dramasBookType">全部</a>
                        {% else %}
                            <a href="/dramasBookType">全部</a>
                        {% endif %}
                        {% for book in books.list %}
                            {% if book._id.toString() == current.book %}
                                <a class="a-this" href="/dramasBookType?id={{ book._id.toString() }}">{{ book.name }}</a>
                            {% else %}
                                <a href="/dramasBookType?id={{ book._id.toString() }}">{{ book.name }}</a>
                            {% endif %}
                        {% endfor %}
                    </dd>
                </dl>
                <dl>
                    <dt><a href="#">剧情类型</a></dt>
                    <dd>
                        {% if !current.category %}
                            <a class="a-this" href="/dramasCategoryType">全部</a>
                        {% else %}
                            <a href="/dramasCategoryType">全部</a>
                        {% endif %}
                        {% for category in categorys.list %}
                            {% if category._id.toString() == current.category %}
                                <a class="a-this" href="/dramasCategoryType?id={{ category._id.toString() }}">{{ category.name }}</a>
                            {% else %}
                                <a href="/dramasCategoryType?id={{ category._id.toString() }}">{{ category.name }}</a>
                            {% endif %}
                        {% endfor %}
                    </dd>
                </dl>
            </div>   
        </div>
        {% if dramas.pagination.total > 0 %}
            <div class="drama-list">
                <ul>
                    {% for drama in dramas.list %}
                        <li>
                            <div class="header"><a href="/drama?id={{ drama._id.toString() }}">{{ drama.title }}</a></div>
                            <div class="content ">
                                <div class="c1">{{ drama.description }}</div>
                                <div class="c2 text-success"></div>
                            </div>
                            <div class="footer">
                                <div class="ff f1">
                                    <a target="_blank" href="/personal?id={{ drama.user_id._id.toString() }}"><img src="{{ drama.user_id.avatar }}" style="border-radius:50%; margin-right:5px;" width="25" height="25">&nbsp;{{ drama.user_id.name }}</a>
                                </div>
                                <div class="ff f2">
                                    <span class="layui-badge layui-bg-blue">{{ drama.book_id.name }}</span>
                                    {% if drama.category_id.length > 0 %}
                                        {% for category in drama.category_id %}
                                            <span class="layui-badge layui-bg-black">{{ category.name }}</span>
                                        {% endfor %}
                                    {% else %}
                                        <span class="layui-badge layui-bg-black">其他</span>
                                    {% endif %}
                                </div>
                                <div class="ff f3">
                                        {% if User._id.toString() %}
                                            {% if drama.ugood == 0 %}
                                                <span class="f-right active" data-sid="{{ drama.user_id._id.toString() }}" data-method="thumbsUp" data-did="{{ drama._id.toString() }}" data-date="{{ drama.create_at }}"><i class="fa fa-thumbs-o-up" style="font-size:16px;"></i>&nbsp;<span>{{ drama.count.like || 0 }}</span>&nbsp;&nbsp;&nbsp;</span>
                                            {% else %}
                                                <span class="f-right active"><i class="fa fa-thumbs-up" style="color:#EA6055;font-size:16px;"></i>&nbsp;<span>{{ drama.count.like || 0 }}</span>&nbsp;&nbsp;&nbsp;</span>
                                            {% endif %}
                                        {% else %}
                                            <span class="f-right active"><i class="fa fa-thumbs-o-up"></i>&nbsp;<span>{{ drama.count.like || 0 }}</span>&nbsp;&nbsp;&nbsp;</span>
                                        {% endif %}
                                        <span class="f-right"><i class="fa fa-star" style="font-size:16px;"></i> {{ drama.count.collect || 0 }}&nbsp;&nbsp;&nbsp;</span>
                                        <span class="f-right"><i class="fa fa-commenting" style="font-size:16px;"></i> {{ drama.count.comment || 0 }}&nbsp;&nbsp;&nbsp;</span>
                                        <span class="f-right"><i class="fa fa-eye" style="font-size:16px;"></i> {{ drama.uv.total || 0 }}&nbsp;&nbsp;&nbsp;</span>
                                </div>
                            </div>
                        </li>
                    {% endfor %} 
                </ul>
            </div>
            {% if current.total > current.pageSize %}
                <div id="page" style="text-align: center;"></div>
            {% endif %}
        {% else %}
            <div style="width:200px; height:200px;margin:30px auto;">
                <img src='/image/no-drama.png' width="200" height="200" >
            </div> 
        {% endif %}
    </div>
    <div class="bm-container-r">
        <div style="width:200px;">
            <div class="bm-list-warp">
                <div class="warp-title"><p>周排行榜</p></div>
                <div class="warp-tList">
                    {% for key, drama in weekRanking %}
                        <dl>
                            <dt>{{ key + 1 }}</dt>
                            <dd><a href="/drama?id={{ drama._id }}">{{ drama.title }}</a></dd>
                        </dl>
                    {% endfor %}
                </div>
            </div>
        </div>
        <div style="width:200px;margin-top:50px;">
            <div class="bm-list-warp">
                <div class="warp-title"><p>月排行榜</p></div>
                <div class="warp-tList">
                    {% for key, drama in monthRanking %}
                        <dl>
                            <dt>{{ key + 1 }}</dt>
                            <dd><a href="/drama?id={{ drama._id }}">{{ drama.title }}</a></dd>
                        </dl>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</div>
<label id='s_current' data-total="{{ current.total  }}" data-page="{{ current.page  }}" data-pagesize="{{ current.pageSize  }}" ></label>
<label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
{% include "./includes/footer/footer.swig" %}
<script>
    var bug = false;
    layui.use(['laypage','layer','element'], function(){ 
        var laypage = layui.laypage;
        var $ = layui.jquery;
        var s_current = $('#s_current');
        var current_total = s_current.data('total')
        var current_page = s_current.data('page')
        var current_pageSize = s_current.data('pagesize')
        laypage.render({
            elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: current_total //数据总数，从服务端得到
            ,limit :current_pageSize
            ,curr :current_page
            ,theme :'#00a1d6'
            ,jump :function(obj,first){
                if(!first){
                    window.location.href = '/dramas/' + obj.curr;
                }
            }
        });

        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var active = {
            thumbsUp: function(dom){
                if(!bug){
                    bug = true;
                    var did = $(dom).data('did');
                    var createAt = $(dom).data('date');
                    var sid = $(dom).data('sid');
                    $.ajax('/v1/like/drama/thumbsUp', {
                            type: 'POST',
                            data: { did ,createAt ,sid }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    $(dom).find('i').first().css({ color :'#EA6055'}).addClass('fa-thumbs-up').removeClass('fa-thumbs-o-up')
                                    $(dom).data('method','not')
                                    var goodcount = parseInt($(dom).find('span').first().text());
                                    $(dom).find('span').first().text(goodcount+1)
                                }
                            },
                            complete:function(){
                                bug = false;
                            }
                    });
                }
            }
        };

        $('.active').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });



    });


        


</script>
<!-- <script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="h-ui/js/h-ui.js"></script>  -->
</body>
</html>