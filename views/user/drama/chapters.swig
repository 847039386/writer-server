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
    <title>北门中文网 - 剧集管理</title>
</head>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="dramaID" data-id="{{ drama_id.toString() }}"></label>
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
                <i class="current"><span>{{ drama_title }}</span></i> 
            </div>
            <div class="udm-main-container-fast"> 
                <div class="tabs">
                    <span><a href="/user/drama/setting?id={{ drama_id.toString() }}">作品设置</a></span>
                    <span><a href="/user/other?id={{ drama_id.toString() }}">大纲/小传</a></span>
                    <span class="selected"><a href="#">已发布章节</a></span>
                </div>
                <a class="button active_func" data-method="createHtm" ><i class="layui-icon layui-icon-add-1" style=" color: #fff;"></i> 新建章节</a>
            </div>
            <div class="adm-chapter-set">
                <div class="chapter-wrap">
                    <div class="chapter-wrap-title">
                        共 <span style="color: #4EA8FF;margin: 0 5px;">{{current.total}}</span> 集
                    </div>
                    <div class="chapter-wrap-list">
                        <ul>
                            {% for chapter in chapters %}
                                <li class="active_func" data-method="selectedChapter" data-id="{{ chapter._id.toString() }}">
                                    <div class="c-warp">
                                        <p class="title">
                                            <em>{{ chapter.title }}</em>
                                        </p>
                                        <p class="help">
                                            <i>{{ chapter.create_at |date('Y-m-d') }}</i>
                                            {{ chapter.wordCount }}字
                                        </p>
                                    </div>
                                </li>
                            {% endfor %}
                        </ul>
                    </div>
                </div>
                <div class="chapter-box">
                    <div class="chapter-tool">
                        <div class="buttons-warp">
                            <a class="button white active_func" data-method="delete"><i class="layui-icon layui-icon-delete" style=" color: #999;"></i> 删除</a>
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
                            <input id="chapter-id" type="text" style="display:none;"/>
                            <input id="chapter-title" type="text" placeholder="此处输入标题名。示例：“第十集 ......" />
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
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var status = null;
        var drama_id = $('#dramaID').data('id');
        //触发事件
        var active = {
            selectedChapter : function(dom) {
                var chapterID = $(dom).data('id');
                if(chapterID){
                    $(dom).siblings('li').removeClass('selected'); 
                    $(this).addClass('selected');
                    $('.status-error').removeClass('show')
                    $('.status-loading').addClass('show')
                    $.get('/v1/chapter/fdi', {  
                        id :chapterID,
                    },function(result){
                        $('.status-loading').removeClass('show')
                        if(result.success){
                            $('.status-editor').addClass('show')
                            $('#chapter-id').val(result.data._id);
                            $('#chapter-title').val(result.data.title);
                            $('#chapter-content').val(result.data.content);
                        }else{
                            $('.status-error').addClass('show')
                            layer.msg('剧集加载失败',{
                                time :2000,
                            });
                        }
                    });
                }else{
                    $('#chapter-id').val('');         
                    $('#chapter-title').val('');
                    $('#chapter-content').val('');
                    $(dom).siblings('li').removeClass('selected'); 
                    $(dom).addClass('selected');
                    $('.status-editor').addClass('show');
                }
            },
            save :function(dom){
                var id = $('#chapter-id').val();
                var title = $('#chapter-title').val();
                var content = $('#chapter-content').val();
                if(id){
                    if(id && title && content){
                        $.ajax('/v1/chapter/ut', {
                            type: 'POST',
                            data: { id ,content ,title }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    var current_index = $('.chapter-wrap-list ul li.selected').index()
                                    let increate = $($('.chapter-wrap-list ul li')[current_index]);
                                    $(increate).data('id',result.data._id)
                                    $(increate).find('.title em').text(result.data.title)
                                    $(increate).find('.help').html('<p><i>' + new Date(result.data.create_at).pattern('yyyy-MM-dd') + '</i>'+ result.data.wordCount +'字</p>')
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
                    }else{
                        layer.msg('没有可操作的文章',{
                            time :2000,
                        });
                    }
                }else{
                    $.ajax('/v1/chapter/ct', {
                        type: 'POST',
                        data: { id :drama_id ,content ,title }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
                                layer.msg('保存成功',{
                                        time :2000,
                                });
                                let increate = $($('.chapter-wrap-list ul li')[0]);
                                $(increate).attr('data-id',result.data._id)
                                $(increate).find('.title em').text(result.data.title)
                                $(increate).find('.help').html('<p><i>' + new Date(result.data.create_at).pattern('yyyy-MM-dd') + '</i>'+ result.data.wordCount +'字</p>')
                                $('#chapter-id').val(result.data._id); 
                            }else{
                                layer.msg('保存失败',{
                                        time :2000,
                                });
                            }
                        },
                    });
                }
            },
            createHtm : function ( dom){
                if($($('.chapter-wrap-list ul li')[0]).data('id') || $('.chapter-wrap-list ul li').length == 0){
                    let li_box = $('<li></li>').addClass('active_func').attr('data-method',"selectedChapter");
                    let c_warp = $('<div></div>').addClass('c-warp');
                    let title = $('<p></p>').addClass('title');
                    title.append($('<em></em>').text('未命名'));
                    let help = $('<p><i>' + new Date().pattern('yyyy-MM-dd') + '</i>0字</p>').addClass('help');
                    help.html();
                    c_warp.append(title).append(help);
                    li_box.append(c_warp)
                    $('.chapter-wrap-list ul').prepend(li_box);
                    $('#chapter-id').val('');         
                    $('#chapter-title').val('');
                    $('#chapter-content').val('');
                    $(li_box).siblings('li').removeClass('selected'); 
                    $(li_box).addClass('selected');
                    $('.status-editor').addClass('show');
                }else{
                    layer.msg('请先保存创建的章节',{
                        time :2000,
                    });
                }
                
            },
            delete : function(dom){
                if($('.chapter-wrap-list ul li').length > 0){
                    var chapterID = $(dom).data('id');
                    var current_dom = $('.chapter-wrap-list ul li.selected');
                    var chapterID = current_dom.data('id')
                    if(chapterID){
                        layer.open({
                            type: 1
                            ,fixed :false
                            ,scrollbar :false
                            ,title: '信息'
                            ,shade: 0.8
                            ,area: ['260px']
                            ,shadeClose :true
                            ,id: 'LAY_layuipro3' //设定一个id，防止重复弹出
                            ,btnAlign: 'r'
                            ,btn: ['确定', '取消']
                            ,moveType: 1 
                            ,content: '<div style="padding: 30px; font-size:14px; line-height: 22px; font-weight: 300;">确定删除该剧集？</div>'
                            ,yes:function(index, layero){
                                $.ajax('/v1/chapter/rm', {
                                    type: 'POST',
                                    data: { id :chapterID }, 
                                    headers: { authorization: access_token ,aud: access_aud },
                                    success: function(result){
                                        if(result.success){
                                            layer.close(index) 
                                            $('.status-editor').removeClass('show');
                                            current_dom.remove()
                                        }else{
                                            layer.msg('删除失败',{
                                                    time :2000,
                                                    offset :'100px'
                                            });
                                        }
                                    },
                                });
                            }
                        });
                    }else{
                        $('.status-editor').removeClass('show');
                        current_dom.remove()
                    }
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