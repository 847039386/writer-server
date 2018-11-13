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
    <title>北门中文网 - 安全管理</title>
</head>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
    <div class="udm-main">
        <div class="udm-main-container-left">
            <div class="udm-menu">
                <ul>
                    <ul>
                        <li><a href="/user/dramas">我的剧本</a></li>
                        <li><a href="/user/collects">我的收藏</a></li>
                        <li><a href="/user/notify">我的消息</a></li>
                        <li><a href="/user/info">个人信息</a></li>
                        <li class="selected"><a>安全管理</a></li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="udm-main-container-right">
            <div class="udm-main-container-breadcrumb">
                <i class="before"><a href="#"><span>安全管理</span></a></i>
            </div>
            <div class="udm-safety-list">
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-avatar">
                            <i class="layui-icon layui-icon-read" style="font-size: 30px; color: #1E9FFF;"></i> 
                        </div>
                        <div class="udm-safety-list-item-meta-content">
                            {% if safety.identity.username.identifier %}
                            <h4 class="udm-safety-list-item-meta-title">绑定站内用户名</h4>
                            <div class="udm-safety-list-item-meta-description">已绑定用户名：：{{ safety.identity.username.identifier }}</div>
                            {% else %}
                            <h4 class="udm-safety-list-item-meta-title">绑定站内用户名</h4>
                            <div class="udm-safety-list-item-meta-description">当前未绑定本站用户名</div>
                            {% endif %}
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        {% if safety.identity.username.identifier %}
                                <li data-method='changePassword' class="sa_actions" >修改</li>
                        {% else %}
                                <li data-method='bindUserName' class="sa_actions" >绑定</li>
                        {% endif %}
                        
                    </ul>
                </div>
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-avatar">
                            <i class="layui-icon layui-icon-login-qq" style="font-size: 30px; color: rgb(83, 141, 203);"></i> 
                        </div>
                        <div class="udm-safety-list-item-meta-content">
                            {% if safety.identity.qq.identifier %}
                            <h4 class="udm-safety-list-item-meta-title">QQ绑定</h4>
                            <div class="udm-safety-list-item-meta-description">已绑定QQ</div>
                            {% else %}
                            <h4 class="udm-safety-list-item-meta-title">QQ绑定</h4>
                            <div class="udm-safety-list-item-meta-description">当前未绑定QQ账号</div>
                            {% endif %}
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        {% if safety.identity.qq.identifier %}
                                <li data-method='uninstallQQ' class="sa_actions" >解绑</li>
                        {% else %}
                                <li><a href="{{ qq.href }}">绑定</a></li>
                        {% endif %}
                    </ul>
                </div>
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-avatar">
                            <i class="layui-icon layui-icon-login-wechat" style="font-size: 30px; color: rgb(15, 207, 26);"></i> 
                        </div>
                        <div class="udm-safety-list-item-meta-content">
                            {% if safety.identity.weixin.identifier %}
                            <h4 class="udm-safety-list-item-meta-title">微信绑定</h4>
                            <div class="udm-safety-list-item-meta-description">已绑定微信</div>
                            {% else %}
                            <h4 class="udm-safety-list-item-meta-title">微信绑定</h4>
                            <div class="udm-safety-list-item-meta-description">当前未绑定微信</div>
                            {% endif %}
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        {% if safety.identity.weixin.identifier %}
                                <li data-method='uninstallQQ' class="sa_actions">
                                    解绑
                                </li>
                        {% else %}
                                <li><a href="{{ wx.href }}">绑定</a></li>
                        {% endif %}
                    </ul>
                </div>
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-avatar">
                            <i class="layui-icon layui-icon-vercode" style="font-size: 30px; color: #1E9FFF;"></i> 
                        </div>
                        <div class="udm-safety-list-item-meta-content">
                            {% if safety.identity.email.identifier %}
                            <h4 class="udm-safety-list-item-meta-title">邮箱绑定</h4>
                            <div class="udm-safety-list-item-meta-description">已绑定邮箱：：{{ safety.identity.email.identifier }}</div>
                            {% else %}
                            <h4 class="udm-safety-list-item-meta-title">微信绑定</h4>
                            <div class="udm-safety-list-item-meta-description">当前未绑定微信</div>
                            {% endif %}
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        {% if safety.identity.email.identifier %}
                                <li data-method='upMail' class="sa_actions" >修改</li>
                        {% else %}
                                <li data-method='changePassword' class="sa_actions" >绑定</li>
                        {% endif %}
                    </ul>
                </div>
            </div>       
        </div>  
    </div>
