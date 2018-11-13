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
    <title>北门中文网 - 我的消息</title>
</head>
<style>
    .layui-laypage a ,.layui-laypage span{color: #222; cursor: pointer; text-align: center;font-size: 14px; min-width: 15px; margin: 0 2px; padding: 0 10px; display: inline-block; height: 36px; line-height: 36px; text-decoration: none;}
    .creply-box { margin :30px 0;}
    .creply-box .layui-laypage a ,.bb-comment .creply-box .layui-laypage span{color: #222; cursor: pointer; text-align: center; margin: 0 4px; text-decoration: none;  border:none;}
    .creply-box .layui-laypage .layui-laypage-curr{ border:none; }
    .creply-box .layui-laypage .layui-laypage-curr .layui-laypage-em{background-color: transparent; border:none;}
    .creply-box .layui-laypage .layui-laypage-curr em{color:#d2d2d2;font-weight: 700; border:none;}
    .creply-box .layui-laypage a:hover{color: #00a1d6;font-weight: 700;}
    #works-page ,#collect-page ,#follow-page ,#fans-page{ text-align: center; margin-top:30px;}
    .letter { width:100%; min-height:295px; box-sizing: border-box; border:none !important; padding:20px; background:#f6f6f6; font-size:16px;resize:none; }
</style>
<body>
    {% include "../includes/header/head.swig" %}
    <label id="user-info" data-id="{{ User._id.toString() }}"></label>
    <label id='s_current' data-total="{{ current.total  }}" data-page="{{ current.page  }}" data-pagesize="{{ current.pageSize  }}" ></label>
    <label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
    <div class="udm-main">
        <div class="udm-main-container-left">
            <div class="udm-menu">
                <ul>
                    <ul>
                        <li><a href="/user/dramas">我的剧本</a></li>
                        <li><a href="/user/collects">我的收藏</a></li>
                        <li class="selected"><a>我的消息</a></li>
                        <li><a href="/user/info">个人信息</a></li>
                        <li><a href="/user/safety">安全管理</a></li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="udm-main-container-right">
            <div class="udm-main-container-breadcrumb">
                <i class="before"><a href="#"><span>我的消息</span></a></i>
            </div>
            <div class="udm-notify-list">
                <ul>
                    {% for notify in notifys %}
                        <!-- 提醒 -->
                        {% if notify.type == 2 %}
                            <!-- 剧本消息 -->
                            {% if notify.targetType == 'drama' %}
                                <!-- 收藏消息 -->
                                {% if notify.action == 'collect' %}
                                    <li class="notyfy-item collect">
                                        <div class="item-meta">
                                            <div class="item-meta-avatar">
                                                <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                                <span class="item-type c-sc">藏</span>
                                            </div>
                                            <div class="item-meta-content">
                                                <ul>
                                                    <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                    <li class="f-thide">收藏了&nbsp;&nbsp;<a target="_blank" href="/drama?id={{ notify.drama_id.id.toString() }}" class="sender">{{ notify.drama_id.title }}</a>&nbsp;&nbsp;这部剧本。</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="item-active">
                                            <ul>
                                                <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                            </ul>
                                        </div>
                                    </li>
                                <!-- 赞消息 -->
                                {% elseif notify.action == 'like' %}
                                    <li class="notyfy-item collect">
                                        <div class="item-meta">
                                            <div class="item-meta-avatar">
                                                <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                                <span class="item-type c-like">赞</span>
                                            </div>
                                            <div class="item-meta-content">
                                                <ul>
                                                    <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                    <li class="f-thide">赞了&nbsp;&nbsp;<a target="_blank" href="/drama?id={{ notify.drama_id.id.toString() }}" class="sender">{{ notify.drama_id.title }}</a>&nbsp;&nbsp;这部剧本。</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="item-active">
                                            <ul>
                                                <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                            </ul>
                                        </div>
                                    </li>
                                {% endif %}
                            <!-- 评论消息 -->
                            {% elseif notify.targetType == 'comment' %}
                                    <!-- 普通评论 -->
                                    {% if notify.action == "normal" %}
                                        <li class="notyfy-item">
                                            <div class="item-meta">
                                                <div class="item-meta-avatar">
                                                    <span class="item-type c-pl">评</span>
                                                    <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                                </div>
                                                <div class="item-meta-content">
                                                    <ul>
                                                        <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                        <li class="f-thide">评论了&nbsp;&nbsp;<a target="_blank" href="/drama?id={{ notify.drama_id.id.toString() }}" class="sender">{{ notify.drama_id.title }}</a></li>
                                                        <li class="f-content">{{ notify.content }}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="item-active">
                                                <ul>
                                                    <li class="sa_actions" data-method="replyComment" data-cid="{{ notify.opids.one.toString() }}" data-did="{{ notify.drama_id._id.toString() }}" data-name="{{ notify.sender.name }}" data-uid="{{ notify.sender._id.toString() }}">回复</li>
                                                    <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                                </ul>
                                            </div>
                                        </li>
                                    <!-- 回复评论 -->
                                    {% elseif notify.action == 'reply' %}
                                        <li class="notyfy-item">
                                            <div class="item-meta">
                                                <div class="item-meta-avatar">
                                                    <span class="item-type c-pl">回复</span>
                                                    <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                                </div>
                                                <div class="item-meta-content">
                                                    <ul>
                                                        <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                        <li class="f-thide">回复了您的评论&nbsp;&nbsp;<a target="_blank" href="/drama?id={{ notify.drama_id.id.toString() }}" class="sender">{{ notify.drama_id.title }}</a></li>
                                                        <li class="f-content">{{ notify.content }}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="item-active">
                                                <ul>
                                                    <li class="sa_actions" data-method="replyComment" data-cid="{{ notify.opids.one.toString() }}" data-rid="{{ notify.opids.two.toString() }}" data-did="{{ notify.drama_id._id.toString() }}" data-name="{{ notify.sender.name }}" data-uid="{{ notify.sender._id.toString() }}">回复</li>
                                                    <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                                </ul>
                                            </div>
                                        </li>
                                    {% endif %}
                            <!-- 粉丝消息 -->
                            {% elseif notify.targetType == 'fans' %}
                                    <!-- 关注 -->
                                    {% if notify.action == "follow" %}
                                        <li class="notyfy-item collect">
                                            <div class="item-meta">
                                                <div class="item-meta-avatar">
                                                    <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                                    <span class="item-type c-fans">粉丝</span>
                                                </div>
                                                <div class="item-meta-content">
                                                    <ul>
                                                        <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                        <li class="f-thide">关注了您</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="item-active">
                                                <ul>
                                                    <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                                </ul>
                                            </div>
                                        </li>
                                    {% endif %}
                            {% endif %}
                        <!-- 私信 -->
                        {% elseif notify.type == 3 %}
                            {% if notify.targetType == 'letter' %}
                                <!-- 用户普通私信 -->
                                {% if notify.action == 'normal' %}
                                    <li class="notyfy-item">
                                        <div class="item-meta">
                                            <div class="item-meta-avatar">
                                                <span class="item-type c-sx">私信</span>
                                                <img src="{{ notify.sender.avatar }}" width="25" height="25" />
                                            </div>
                                            <div class="item-meta-content">
                                                <ul>
                                                    <li class="title"><a target="_blank" href="/personal/{{ notify.sender._id.toString() }}" class="sender">{{ notify.sender.name }}</a></li>
                                                    <li class="f-thide">发来了私信&nbsp;&nbsp;</li>
                                                    <li class="f-content">{{ notify.content }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="item-active">
                                            <ul>
                                                <li data-uid="{{ notify.sender._id.toString() }}" data-name="{{ notify.sender.name }}" class="sa_actions" data-method="letter">发送私信</li>
                                                <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                            </ul>
                                        </div>
                                    </li>
                                {% endif %}
                            {% elseif notify.targetType == 'admin' %}
                                <!-- 管理员普通私信 -->
                                {% if notify.action == 'normal' %}
                                    <li class="notyfy-item">
                                        <div class="item-meta">
                                            <div class="item-meta-avatar">
                                                <span class="item-type c-gx">管信</span>
                                                <img src="/image/adm-tb.png" width="25" height="25" />
                                            </div>
                                            <div class="item-meta-content">
                                                <ul>
                                                    <li class="title"><a class="sender">北门管理员</a></li>
                                                    <li class="f-thide">发来了私信&nbsp;&nbsp;</li>
                                                    <li class="f-content">{{ notify.content }}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="item-active">
                                            <ul>
                                                <li class="sa_actions" data-method="deleteNotify" data-id="{{ notify._id.toString() }}" >删除</li>
                                            </ul>
                                        </div>
                                    </li>
                                {% endif %}
                            {% endif %}
                        {% endif %}
                    {% endfor %}
                </ul>
            </div> 
            {% if current.total > current.pageSize %}
                <div id="page" class="creply-box" style="text-align: center;"></div>
            {% endif %}      
        </div>  
    </div>
</body>

<script>
layui.use(['layer','element','laypage'], function(){ 
    var $ = layui.jquery, layer = layui.layer, laypage = layui.laypage; 
    var sid = $('#user-info').data('id');
    var access_token = $('#access_token').data('token')
    var access_aud = $('#access_token').data('aud')
    //触发事件
    var active = {
        letter: function(dom){
            var that = this; 
            var uid = $(dom).data('uid');
            var name = $(dom).data('name');
            layer.open({
                type: 1 
                ,fixed :false
                ,scrollbar :false
                ,title:'@' + name + '&nbsp;回复评论'
                ,area: ['390px', '400px']
                ,shade: 0.8
                ,id: 'letter-box'
                ,content: '<textarea class="letter" ></textarea >'
                ,btn: ['发送私信', '关闭'] 
                ,yes: function(index, layero){
                    var letter_content = $('#letter-box textarea').val();
                    if(letter_content && sid && uid && sid != uid){
                        $.ajax('/v1/notify/userPrivateLetter', {
                            type: 'POST',
                            data: { sid ,uid ,content :letter_content }, 
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
                    }else{
                        layer.msg('私信发送失败',{time :1000});
                    }
                }
            });
        },
        replyComment :function(dom){
            var that = this; 
            var uid = $(dom).data('uid');
            var did = $(dom).data('did');
            var cid = $(dom).data('cid');
            var rid = $(dom).data('rid');
            var name = $(dom).data('name');
            layer.open({
                type: 1 
                ,fixed :false
                ,scrollbar :false
                ,title:'@' + name + '&nbsp;回复'
                ,area: ['390px', '400px']
                ,shade: 0.8
                ,id: 'letter-box'
                ,content: '<textarea class="letter" ></textarea >'
                ,btn: ['回复', '关闭'] 
                ,yes: function(index, layero){
                    var content = $('#letter-box textarea').val();
                    if(content && sid && uid && did && cid && sid != uid){
                        $.ajax('/v1/comment_reply/send', {
                            type: 'POST',
                            data: { 
                                cid, did, content,
                                rt : rid ? 1 : 0,   
                                rid : rid || cid,        
                                from_uid :sid, 
                                to_uid : uid
                            }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    layer.msg('回复成功',{time :1000});
                                    layer.close(index)
                                }else{
                                    layer.msg('回复失败',{time :1000});
                                }
                            },
                        });
                    }else{
                        layer.msg('回复失败',{time :1000});
                    }
                }
            });
        },
        deleteNotify :function(dom){
            var that = this; 
            var id = $(dom).data('id');
            layer.open({
                type: 1 
                ,fixed :false
                ,scrollbar :false
                ,title:'信息'
                ,area: ['260px']
                ,shade: 0.8
                ,id: 'letter-box'
                ,content: '<div style="padding: 30px; font-size:14px; line-height: 22px; font-weight: 300;">是否执行操作？</div>'
                ,btn: ['确定', '关闭'] 
                ,yes: function(index, layero){
                    $.ajax('/v1/unotify/rmi', {
                        type: 'POST',
                        data: { id }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            layer.close(index)
                            if(result.success){
                                window.location.href="/user/notify"
                            }else{
                                layer.msg('删除失败',{time :1000});
                            }
                        },
                    });
                }
            });
        }
    }
    $('.sa_actions').on('click', function(){
        var othis = $(this), method = othis.data('method');
        active[method] ? active[method].call(this, othis) : '';
    });

    var s_current = $('#s_current');
    var current_total = s_current.data('total')
    var current_page = s_current.data('page')
    var current_pageSize = s_current.data('pagesize')
    laypage.render({
        elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
        ,count: current_total //数据总数，从服务端得到
        ,limit :current_pageSize
        ,curr :current_page
        ,jump :function(obj,first){
            if(!first){
                window.location.href = '/user/notify?page=' + obj.curr;
            }
        }
    });

});
    
</script>
</html>