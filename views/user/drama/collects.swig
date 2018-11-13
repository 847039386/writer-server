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
    <title>北门中文网 - 我的收藏</title>
</head>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="access_token" data-aud="{{ User._id.toString() }}" data-token="{{ User.token }}"></label>
    <div class="udm-main">        
        <div class="udm-main-container-left">
            <div class="udm-menu">
                <ul>
                    <li><a href="/user/dramas">我的剧本</a></li>
                    <li class="selected"><a href="/user/collects">我的收藏</a></li>
                    <li><a href="/user/notify">我的消息</a></li>
                    <li><a href="/user/info">个人信息</a></li>
                    <li><a href="/user/safety">安全管理</a></li>
                </ul>
            </div>
        </div>
        <div class="udm-main-container-right">
            <div class="udm-main-container-breadcrumb">
                <i class="before"><a href="/booknovels/novels.html"><span>我的收藏</span></a></i>
            </div>
            <div class="udm-main-container-fast"> 
                <p class="description">当前收藏剧本总数<span class="num">{{ current.total }}</span>本</p>
            </div>
            <div class="works-list-wrap">
                 {% if current.total > 0 %}
                    <table width="100%" border="0" cellspacing="0">
                        <colgroup>
                            <col width="32px">
                            <col width="220px">
                            <col width="100px">
                            <col width="60px">
                            <col width="160px">
                        </colgroup>
                        <thead>
                        <tr>
                            <th></th>
                            <th class="tl">书名</th>
                            <th class="tl">最新章节</th>
                            <th>收藏</th>
                            <th class="center">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                            
                            {% for drama in Dramas %}
                                <tr class="">
                                    <td></td>
                                    <td class="tl">
                                        <p class="work-name">
                                            <a href="/drama?id={{ drama.drama_id._id.toString() }}" target="_blank">{{ drama.drama_id.title }}</a>
                                        </p>
                                    </td>
                                    <td class="tl">
                                        <a>无最新章节</a>
                                    </td>
                                    <td>
                                        <span>{{ drama.drama_id.count.collect || 0 }}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <button  data-method="uninstallDrama"  data-uid="{{ User._id.toString() }}" data-id='{{ drama.drama_id._id.toString() }}'  class="layui-btn layui-btn-danger layui-btn-sm updateDrama">
                                                <i class="layui-icon">&#xe64d;</i>&nbsp;取消收藏
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                    
                {% else %}
                    <div style="color: #99a2aa; text-align: center; padding: 30px 0; font-size: 12px;">没有更多信息<br/></div>
                {% endif %}
                <label id='s_current' data-total="{{ current.total  }}" data-page="{{ current.page  }}" data-pagesize="{{ current.pageSize  }}" ></label>
                {% if current.total > current.pageSize %}
                    <div id="page" style="text-align: center;"></div>
                {% endif %}
            </div>
        </div>  
    </div>
</body>
<script>
    
    layui.use(['layer','laypage','element'], function(){ 
        var $ = layui.jquery, layer = layui.layer; 
        var laypage = layui.laypage;
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        //触发事件
        var active = {
            uninstallDrama: function(dom){
                var did = $(dom).data('id');
                var uid = $(dom).data('uid');
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
                    ,content: '<div style="padding: 30px; font-size:14px; line-height: 22px; font-weight: 300;">是否执行操作？</div>'
                    ,yes:function(index, layero){
                         $.ajax('/v1/dlike/collect', {
                            type: 'POST',
                            data: { did ,uid }, 
                            headers: { authorization: access_token ,aud: access_aud },
                            success: function(result){
                                if(result.success){
                                    layer.close(index);
                                    if(result.data){
                                        $(dom).html('<i class="layui-icon">&#xe64d;</i>&nbsp;取消收藏').addClass('layui-btn-danger').removeClass('layui-btn-normal');
                                    }else{
                                        $(dom).html('<i class="layui-icon">&#xe600;</i>&nbsp;添加收藏').addClass('layui-btn-normal').removeClass('layui-btn-danger');
                                    }
                                    layer.msg(result.msg,{
                                            time :1000,
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
                });
            },
        };
        
        $('body .updateDrama').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });

        var s_current = $('#s_current');
        var current_total = s_current.data('total')
        var current_page = s_current.data('page')
        var current_pageSize = s_current.data('pagesize');
        laypage.render({
            elem: 'page' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: current_total //数据总数，从服务端得到
            ,limit :current_pageSize
            ,curr :current_page
            ,theme :'#00a1d6'
            ,jump :function(obj,first){
                if(!first){
                    window.location.href = '/user/dramas?page=' + obj.curr;
                }
            }
        });
    });
    
</script>
</html>