
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style-user.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<script src="/js/layui.js" charset="utf-8"></script>   

<label id="user-info" data-id="{{ User._id.toString() }}" ></label>
<label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
<form style="padding:20px;" class="layui-form">
    <div class="layui-form-item">
        <label class="layui-form-label">用户名</label>
        <div class="layui-input-block">
        <input name="uname"  required lay-verify="required|username" placeholder="用户名一旦确定将无法更改" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">密码</label>
        <div class="layui-input-block">
            <input type="password" name="pass" required  lay-verify="required|pass" placeholder="请输入密码" autocomplete="off" class="layui-input">
        </div>
    </div>
    <div class="layui-form-item">
            <label class="layui-form-label">确认密码</label>
            <div class="layui-input-block">
                <input type="password" name="ppass" required  lay-verify="required|ppass|pass" placeholder="请确认密码" autocomplete="off" class="layui-input">
            </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">验证码</label>
        <div class="layui-input-inline">
            <input name="pac" required lay-verify="required|code" placeholder="像您的邮箱发送验证码" autocomplete="off" class="layui-input">
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
             var that = this;
                $(that).addClass("layui-btn-disabled");
                if (iscx) {
                    $.ajax('/v1/us/uidsendpac', {
                        type: 'POST',
                        data: {  uid :user_id }, 
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
                                layer.msg('验证码获取失败',{
                                    icon :5,
                                    time :1000,
                                    anim: 6
                                });
                            }
                        },
                    });
                }
        })
        form.verify({
            username: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                    return '用户名不能有特殊字符';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)){
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if(!/^[\S]{8,12}$/.test(value)){
                    return '用户名位数在8-12位';
                }
            },
            ppass: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(value != $('input[name=pass]').val()){
                    return '两次密码输入不一致';
                }
            },
            pass: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!/^[\S]{6,20}$/.test(value)){
                    return '密码位数在6-20位';
                }
            },
            code: [
                /^[\S]{6}$/
                ,'验证码必须是6位，且不能出现空格'
            ] 
        });   
        form.on('submit', function(data){
            $('#submit-email').addClass("layui-btn-disabled");
            var uname = data.field.uname
            var pac = data.field.pac
            var pass = data.field.pass
            $.ajax('/v1/us/bnduname', {
                type: 'POST',
                data: { uid :user_id,uname ,pac ,pass }, 
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