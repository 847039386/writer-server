<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>《{{ drama.title }}》_{{ chapter.title }}_北门中文网</title>
    <meta name="keywords" content="北门中文网,{{ drama.title }},{{ chapter.title }},{{ drama.user_id.name }}"> 
    <meta name="description" content="{{ drama.description }}"> 
    <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
    <link href="/css/layui.css" rel="stylesheet" type="text/css" />
    <link href="/css/bm-main.css" rel="stylesheet" type="text/css" />
    <link href="/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <script src="/js/jquery-1.11.0.min.js" type="text/javascript"></script>
    <script src="/js/jquery.SuperSlide.2.1.1.js" type="text/javascript"></script>
    <script src="/js/layui.js" charset="utf-8"></script>

</head>
<style>
#chapter_directory ul{overflow: hidden;display: block;padding: 10px;}
#chapter_directory ul li{width: 250px;height: 40px;font-size:14px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;padding-right: 16px;border-bottom: 1px solid #ebebeb;float:left;line-height:40px;text-align: left;color:#474746;}
#chapter_directory ul li.current{color:#EF4259; font-weight:600;}
#chapter_directory ul li.other:hover{color: #1E9FFF;font-weight:600;}
.ftop{top :0}
.chapter_box{padding:50px 70px;width:900px;margin:auto;background:#fff;min-height:900px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
.chapter_box .title{font-size:26px;font-weight:600;color:#2d2d2d;text-align: center;margin-bottom:50px;}
.chapter_box .content{font-size:18px;color:#404040;font-size: 16px;padding-top: 15px;}
#container{padding:30px 0;}
#nav{width:80px;z-index:1;box-shadow:1px 1px 1px #efeae7;position: fixed;background:#FFF;}
#nav .mod_cate ,#nav .mod_cate2{text-align: center;padding:14px;cursor: pointer;}
#nav .mod_cate2 h2 ,#nav .mod_cate h2{font-size:14px;font-weight:normal;color:#000;}
#nav .mod_cate h2 i ,#nav .mod_cate2 h2 i{margin-bottom :5px; color:#000;}


#nav .mod_subcate{display:none;background:#f6f6f6;box-shadow:1px 1px 5px rgba(0, 0, 0, 0.2);position:absolute;top:0px;z-index:-1;left:78px;overflow:hidden;}
#nav .mod_subcate_main{-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}

#nav .arrow_dot{width:0px;height:0px;overflow:hidden;font-size:0px;margin:12px 0 0 5px;border:4px transparent dashed;border-left:4px #FFFFFF solid;}
#nav .on{background:#fff;width: 63px;    box-shadow:-2px 1px 5px rgba(0, 0, 0, 0.2);}
#nav .on .mod_subcate{left:90px;}
#nav .on h2{color:#333333;}
#nav .mod_cate2:hover{box-shadow:-2px 1px 5px rgba(0, 0, 0, 0.2);}
#nav .on .mod_subcate{display:block !important;/* !important 强制显示，否则会闪烁*/}
.NumberBoard{display:flex; width:900px; background:#fff; margin :20px auto;}
.NumberBoard-item.Button{border:0;line-height:unset;font-size:unset;cursor:pointer;}
.NumberBoard--divider.NumberBoard-item+.NumberBoard-item.NumberBoard-itemInner{border-left:1px solid#ebebeb}
.NumberBoard-item{-webkit-box-flex:1;-ms-flex:1;flex:1}
.NumberBoard-itemInner{text-align:center;line-height:1.6}
.NumberBoard-itemName{color:#000 ;display:inline-block;font-size:18px;font-weight:600;font-synthesis:style}
.NumberBoard-itemValue{display:inline-block;font-size:18px;color:#1a1a1a;font-weight:600;font-synthesis:style}
.NumberBoard-itemInner{padding:12px 0}
</style>
<body >
    {% include "./includes/header/head.swig" %}
    <div id="container">
        <div style="width:1080px;margin:auto;">
            <div id="nav">
                <ul class="tit">
                    <li class="mod_cate" id="mulu">
                        <h2>
                            <i class="fa fa-book fa-2x"></i>
                            <p>剧本</p>
                        </h2>
                        <div class="mod_subcate">
                            <div class="mod_subcate_main" id="scroll-1" style="text-align: left;">
                                <div class="card2" style="width:900px;background:#fff;padding:30px;margin-bottom:0;">
                                    <ul>
                                        <li style="margin-bottom:30px;">
                                            <p style="position: relative;">
                                                <a target="_blank" href="/drama?id={{ drama._id.toString() }}" style="font-size:24px;color:#2e2e2e;font-weight:600;vertical-align:middle;margin-right:50px;">{{ drama.title }}</a>
                                                <a target="_blank" href="/personal/{{ drama.user_id._id.toString() }}"><img style="width:25px;height:25px;border-radius: 50%;" src="{{ drama.user_id.avatar }}"/>&nbsp;<span style="font-size:14px;color:#7f7f7f;font-weight:normal;display: inline-block;position:absolute;bottom:2px;">{{ drama.user_id.name }}</span></a>
                                                
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
                                            </div>
                                        </li>

                                        <li style="margin-bottom:30px;color: #8590a6;font-size:16px;text-indent:50px;">
                                            {% if drama.description %}
                                                <p>{{ drama.description }}</p>
                                            {% else %}
                                                <p>暂无描述</p>
                                            {% endif %}
                                            
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="mod_cate" id="mulu">
                        <h2>
                            <i class="fa fa-building-o fa-2x"></i>
                            <p>目录</p>
                        </h2>
                        <div class="mod_subcate">
                            <div class="mod_subcate_main" id="scroll-1" style="">
                                <div class="card2" id="chapter_directory" style="min-height:300px; width:900px;background:#fff;padding:16px 20px;margin:0;" data-id="{{ chapter._id.toString() }}">
                                    <ul>
                                        {% for idx, item in chapters %}
                                            {% if item._id.toString() === chapter._id.toString() %}
                                                <li class="current" data-idx="{{ idx }}" data-state="current" data-id="{{ item._id.toString() }}">
                                                   {{ item.title }}
                                                </li>
                                            {% else %}
                                                <li class="other" data-idx="{{ idx }}" data-state="other" data-id="{{ item._id.toString() }}">
                                                    {{ item.title }}
                                                </li>
                                            {% endif %}
                                        {% endfor %}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="mod_cate2 prev">
                        <h2>
                            <i class="fa fa-arrow-left fa-2x"></i>
                            <p>上一集</p>
                        </h2>
                    </li>
                    <li class="mod_cate2 next">
                        <h2>
                            <i class="fa fa-arrow-right fa-2x"></i>
                            <p>下一集</p>
                        </h2>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="chapter_box" id="chapter_box">
            <p class="title">{{ chapter.title }}</p>
            <div class="content">{% autoescape false %}{{ chapter.content }}{% endautoescape %}</div>
        </div>
        <div class="NumberBoard FollowshipCard-counts NumberBoard--divider">
            <a type="button" class="Button NumberBoard-item Button--plain prev">
                <div class="NumberBoard-itemInner">
                    <div class="NumberBoard-itemName">上一集</div>
                </div>
            </a>
            <a target="_blank" href="/drama?id={{ drama._id.toString() }}#dramaArticleTabs=directory" class="Button NumberBoard-item Button--plain">
                <div class="NumberBoard-itemInner">
                    <div class="NumberBoard-itemName">目录</div>
                </div>
            </a>
            <a type="button" class="Button NumberBoard-item Button--plain next">
                <div class="NumberBoard-itemInner">
                    <div class="NumberBoard-itemName">下一集</div>
                </div>
            </a>
        </div>
    </div>
    {% include "./includes/footer/footer.swig" %}
</body>
<!-- 目录 -->



<script>
    layui.use(['element','layer'], function(){
        var $ = layui.jquery, layer = layui.layer; 
        var fix = $('#nav');                      //滚动悬浮块
        var fixTop = fix.offset().top,              //滚动悬浮块与顶部的距离
            fixHeight = fix.height();               //滚动悬浮块高度
        var endTop, miss;                           //结束元素与顶部的距离
        $(window).scroll(function() {
            //页面与顶部高度
            var docTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (fixTop < docTop) {
                fix.addClass('ftop')
            } else {
                fix.removeClass('ftop')
            }
        })

        let active_idx;

        
        var  current_id = $('#chapter_directory').data('id');

        $('#directory').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });

        $('#chapter_directory li').on('click', function(){
            var _this = this;
            var id = $(this).data('id');
            var state = $(this).data('state');
            if(state==='other'){
                $('#mulu').removeClass('on')
                $('.chapter_box .title').html('')
                $('.chapter_box .content').html('加载中...')
                $.get('/v1/chapter/fdi', { id },function(result){
                    if(result.success){
                        $('#chapter_directory li.current').data("state","other");
                        $('#chapter_directory li.current').addClass('other');
                        $('#chapter_directory li.current').removeClass('current');
                        $(_this).removeClass('other');
                        $(_this).addClass('current');
                        $(_this).data("state","current");
                        $('.chapter_box .title').html(result.data.title)
                        $('.chapter_box .content').html(result.data.htmlContent)
                        current_id = id;
                        document.documentElement.scrollTop = document.body.scrollTop = 0; 
                    }else{
                        layer.msg('加载失败')
                    }
                });
                layer.close(active_idx); 
            }else{
                layer.close(active_idx);
            }
        });

        $('.prev').on('click', function(){
           var idx = $('#chapter_directory li.current').data('idx')
            if(idx - 1 >= 0){
                var current_li = $('#chapter_directory li')[idx-1];
                var id = $(current_li).data('id');
                $('.chapter_box .title').html('')
                $('.chapter_box .content').html('加载中...')
                $.get('/v1/chapter/fdi', { id },function(result){
                    if(result.success){
                        $('#chapter_directory li.current').data("state","other");
                        $('#chapter_directory li.current').addClass('other');
                        $('#chapter_directory li.current').removeClass('current');
                        $(current_li).removeClass('other');
                        $(current_li).addClass('current');
                        $(current_li).data("state","current");
                        $('#chapter_directory li.current').data("state","current");
                        $('.chapter_box .title').html(result.data.title)
                        $('.chapter_box .content').html(result.data.htmlContent)
                        current_id = id;
                        document.documentElement.scrollTop = document.body.scrollTop = 0; 
                    }else{
                        layer.msg('加载失败')
                    }
                });
            }else{
                layer.msg('前边没有啦！')
            }
        });
        $('.next').on('click', function(){
            var idx = $('#chapter_directory li.current').data('idx')
            var leg =  $('#chapter_directory li').length;
            if(idx + 1 < leg){
                var current_li = $('#chapter_directory li')[idx+1];
                var id = $(current_li).data('id');
                $('.chapter_box .title').html('')
                $('.chapter_box .content').html('加载中...')
                $.get('/v1/chapter/fdi', { id },function(result){
                    if(result.success){
                        $('#chapter_directory li.current').data("state","other");
                        $('#chapter_directory li.current').addClass('other');
                        $('#chapter_directory li.current').removeClass('current');
                        $(current_li).removeClass('other');
                        $(current_li).addClass('current');
                        $(current_li).data("state","current");
                        $('#chapter_directory li.current').data("state","current");
                        $('.chapter_box .title').html(result.data.title)
                        $('.chapter_box .content').html(result.data.htmlContent)
                        current_id = id;
                        document.documentElement.scrollTop = document.body.scrollTop = 0; 
                    }else{
                        layer.msg('加载失败')
                    }
                });
            }else{
                layer.msg('后边没有啦！')
            }
        });
        $("#nav .tit").slide({
            type:"menu",
            titCell:".mod_cate",
            targetCell:".mod_subcate",
            delayTime:0,
            triggerTime:10,
            defaultPlay:false,
            returnDefault:true
        });
    });
</script>
</html>