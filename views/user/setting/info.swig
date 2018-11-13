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
    <title>北门中文网 - 我的信息</title>
</head>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
    {% set username = null %}
    {% set qq = null %}
    {% set weixin = null %}
    {% set email = null %}
    {% for item in safety %}
        {% if item.identity_type == 'username' %}
            {% set username = item.identifier %}
        {% elseif item.identity_type == 'qq' %}
            {% set qq = item.identifier %}
        {% elseif item.identity_type == 'weixin' %}
            {% set weixin = item.identifier %}
        {% elseif item.identity_type == 'email' %}
            {% set email = item.identifier %}
        {% endif %}
    {% endfor %}
    <div class="udm-main">
        <div class="udm-main-container-left">
            <div class="udm-menu">
                <ul>
                    <ul>
                        <li><a href="/user/dramas">我的剧本</a></li>
                        <li><a href="/user/collects">我的收藏</a></li>
                        <li><a href="/user/notify">我的消息</a></li>
                        <li class="selected"><a>个人信息</a></li>
                        <li><a href="/user/safety">安全管理</a></li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="udm-main-container-right">
            <div class="udm-main-container-breadcrumb">
                <i class="before"><a href="#"><span id="userInfo" data-id="{{ userInfo._id.toString() }}" >个人信息</span></a></i>
            </div>
            <div class="udm-safety-list" id="user_pinfo">
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-avatar">
                            <img class="item-img" id="user-avatar" src="{{ userInfo.avatar }}" width="40" height="40" alt="头像">
                        </div>
                        <div class="udm-safety-list-item-meta-content">
                            <h4 class="udm-safety-list-item-meta-title" id="user-avatar" style="height:40px;line-height:40px;">头像</h4>
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        <li data-method="updateAvatar" class="sa_actions" >修改</li>
                    </ul>
                </div>
                <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-content">
                            <h4 class="udm-safety-list-item-meta-title">昵称</h4>
                            <div class="udm-safety-list-item-meta-description" id="user-name" data-content="{{ userInfo.name }}">{{ userInfo.name }}</div>
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        <li data-method="updateName" class="sa_actions" >修改</li>
                    </ul>
                </div>
                 <div class="udm-safety-list-item">
                    <div class="udm-safety-list-item-meta">
                        <div class="udm-safety-list-item-meta-content">
                            <h4 class="udm-safety-list-item-meta-title">个人签名</h4>
                            <div class="udm-safety-list-item-meta-description" id="user-presentation" data-content="{{ userInfo.presentation }}">
                                {% if userInfo.presentation %}
                                    {{ userInfo.presentation }}
                                {% else %}
                                    暂无介绍
                                {% endif %}
                            </div>
                        </div>
                    </div>
                    <ul class="udm-safety-list-item-action">
                        <li data-method="updatePresentation" class="sa_actions" >修改</li>
                    </ul>
                </div>
            </div>       
        </div>  
    </div>
</body>

