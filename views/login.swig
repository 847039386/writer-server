<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="/css/layui.css" rel="stylesheet" type="text/css" />
    <meta name="keywords" content="关键词,5个左右,单个8汉字以内"> 
    <meta name="description" content="网站描述，字数尽量空制在80个汉字，160个字符以内！"> 
    <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
    <link href="/css/bm-main.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
    <script src="/js/layui.js"></script>
    <title>北门中文网 - 一个编剧汇集的平台</title>
</head>
<style>
    *{ margin: 0; list-style: none; padding: 0;}
    ._body{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;height:100vh;overflow:auto;background:#f0f2f5;font-family: "Chinese Quote",-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";}
    .login_warp{ padding: 32px 0; -ms-flex: 1 1;flex: 1 1; }
    .logo_warp{text-align: center;}
    .login_warp .header { height: 44px;line-height: 44px;text-align: center; }
    .login_warp .header .logo{height: 44px; vertical-align: top;margin-right: 16px;  }
    .login_warp .header .title{font-size: 33px; font-weight: 600;position: relative;top: 2px; color: rgba(0,0,0,.85);}
    .login_warp .desc {font-size: 14px; color: rgba(0,0,0,.45);margin-top: 12px;margin-bottom: 40px;text-align: center; }
    .main{width: 368px; margin: 0 auto; }
    .main .main_list li{ margin-bottom: 24px; position: relative; }
    .main .main_list li i{ position: absolute; left: 12px;top: 14px;color: rgba(0,0,0,.25);}
    .main .alert{padding: 8px 15px 8px 37px;border: 1px solid #ffa39e; background-color: #fff1f0;border-radius: 4px;color: rgba(0,0,0,.65);}
    .main .other{color: rgba(0,0,0,.65); text-align: center;}
    .main .other i{ color: rgba(0,0,0,.2); margin: 0 5px; cursor: pointer; }
    .main .other i.qq:hover{ color: rgb(83, 141, 203); }
    .main .other i.wx:hover{ color: rgb(15, 207, 26); }
    input{height: 40px; font-size: 16px; padding-left: 34px; padding-bottom: 6px; padding-top: 6px; width: 100%; box-sizing: border-box; border: 1px solid #d9d9d9;border-radius: 4px;}
    button{ color: #fff; background-color: #1890ff;border-color: #1890ff;width: 100%;padding: 0 15px;font-size: 16px;border-radius: 4px;height: 40px;font-weight: 400;outline: none;font-family: inherit;border: 1px solid transparent;cursor: pointer;}
    button:active {color: #fff;background-color: #096dd9;border-color: #096dd9;}
    @media (min-width: 768px){.login_warp {padding: 112px 0 24px;}}
</style>
<body>
    <div class="_body">
        <div class="login_warp">
            <div class="header">
                <a href="/">
                    <img class="logo" src="/image/logo200.png" alt="">
                    <span class="title">北门中文网</span>
                </a>
            </div>
            <div class="desc">北门中文网，剧本交流平台，编剧社区。</div>
            <div class="main">
                <ul class="main_list">
                    <li id="err_msg"></li>
                    <li><i class="fa fa-user-o" aria-hidden="true"></i> <input placeholder="用户名" name="uname" type="text" /></li>
                    <li><i class="fa fa-lock" aria-hidden="true"></i><input placeholder="密码" name="pass" type="password" /></li>
                    <li><button class="active" data-method="login">登&nbsp;陆</button></li>
                </ul>
                <div class="other">
                    <p class="horizontal-divider"><span style="font-size:14px;color:rgba(0,0,0,.65)">第三方登陆</span></p>
                    <span><a href="{{ qq.href }}"><i class="fa fa-qq fa-2x qq" aria-hidden="true"></i></a></span>
                    <span><a href="{{ wx.href }}"><i class="fa fa-weixin fa-2x wx" aria-hidden="true"></i></a></span>
                </div>
                <a href="/register" style="float:right;color: #1890ff;">注册账号</a>
            </div>
        </div>
    </div>
</body>
<script>
    var bug = false;
    layui.use(['element','layer'], function(){
        var $ = layui.jquery;
        var layer = layui.layer;
        var active = {
            login : function(){
                var uname = $("input[name='uname']").val();
                var pass = $("input[name='pass']").val();
                if(!bug && uname && pass){
                    bug = true;
                    $.ajax('/v1/us/hlg', {
                        type: 'POST',
                        data: { uname ,pass }, 
                        success: function(result){
                            if(result.success){
                                window.location.href = result.referer;
                            }else{
                                $('#err_msg').html('<div class="alert"><i class="fa fa-times" style="top:13px;color:#f5222d;" aria-hidden="true"></i><span>登陆失败，原因可能是：'+result.msg+'</span></div>')
                            }
                        },
                        complete:function(){
                            bug = false;
                        }
                    });
                }
            }
        } 
        $('.main .active').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
    
</script>
</html>