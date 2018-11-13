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
    <title>北门中文网 - 绑定邮箱</title>
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
                <i class="before"><a href="#"><span id="user-info" data-id="{{ User._id.toString() }}" >邮箱绑定</span></a></i>
            </div>
            <div style="padding:30px 0; width:80%;">
                <form class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">邮箱：</label>
                        <div class="layui-input-block">
                            <input type="text" name="email"   lay-verify="required|email" placeholder="请输入邮箱" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">验证码：</label>
                        <div class="layui-input-inline">
                            <input type="password" name="code"  lay-verify="required|code" placeholder="像您的邮箱发送验证码" autocomplete="off" class="layui-input">
                        </div>
                        <div class="">
                            <div class="layui-btn layui-btn-normal sendCode"><i class="layui-icon layui-icon-vercode"></i>   发送验证码</div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                            <div class="layui-input-block">
                              <button id="submit-email" class="layui-btn layui-btn-normal" lay-submit lay-filter="formDemo">立即提交</button>
                            </div>
                    </div>
                </form>
            </div>       
        </div>  
    </div>
</body>

<script>
    layui.use(['layer','form','element'], function(){ 
        var $ = layui.jquery;
        var user_id = $('#user-info').data('id');
        var form = layui.form;
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var iscx = true;
        var len = 60;
        $(".sendCode").on("click",function(dom){
            var email = $('.layui-form input[name=email]').val()
            var email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
            if(email_reg.test(email)){
                var that = this;
                $(that).addClass("layui-btn-disabled");
                if (iscx) {
                    $.ajax('/v1/us/sendpac', {
                        type: 'POST',
                        data: { uid :user_id,email }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
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
                            }else{
                                $(that).removeClass("layui-btn-disabled");
                                layer.msg('验证码获取失败',{
                                    icon :5,
                                    time :1000,
                                    anim: 6
                                });
                            }
                        },
                    });
                }
            }else{
                layer.msg('邮箱格式不正确',{
                    icon :5,
                    time :1000,
                    anim: 6
                });
            }

            
        })

        form.verify({
            code: [
                /^[\S]{6}$/
                ,'验证码必须是6位，且不能出现空格'
            ] 
        });   
        form.on('submit', function(data){
            var email = data.field.email
            var pac = data.field.code
            $('#submit-email').addClass("layui-btn-disabled");
            $.ajax('/v1/us/bndemail', {
                type: 'POST',
                data: { uid :user_id,email ,pac }, 
                headers: { authorization: access_token ,aud: access_aud },
                success: function(result){
                    if(result.success){
                        window.location.href="/user/safety"
                    }else{
                        $('#submit-email').removeClass("layui-btn-disabled");
                        layer.msg(result.msg,{
                            icon :5,
                            time :1000,
                            anim: 6
                        });
                    }
                },
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });
</script>
</html>