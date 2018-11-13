
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style-user.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<script src="/js/layui.js" charset="utf-8"></script>   

<label id="user-info" data-id="{{ User._id.toString() }}" ></label>
<label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
<form style="padding:20px;" class="layui-form">
    <div class="layui-form-item">
        <label class="layui-form-label">旧邮箱</label>
        <div class="layui-input-block" style="display:none;">
            <input name="oemail" required class="layui-input" value="{{ userAuth.identity.email.identifier }}">
        </div>
        <div class="layui-form-mid layui-word-aux">{{ userAuth.identity.email.identifier }}</div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">新邮箱</label>
        <div class="layui-input-block">
        <input name="email"  required lay-verify="required|email|nemail" placeholder="新邮箱" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">新邮箱code</label>
        <div class="layui-input-inline">
            <input name="npac" required lay-verify="required|code" placeholder="新邮箱验证码" autocomplete="off" class="layui-input">
        </div>
        <div class="">
            <div class="layui-btn layui-btn-normal sendCode"><i class="layui-icon layui-icon-vercode"></i>   发送验证码</div>
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">旧邮箱code</label>
        <div class="layui-input-inline">
            <input name="opac" required lay-verify="required|code" placeholder="旧邮箱验证码" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <div class="layui-input-block">
            <button id="submit-email" class="layui-btn layui-btn-normal" lay-submit lay-filter="formDemo">立即提交</button>
        </div>
    </div>
</form>


<script>
    layui.use(['layer','form'], function(){ 
        var $ = layui.jquery;
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var user_id = $('#user-info').data('id');
        var form = layui.form
        var iscx = true;
        var len = 60;
        $(".sendCode").on("click",function(dom){
            var email = $('.layui-form input[name=email]').val()
            var email_reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
            if($('input[name=oemail]').val() == $('input[name=email]').val()){
                layer.msg('新邮箱不许与旧邮箱一致',{
                    icon :5,
                    time :1000,
                    anim: 6
                });
            }else if(email_reg.test(email)){
                var that = this;
                $(that).addClass("layui-btn-disabled");
                if (iscx) {
                    $.ajax('/v1/us/upemailpac', {
                        type: 'POST',
                        data: {  uid :user_id ,email }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
                                layer.msg('验证码已发送',{
                                    icon :1,
                                    time :1000,
                                    anim: 6
                                });
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
                                layer.msg(result.msg,{
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
            nemail: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(value == $('input[name=oemail]').val()){
                    return '新邮箱不许与旧邮箱一致';
                }
            },
            code: [
                /^[\S]{6}$/
                ,'验证码必须是6位，且不能出现空格'
            ] 
        });   
        form.on('submit', function(data){
            $('#submit-email').addClass("layui-btn-disabled");
            var email = data.field.email
            var npac = data.field.npac
            var opac = data.field.opac
            $.ajax('/v1/us/upemail', {
                type: 'POST',
                data: {  uid :user_id ,email ,npac ,opac }, 
                headers: { authorization: access_token ,aud: access_aud },
                success: function(result){
                    if(result.success){
                        var index = parent.layer.getFrameIndex(window.name); 
                        parent.layer.close(index);
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