<script>
    
    layui.use(['layer','upload','form','element'], function(){ 
        var $ = layui.jquery, layer = layui.layer ,upload = layui.upload; 
        var userid = $('#userInfo').data('id');
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        //触发事件
        var active = {
            // 修改剧本信息弹出框
            updateName: function(dom){
                layer.open({
                    type: 1
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '修改昵称' 
                    ,area: ['460px']
                    ,shade: 0.65
                    ,shadeClose :true
                    ,id: 'up-name'
                    ,btnAlign: 'r'
                    ,btn: ['确定','取消']
                    ,moveType: 1 
                    ,content: '<div class="update_info_ck"><div class="_body"><ul><li>2~10个字，将显示在个人主页。编辑名称。</li></ul><input type="text" name="nickname" required  lay-verify="required" placeholder="请输入昵称" autocomplete="off" class="layui-input"></div></div>'
                    ,yes:function(index, layero){
                        var name = $('#up-name input').val();
                        $.ajax('/v1/us/utname', {
                            type: 'POST',
                            data: { id :userid ,name  }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    layer.close(index)
                                    $('#user-name').text(result.data.name);
                                    $('#user-name').data('content',result.data.name);
                                    layer.msg('修改成功',{
                                            time :2000,
                                            offset :'100px'
                                    });
                                }else{
                                    layer.msg(result.msg,{
                                            time :2000,
                                            offset :'100px'
                                    });
                                }
                            },
                        });
                    }
                    ,success: function(layero, index){
                        $('#up-name input').val($('#user-name').data('content'));
                    }
                });
            },
            updatePresentation: function(dom){
                layer.open({
                    type: 1
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '修改简介' 
                    ,area: ['460px']
                    ,shade: 0.65
                    ,shadeClose :true
                    ,id: 'up-presentation'
                    ,btnAlign: 'r'
                    ,btn: ['确定','取消']
                    ,moveType: 1 
                    ,content: '<div class="update_info_ck"><div class="_body"><ul><li>0-150个字，作为编辑的个人简介，有助于加强读者对您的了解。(￣▽￣)"。</li></ul><textarea name="nickname" placeholder="请输入个人签名" autocomplete="off" class="layui-textarea"></textarea></div></div>'
                    ,yes:function(index, layero){
                        var presentation = $('#up-presentation textarea').val();
                        $.ajax('/v1/us/presentation', {
                            type: 'POST',
                            data: { id :userid,content :presentation }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    layer.close(index)
                                    $('#user-presentation').text(result.data.presentation);
                                    $('#user-presentation').data('content',result.data.presentation);
                                    layer.msg('修改成功',{
                                            time :2000,
                                            offset :'100px'
                                    });
                                }else{
                                    layer.msg(result.msg,{
                                            time :2000,
                                            offset :'100px'
                                    });
                                }
                            },
                        });
                    }
                    ,success: function(layero, index){
                        $('#up-presentation textarea').val($('#user-presentation').data('content'));
                    }
                });
            },
            updateAvatar: function(dom){
                var user_avatar = $('#user-avatar').attr('src');
                layer.open({
                    type: 1
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '修改头像' 
                    ,area: ['460px']
                    ,shade: 0.65
                    ,shadeClose :true
                    ,id: 'updateAvatar'
                    ,btnAlign: 'r'
                    ,btn: ['上传','取消']
                    ,moveType: 1 
                    ,content: '<div class="update_info_ck"><div class="_body"><div class="avata-modal"><div class="avata-part"><img id="upload-avatar" width="100px;" height="100px;" class="item-img" src="'+user_avatar+'" alt="头像"></div><ul><li>要求清晰、健康、代表品牌形象</li><li>请勿使用二维码、政治敏感及色情图片</li><li>图片格式支持bmp，jpeg，jpg，png；200X200像素，不可大于2MB</li></ul></div></div></div>'
                    ,yes: function(index, layero){
                        return false;
                    }
                    ,success: function(layero, index){
                        upload.render({
                            elem: $(layero).find('.layui-layer-btn0')
                            ,url: '/v1/us/upload_avatar'
                            ,headers: { authorization: access_token ,aud: access_aud }
                            ,done: function(res, index, upload){ //上传后的回调
                                if(res.success){
                                    $('#upload-avatar').attr('src',res.newAvatar);
                                    $('#user-avatar').attr('src',res.newAvatar);
                                    layer.closeAll()
                                    layer.msg('上传成功',{
                                        time :2000,
                                            offset :'100px'
                                    });
                                }else{
                                    layer.msg('上传失败',{
                                        time :2000,
                                            offset :'100px'
                                    });
                                }
                            } 
                            ,accept: 'file' //允许上传的文件类型
                            ,size: 1024 //最大允许上传的文件大小
                            //,……
                        })
                    }
                });
            },
        };
        $('#user_pinfo .sa_actions').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
    
</script>
</html>