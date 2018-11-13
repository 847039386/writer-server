<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/css/udm-styles.css">
    <link href="/css/bm-main.css" rel="stylesheet" type="text/css" />
    <link href="/css/layui.css" rel="stylesheet" type="text/css" />
    <script src="/js/layui.js" charset="utf-8"></script>  
    <title>北门中文网 - 我的剧本</title>
</head>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="dramaID" data-id="{{ drama._id.toString() }}"></label>
    <label id="character" data-content="{{ drama.character }}"></label>
    <label id="abstract" data-content="{{ drama.abstract }}"></label>
    <label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>

    <div class="udm-main">
        <div class="udm-main-container-left">
            <div class="udm-menu">
                <ul>
                    <li class="selected"><a href="/user/dramas">我的剧本</a></li>
                    <li><a href="/user/collects">我的收藏</a></li>
                    <li><a href="/user/notify">我的消息</a></li>
                    <li><a href="/user/info">个人信息</a></li>
                    <li><a href="/user/safety">安全管理</a></li>
                </ul>
            </div>
        </div>
        <div class="udm-main-container-right">
            <div class="udm-main-container-breadcrumb">
                <b></b>
                <i class="before"><a href="/user/dramas"><span>作品管理</span></a></i>
                <em class="diff"></em>
                <i class="current"><span>{{ drama.title }}</span></i> 
            </div>
            <div class="udm-main-container-fast"> 
                <div class="tabs">
                    <span><a href="/user/drama/setting?id={{ drama._id.toString() }}">作品设置</a></span>
                    <span class="selected"><a href="#">大纲/小传</a></span>
                    <span><a href="/user/chapters?id={{ drama._id.toString() }}&title={{ drama.title }}">已发布章节</a></span>
                </div>
            </div>
            <div class="adm-chapter-set">
                <div class="chapter-wrap">
                    <div class="chapter-wrap-title">
                    </div>
                    <div class="chapter-wrap-list">
                        <ul>
                            <li class="active_func" data-method="selectedChapter" data-status="abstract">
                                <div class="c-warp">
                                    <p class="title">
                                        <em>剧本梗概</em>
                                    </p>
                                    <p class="help">
                                        <i>{{ drama.create_at |date('Y-m-d') }}</i>
                                        {{drama.abstract.length || 0 }}字
                                    </p>
                                </div>
                            </li>
                            <li class="active_func" data-method="selectedChapter"  data-status="character">
                                <div class="c-warp">
                                    <p class="title">
                                        <em>人物小传</em>
                                    </p>
                                    <p class="help">
                                        <i>{{ drama.create_at |date('Y-m-d') }}</i>
                                        {{drama.character.length || 0 }}字
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="chapter-box">
                    <div class="chapter-tool">
                        <div class="buttons-warp">
                            <a class="button green active_func" data-method="save"><i class="layui-icon layui-icon-file" style=" color: #fff;"></i> 保存</a>
                        </div>
                    </div>
                    <div class="chapter-editor">
                        <div class="status-loading">
                            <i class="layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i>&nbsp;&nbsp;加载中
                        </div>
                        <div class="status-error">
                            <i class="layui-icon layui-icon-face-cry"></i>&nbsp;&nbsp;加载失败
                        </div>
                        <div class="status-editor">
                            <textarea id="chapter-content" placeholder="请输入正文。"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </div>
</body>
<script>

    Date.prototype.pattern=function(fmt) {         
        var o = {         
            "M+" : this.getMonth()+1, //月份         
            "d+" : this.getDate(), //日         
            "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
            "H+" : this.getHours(), //小时         
            "m+" : this.getMinutes(), //分         
            "s+" : this.getSeconds(), //秒         
            "q+" : Math.floor((this.getMonth()+3)/3), //季度         
            "S" : this.getMilliseconds() //毫秒         
        };         
        var week = {         
            "0" : "/u65e5",         
            "1" : "/u4e00",         
            "2" : "/u4e8c",         
            "3" : "/u4e09",         
            "4" : "/u56db",         
            "5" : "/u4e94",         
            "6" : "/u516d"        
        };         
        if(/(y+)/.test(fmt)){         
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
        }         
        if(/(E+)/.test(fmt)){         
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
        }         
        for(var k in o){         
            if(new RegExp("("+ k +")").test(fmt)){         
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
            }         
        }         
        return fmt;         
    }       

    layui.use(['layer','element'], function(){ 
        var $ = layui.jquery, layer = layui.layer; 
        var status = null;
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var drama_id = $('#dramaID').data('id');
        //触发事件
        var active = {
            selectedChapter : function(dom) {
                var status = $(dom).data('status');
                $(dom).siblings('li').removeClass('selected'); 
                $(this).addClass('selected');
                if(status == "abstract"){
                    var abstract = $('#abstract').data('content')
                    $('.status-editor').addClass('show')
                    $('#chapter-content').val(abstract)
                }else if(status ="character"){
                    var character = $('#character').data('content')
                    $('.status-editor').addClass('show')
                    $('#chapter-content').val(character)
                }
            },
            save :function(dom){
                var status = $('.chapter-wrap-list ul li.selected').data('status');
                var content = $('#chapter-content').val()
                if(status == "abstract"){
                    $.ajax('/v1/drama/abstract', {
                        type: 'POST',
                        data: { id :drama_id ,content :content }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
                                $('#abstract').data('content',content)
                                $('.chapter-wrap-list ul li.selected').find('.help').html('<p><i>' + new Date().pattern('yyyy-MM-dd') + '</i>'+ content.length +'字</p>')
                                layer.msg('保存成功',{
                                    time :2000,
                                });
                            }else{
                                layer.msg('保存失败',{
                                    time :2000,
                                });
                            }
                        },
                    });
                }else if(status == "character"){
                    $.ajax('/v1/drama/character', {
                        type: 'POST',
                        data: { id :drama_id ,content :content }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
                                $('#character').data('content',content)
                                $('.chapter-wrap-list ul li.selected').find('.help').html('<p><i>' + new Date().pattern('yyyy-MM-dd') + '</i>'+ content.length +'字</p>')
                                layer.msg('保存成功',{
                                    time :1000,
                                });
                            }else{
                                layer.msg('保存失败',{
                                    time :1000,
                                });
                            }
                        },
                    });
                }
            }
        };
        $(document).on('click', '.active_func', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });

    });
</script>
</html>