</body>

<script>
    layui.use(['layer','form','element'], function(){ 
        var $ = layui.jquery, layer = layui.layer; 
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        //触发事件
        var active = {
            bindUserName: function(dom){
                var drama_id = $(dom).data('id');
                layer.open({
                    type: 2
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '绑定站内用户名' 
                    ,offset: ['150px']
                    ,area: ['650px','360px']
                    ,shade: 0.8
                    ,id: 'changePassword'
                    ,btnAlign: 'r'
                    ,moveType: 1 
                    ,content: '/user/bnduname'
                    ,end:function(){
                         window.location.href="/user/safety"
                    }
                });
            },
            upMail: function(dom){
                var drama_id = $(dom).data('id');
                layer.open({
                    type: 2
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '修改邮箱' 
                    ,offset: ['150px']
                    ,area: ['650px','360px']
                    ,shade: 0.8
                    ,id: 'changePassword'
                    ,btnAlign: 'r'
                    ,moveType: 1 
                    ,content: '/user/upumail'
                    ,end:function(){
                         window.location.href="/user/safety"
                    }
                });
            },
            changePassword: function(dom){
                var drama_id = $(dom).data('id');
                layer.open({
                    type: 2
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '修改密码' 
                    ,offset: ['150px']
                    ,area: ['650px','360px']
                    ,shade: 0.8
                    ,id: 'changePassword'
                    ,btnAlign: 'r'
                    ,moveType: 1 
                    ,content: '/user/uppass'
                    ,end:function(){
                         window.location.href="/user/safety"
                    }
                });
            },
            uninstallQQ: function(dom){
                layer.open({
                    type: 1
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '解绑QQ'
                    ,shade: 0.8
                    ,area: ['300px']
                    ,id: 'uninstallQQ' //设定一个id，防止重复弹出
                    ,btnAlign: 'r'
                    ,btn: ['确定解绑', '暂不解绑']
                    ,moveType: 1 
                    ,content: '<div style="padding: 30px; background-color: #393D49; color: #fff; font-size:14px; line-height: 22px; font-weight: 300;">是否解绑QQ？请注意解绑前绑定本站用户名，以免信息丢失。为保证操作失误请在下面输入BEIMEN(大写)进行解绑操作。<br/><br/><input type="text" name="title" required  lay-verify="required" placeholder="BEIMEN" autocomplete="off" class="layui-input"></div>'
                    ,yes:function(index, layero){
                        let code = $('#uninstallQQ input').val();
                        if(code === 'BEIMEN'){
                            layer.close(index)
                        }else{

                        }
                    }
                });
            },
        };
        $('body .sa_actions').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });

        // layui-btn-disabled
        var iscx = true;
        var len = 60;
        $(".sendCode").on("click",function(dom){
            var that = this;
            $(that).addClass("layui-btn-disabled");
            if (iscx) {
                $(that).html(len + "s");
                var time = setInterval(function() {
                    $(that).html(parseFloat($(that).html()) - 1 + "s");
                    if ($(that).html() == "0s") {
                        clearInterval(time);
                        iscx = true;
                        $(that).html("发送验证码")
                        $(that).removeClass("layui-btn-disabled");
                    }
                }, 1000);
                iscx = false;
            } else {
                
            }
        })
    });
    
</script>
</html>