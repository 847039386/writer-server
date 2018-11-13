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
                <i class="before"><a href="/booknovels/novels.html"><span>我的剧本</span></a></i>
            </div>
            <div class="udm-main-container-fast"> 
                <p class="description">当前剧本总数<span class="num">{{ current.total }}</span>本</p>
                <a href="/user/drama/create" class="button">创建剧本</a>
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
                                            <a href="/drama?id={{ drama._id.toString() }}" target="_blank">{{ drama.title }}</a>
                                        </p>
                                    </td>
                                    <td class="tl">
                                        <a>无最新章节</a>
                                    </td>
                                    <td>
                                        <span>{{ drama.count.collect || 0 }}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <a href="/user/chapters?id={{ drama._id.toString() }}&title={{ drama.title }}" class="layui-btn layui-btn-normal layui-btn-sm">
                                                <i class="layui-icon">&#xe620;</i>&nbsp;管理
                                            </a>
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
layui.use(['layer','element','laypage'], function(){ 

});
</script>
</html>