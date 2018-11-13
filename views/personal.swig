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
<!-- ZUI 标准版压缩后的 JavaScript 文件 -->
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head> 
<style>
    .NumberBoard{display:flex}
    .NumberBoard-item.Button{border:0;line-height:unset;font-size:unset}
    .NumberBoard--divider.NumberBoard-item+.NumberBoard-item.NumberBoard-itemInner{border-left:1px solid#ebebeb}
    .NumberBoard-item{-webkit-box-flex:1;-ms-flex:1;flex:1}
    .NumberBoard-itemInner{text-align:center;line-height:1.6}
    .NumberBoard-itemName{font-size:14px;color:#8590a6}
    .NumberBoard-itemValue{display:inline-block;font-size:18px;color:#1a1a1a;font-weight:600;font-synthesis:style}
    .FollowshipCard .NumberBoard-itemInner{padding:12px 0}

    .Profile-lightItem{padding-left: 5px; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; height: 46px; font-size: 14px; border-top: 1px solid #ebebeb; color: #646464;}
    .Profile-lightItemName{-webkit-box-flex: 1; -ms-flex-positive: 1; flex-grow: 1;}
    .Profile-lightItemValue{font-size: 14px; color: #8590a6;}

    .layui-tab .layui-tab-title li { font-size: 16px;  color: #1a1a1a;}
    .layui-tab .layui-this{ color:#1a1a1a !important;  font-weight:600; }
    .layui-tab-brief>.layui-tab-more li.layui-this:after, .layui-tab-brief>.layui-tab-title .layui-this:after{ border-bottom:3px solid #0084ff;}

    .tab-loading { text-align: center;color:#c2c2c2;font-size:14px; }
    .tab-loading i{font-size:56px;  }

    .my-works li{ position: relative; padding: 16px 20px; border-bottom:1px solid #f6f6f6;}
    .my-works li a.title { font-size: 18px;font-weight: 600;line-height: 1.6;color: #1a1a1a;display:block;}
    .my-works li p.description{ color: #8590a6; font-size:16px;margin:5px 0;}
    .my-works li p.other { color: #646464;font-size: 14px; }

    .my-fans li { padding :16px 20px; overflow:hidden; }
    .my-fans li img { float :left; width:60px; height:60px; margin-right:30px; }
    .my-fans li .info {-webkit-box-flex: 1;-ms-flex: 1;flex: 1; }
    .my-fans li .info a.name {  color: #1a1a1a; display:block; font-size: 18px; font-weight: 600; }
    .my-fans li .info p.description {  color: #8590a6; font-size: 14px;}

    #works-page ,#collect-page ,#follow-page ,#fans-page{ text-align: center; margin-top:30px;}

    .layui-laypage a ,.layui-laypage span{color: #222; cursor: pointer; text-align: center;font-size: 14px; min-width: 15px; margin: 0 2px; padding: 0 10px; display: inline-block; height: 36px; line-height: 36px; text-decoration: none;}
    .creply-box .layui-laypage a ,.bb-comment .creply-box .layui-laypage span{color: #222; cursor: pointer; text-align: center; margin: 0 4px; text-decoration: none;  border:none;}
    .creply-box .layui-laypage .layui-laypage-curr{ border:none; }
    .creply-box .layui-laypage .layui-laypage-curr .layui-laypage-em{background-color: transparent; border:none;}
    .creply-box .layui-laypage .layui-laypage-curr em{color:#d2d2d2;font-weight: 700; border:none;}
    .creply-box .layui-laypage a:hover{color: #00a1d6;font-weight: 700;}

    .letter { width:100%; height:300px; border:none !important; padding:20px; background:#f6f6f6; font-size:16px;resize:none; }


</style>
<body style="background:#f6f6f6;">
{% include "./includes/header/head.swig" %}
<div class="bm-container ovh">
    <div class="card2" style="width:1000px;padding:20px;overflow:hidden;">
        <div style="float:left;width:180px;">
            <img src="{{ userInfo.avatar }}" width="160" height="160">
        </div>
        <div style="float:rigth;">
            <p style="font-size:26px;font-weight:600;">{{ userInfo.name }}</p>
            <p style="font-size:16px;margin:10px;min-height:50px;color: #8590a6;">
                {% if userInfo.presentation %}
                    {{ userInfo.presentation }}
                {% else %}
                    暂无签名
                {% endif %}
            </pp>
            <div>
                {% if User._id.toString() %}
                     {% if User._id.toString() !== userInfo._id.toString() %}
                        <button id="follow" class="layui-btn layui-btn-normal"><i class="layui-icon">&#xe654;</i>&nbsp;&nbsp;关注</button>
                        <button id="active-key" data-method="letter" class="layui-btn layui-btn-primary"><i class="layui-icon">&#xe611;</i>&nbsp;&nbsp;发私信</button>
                    {% endif %}
                {% else %}
                    <a href='/login' class="layui-btn layui-btn-normal"><i class="layui-icon">&#xe66f;</i>&nbsp;&nbsp;登陆</a>
                {% endif %}
            </div>
        </div>
    </div>

    <div style="width:1000px;overflow:hidden;">
        <div style="float:left;width:300px;">
            <div class="card2 FollowshipCard">
                <div class="NumberBoard FollowshipCard-counts NumberBoard--divider">
                    <a type="button" class="Button NumberBoard-item Button--plain">
                        <div class="NumberBoard-itemInner" >
                            <div class="NumberBoard-itemName">粉丝</div>
                            <strong class="NumberBoard-itemValue" title="{{ userInfo.count.follow  }}">{{ userInfo.count.follow  }}</strong>
                        </div>
                    </a>
                </div>
            </div>
            <div class="Profile-lightList" lay-filter="tabs">
                <a class="Profile-lightItem" data-tab="#tabs=works">
                    <span class="Profile-lightItemName">
                        Ta的作品
                    </span>
                </a>
                <a class="Profile-lightItem" data-tab="#tabs=collect">
                    <span class="Profile-lightItemName">
                        Ta的收藏
                    </span>
                </a>
                <a class="Profile-lightItem" data-tab="#tabs=follow">
                    <span class="Profile-lightItemName">
                        Ta的关注
                    </span>
                </a>
                <a class="Profile-lightItem" data-tab="#tabs=fans">
                    <span class="Profile-lightItemName">
                        Ta的粉丝
                    </span>
                </a>
            </div>



        </div>
        <div class="card2" style="float:right;width:690px;min-height:400px;">
            <div class="layui-tab layui-tab-brief" lay-filter="tabs" style="padding:0;">
                <ul class="layui-tab-title">
                    <li class="layui-this" lay-id="works" >作品</li>
                    <li lay-id="collect">收藏</li>
                    <li lay-id="follow">关注</li>
                    <li lay-id="fans">粉丝</li>
                </ul>
                <div class="layui-tab-content">
                    <div id="my-works" class="layui-tab-item layui-show">
                        <div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>
                    </div>
                    <div id="my-collect" class="layui-tab-item">
                        <div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>
                    </div>
                    <div id="my-follow" class="layui-tab-item">
                        <div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>
                    </div>
                    <div id="my-fans" class="layui-tab-item">
                        <div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>
                    </div>
                </div>
            </div>
        </div>


    </div>

</div>
<label id="user-info" data-id="{{ userInfo._id.toString() }}" data-muid="{{ User._id.toString() }}"></label>
<label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
{% include "./includes/footer/footer.swig" %}
<script>
    layui.use(['laypage','layer','element'], function(){ 
        var laypage = layui.laypage;
        var $ = layui.jquery;
        var element = layui.element;
        var layer = layui.layer;
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var uid =  $('#user-info').data('id');
        var muid =  $('#user-info').data('muid');
        var layid = location.hash.replace(/^#tabs=/, '');
        element.tabChange('tabs', layid);
        selectedTabs(location.hash)
        element.on('tab(tabs)', function(elem){
            location.hash = 'tabs='+ $(this).attr('lay-id');
            selectedTabs(location.hash)
        });

        function selectedTabs(hash){
            hash = location.hash.replace(/^#tabs=/, '');
            switch(hash){
                case 'collect':
                    getCollect();
                break;
                case 'follow':
                    getFollow();
                break;
                case 'fans':
                    getFans();
                break;
                default :
                    getDramas();
                break;
            }
        }

        function getDramas(page){
            page = page || 1
            $('#my-works').html('<div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>')
            $.get('/v1/drama/fdbui', { id :uid ,page ,size :10 },function(result){
                    if(result.success){
                        if(result.data.list.length > 0){
                            $('#my-works').html('')
                            let dom = createDramsElement(result)
                            $('#my-works').append(dom.element)
                            var replyPag = dom.page
                            laypage.render({
                                    elem: replyPag.elem 
                                    ,count: replyPag.count //数据总数
                                    ,limit :replyPag.limit
                                    ,curr  :replyPag.curr
                                    ,layout : replyPag.count > 0 ? ["page","next"] :[]
                                    ,jump :function(obj,first){
                                        if(!first){
                                            getDramas(obj.curr)
                                        }
                                    }
                            });
                        }else{
                            $('#my-works').html('<div class="tab-loading"><i class="layui-icon layui-icon-list"></i><br/>暂无数据</div>')
                        }
                    }else{
                        $('#my-works').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
                    }
            }).error(function(){
                $('#my-works').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
            })
        }


        function getCollect(page){
            page = page || 1
            $('#my-collect').html('<div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>')
            $.get('/v1/dlike/collectlist', { uid :uid ,page ,size :10 },function(result){
                    if(result.success){
                        if(result.data.list.length > 0){
                            $('#my-collect').html('')
                            let dom = createCollectElement(result)
                            $('#my-collect').append(dom.element)
                            var replyPag = dom.page
                            laypage.render({
                                    elem: replyPag.elem 
                                    ,count: replyPag.count //数据总数
                                    ,limit :replyPag.limit
                                    ,curr  :replyPag.curr
                                    ,layout : replyPag.count > 0 ? ["page","next"] :[]
                                    ,jump :function(obj,first){
                                        if(!first){
                                            getCollect(obj.curr)
                                        }
                                    }
                            });
                        }else{
                            $('#my-collect').html('<div class="tab-loading"><i class="layui-icon layui-icon-list"></i><br/>暂无数据</div>')
                        }
                    }else{
                        $('#my-collect').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
                    }
            }).error(function(){
                $('#my-collect').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
            })
        }

        function getFollow(page){
            page = page || 1
            $('#my-follow').html('<div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>')
            $.get('/v1/relation/stars', { id :uid ,page ,size :10 },function(result){
                    if(result.success){
                        if(result.data.list.length > 0){
                            $('#my-follow').html('')
                            let dom = createFollowElement(result)
                            $('#my-follow').append(dom.element)
                            var replyPag = dom.page
                            laypage.render({
                                    elem: replyPag.elem 
                                    ,count: replyPag.count //数据总数
                                    ,limit :replyPag.limit
                                    ,curr  :replyPag.curr
                                    ,layout : replyPag.count > 0 ? ["page","next"] :[]
                                    ,jump :function(obj,first){
                                        if(!first){
                                            getCollect(obj.curr)
                                        }
                                    }
                            });
                        }else{
                            $('#my-follow').html('<div class="tab-loading"><i class="layui-icon layui-icon-list"></i><br/>暂无数据</div>')
                        }
                    }else{
                        $('#my-follow').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
                    }
            }).error(function(){
                $('#my-follow').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
            })
        }


        function getFans(page){
            page = page || 1
            $('#my-fans').html('<div class="tab-loading"><i class="layui-icon layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i><br/>加载中...</div>')
            $.get('/v1/relation/fans', { id :uid ,page ,size :10 },function(result){
                    if(result.success){
                        if(result.data.list.length > 0){
                            $('#my-fans').html('')
                            let dom = createFansElement(result)
                            $('#my-fans').append(dom.element)
                            var replyPag = dom.page
                            laypage.render({
                                    elem: replyPag.elem 
                                    ,count: replyPag.count //数据总数
                                    ,limit :replyPag.limit
                                    ,curr  :replyPag.curr
                                    ,layout : replyPag.count > 0 ? ["page","next"] :[]
                                    ,jump :function(obj,first){
                                        if(!first){
                                            getCollect(obj.curr)
                                        }
                                    }
                            });
                        }else{
                            $('#my-fans').html('<div class="tab-loading"><i class="layui-icon layui-icon-list"></i><br/>暂无数据</div>')
                        }
                    }else{
                        $('#my-fans').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
                    }
            }).error(function(){
                $('#my-fans').html('<div class="tab-loading"><i class="layui-icon layui-icon-face-cry"></i><br/>加载失败</div>')
            })
        }




        function createDramsElement(result){
            var div = $('<div></div>')
            var ul = $('<ul class="my-works"></ul>')
            result.data.list.forEach(function(item){
                var li = $('<li></li>')
                var categorys = [];
                li.append($('<a target="_blank" href="/drama?id=' + item._id.toString()+'" class="title">' + item.title +  '</a>'))
                li.append($('<p class="description">' + item.description +'</p>'))
                if(item.category_id.length > 0){
                    item.category_id.forEach(function(category){
                        categorys.push(category.name)
                    })
                }
                var category_other = categorys.length > 0 ? categorys.join(" / ") : '其他'
                li.append($('<p class="other">' + category_other.toString() +'</p>'))
                ul.append(li);
            })

            div.append(ul)
            var pageing_box = $('<div id="works-page" lay-filter="test1" class="creply-box"><div>');
            var replyPagination = result.data.pagination;
            var replyPag = {
                elem : pageing_box,
                count : replyPagination.total,
                limit : replyPagination.size,
                curr : replyPagination.current,
            }
            div.append(pageing_box)
            return { element : div ,page : replyPag };
        }


        function createCollectElement(result){
            var div = $('<div></div>')
            var ul = $('<ul class="my-works"></ul>')
            result.data.list.forEach(function(item){
                var li = $('<li></li>')
                var categorys = [];
                li.append($('<a target="_blank" href="/drama?id=' + item.drama_id._id.toString()+'" class="title">' + item.drama_id.title +  '</a>'))
                li.append($('<p class="description">' + item.drama_id.description +'</p>'))
                if(item.drama_id.category_id.length > 0){
                    item.drama_id.category_id.forEach(function(category){
                        categorys.push(category.name)
                    })
                }
                var category_other = categorys.length > 0 ? categorys.join(" / ") : '其他'
                li.append($('<p class="other">' + category_other.toString() +'</p>'))
                ul.append(li);
            })

            div.append(ul)
            var pageing_box = $('<div id="collect-page" lay-filter="test1" class="creply-box"><div>');
            var replyPagination = result.data.pagination;
            var replyPag = {
                elem : pageing_box,
                count : replyPagination.total,
                limit : replyPagination.size,
                curr : replyPagination.current,
            }
            div.append(pageing_box)
            return { element : div ,page : replyPag };
        }


        function createFollowElement(result){
            var div = $('<div></div>')
            var ul = $('<ul class="my-fans"></ul>')
            result.data.list.forEach(function(item){
                var li = $('<li></li>')
                var info = $('<div class="info"></div>')
                li.append($('<img src="' + item.to_user_id.avatar +'" />'))
                info.append($('<a target="_blank" href="/personal?id='+ item.to_user_id._id.toString() +'" class="name" href="#">' + item.to_user_id.name +'</a>'))
                var presentation = item.to_user_id.presentation || '暂无签名'
                info.append($('<p class="description">' + presentation + '</p>'))
                li.append(info)
                ul.append(li);
            })

            div.append(ul)
            var pageing_box = $('<div id="follow-page" lay-filter="test1" class="creply-box"><div>');
            var replyPagination = result.data.pagination;
            var replyPag = {
                elem : pageing_box,
                count : replyPagination.total,
                limit : replyPagination.size,
                curr : replyPagination.current,
            }
            div.append(pageing_box)
            return { element : div ,page : replyPag };
        }

        function createFansElement(result){
            var div = $('<div></div>')
            var ul = $('<ul class="my-fans"></ul>')
            result.data.list.forEach(function(item){
                var li = $('<li></li>')
                var info = $('<div class="info"></div>')
                li.append($('<img src="' + item.from_user_id.avatar +'" />'))
                info.append($('<a target="_blank" href="/personal?id='+ item.from_user_id._id.toString() +'" class="name" href="#">' + item.from_user_id.name +'</a>'))
                var presentation = item.from_user_id.presentation || '暂无签名'
                info.append($('<p class="description">' + presentation + '</p>'))
                li.append(info)
                ul.append(li);
            })

            div.append(ul)
            var pageing_box = $('<div id="fans-page" lay-filter="test1" class="creply-box"><div>');
            var replyPagination = result.data.pagination;
            var replyPag = {
                elem : pageing_box,
                count : replyPagination.total,
                limit : replyPagination.size,
                curr : replyPagination.current,
            }
            div.append(pageing_box)
            return { element : div ,page : replyPag };
        }


        $('.Profile-lightList a').on('click', function(){
            var othis = $(this), tab = othis.data('tab');
            location.hash = tab;
            element.tabChange('tabs', location.hash.replace(/^#tabs=/, ''));
            selectedTabs(tab)
        });

        // 关注

        if(uid && muid){
            $.get('/v1/relation/isfollow', {  
                fid :muid,
                tid : uid
            },function(result){
                if(result.success){
                    if(result.data){
                        $('#follow').removeClass('layui-btn-normal').addClass('layui-btn-danger').html('<i class="layui-icon">&#x1006;</i>&nbsp;&nbsp;取消关注').attr('data-state','2')
                    }else{
                        $('#follow').attr('data-state','1')
                    }
                }
            });
        }

          $('#follow').click(function(){
            var state = $(this).attr('data-state');
            if(state == 1 || state == "1"){
                $.ajax('/v1/relation/follow', {
                    type: 'POST',
                    data: { fid :muid ,tid : uid }, 
                    headers: { authorization: access_token ,aud: access_aud },
                    success: function(result){
                        if(result.success){
                            $('#follow').removeClass('layui-btn-normal').addClass('layui-btn-danger').html('<i class="layui-icon">&#x1006;</i>&nbsp;&nbsp;取消关注').attr('data-state','2')
                            layer.msg('关注成功',{
                                time :1000,
                            });
                        }else{
                            layer.msg(result.msg,{
                                time :1000,
                            });
                        }
                    },
                });
            }else if(state == 2 || state == "2"){
                $.ajax('/v1/relation/follow', {
                    type: 'POST',
                    data: { fid :muid ,tid : uid }, 
                    headers: { authorization: access_token ,aud: access_aud },
                    success: function(result){
                        if(result.success){
                            $('#follow').removeClass('layui-btn-danger').addClass('layui-btn-normal').html('<i class="layui-icon">&#xe654;</i>&nbsp;&nbsp;关注').attr('data-state','1')
                            layer.msg('取消了关注',{
                                time :1000,
                            });
                        }else{
                            layer.msg(result.msg,{
                                time :1000,
                            });
                        }
                    },
                });
            }else{
                window.location.href='/login';
            }
        })
        // 私信

         var active = {
            letter: function(){
                var that = this; 
                layer.open({
                    type: 1 //此处以iframe举例
                    ,title:'发送私信'
                    ,offset: '100px'
                    ,area: ['390px', '400px']
                    ,shade: 0.3
                    ,id: 'letter-box'
                    ,content: '<textarea class="letter" ></textarea >'
                    ,btn: ['发送私信', '关闭'] //只是为了演示
                    ,yes: function(index, layero){
                        var letter_content = $('#letter-box textarea').val();
                        $.ajax('/v1/notify/userPrivateLetter', {
                            type: 'POST',
                            data: { sid :muid ,uid :uid ,content :letter_content }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    layer.msg('私信发送成功',{time :1000});
                                    layer.close(index)
                                }else{
                                    layer.msg('私信发送失败',{time :1000});
                                }
                            },
                        });
                    }
                });
            }
        };

        $('#active-key').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });


    });
</script>
<!-- <script type="text/javascript" src="lib/jquery.min.js"></script> 
<script type="text/javascript" src="h-ui/js/h-ui.js"></script>  -->
</body>
</html>