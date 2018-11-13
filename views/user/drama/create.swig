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
    <title>北门中文网 - 剧本创建</title>
</head>
    <style>
        .cur_tag {height:22px;line-height:22px;padding:0 8px;font-size:12px;display:inline-block;color:#333;border:1px solid #DDD;cursor:pointer;margin:0 5px 5px 0;}
        .cur_tag.tselected {border:1px solid #50A8FF;color:#FFF;background:#50A8FF;}
        .layui-form-switch {margin-top:0;}
        .layui-form-onswitch {background-color:#1890ff;border-color:#1890ff;}
        .layui-form-switch em {top:-1px;}
        .errorInput {color:#E55555;}
        .d-form-textarea { width: 343px;height: 150px;border: 1px solid #DDD;overflow-y: auto;padding-left: 5px;outline: none;resize: none; }
    </style>
<body>
    {% include "../../includes/header/head.swig" %}
    <label id="userid" data-id="{{ User._id.toString() }}"></label>
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
                <i class="before"><a href="#"><span>剧本创建</span></a></i>
            </div>
            <div class="udm-main-container-fast"> 
                
            </div>
            <form class="udm-drama-set layui-form">
                <ul>
                    <li>
                        <em>作品名称：</em>
                        <div class="saved">
                            <input lay-verify="title" style="border: 1px solid #DDD;width: 345px;height: 28px;padding-left: 5px;line-height: 28px;" name="title"  />
                            <div id="TitleInput-error" class="errorInput"  style="display:none;">作品名15字以内，特殊字符仅允许中文标点逗号</div>
                        </div>
                        
                    </li>
                    <li>
                        <em>剧本类型：</em>
                        <div class="saved">
                            <select lay-verify="required" name="book" lay-ignore>
                                {% for book in books %}
                                    {% if drama.book_id._id.toString() == book._id.toString() %}
                                        <option value="{{ book._id.toString() }}" selected>{{ book.name }}</option>
                                    {% else %}
                                        <option value="{{ book._id.toString() }}">{{ book.name }}</option>
                                    {% endif %}
                                {% endfor %} 
                            </select>
                            <div id="BOOK-error" class="errorInput"  style="display:none;">剧本类型不能为空</div>
                        </div>
                    </li>
                    
                    <li>
                        <em>作品标签：</em>
                        <div class="saved">
                            <div id="selected-tag-list" class="tag-box active_func" data-method="selectTag">
                                
                            </div>
                            <div id="CategoryInput-error" class="errorInput" style="display:none;">最多4个作为您的作品标签。</div>
                        </div>
                    </li>
                    <li>
                        <em>作品状态：</em>
                        <div class="saved">
                            <input type="checkbox" value="1" name="state" lay-skin="switch" lay-text="完结|连载">
                        </div>
                    </li>
                    <li>
                        <em>是否展示：</em>
                        <div class="saved">
                            <input type="checkbox" value="1" name="ustatus" checked lay-skin="switch" lay-text="开|关">
                        </div>
                    </li>
                    <li>
                        <em>作品介绍：</em>
                        <div class="saved" style="width:420px;">
                            <textarea lay-verify="description" name="description" class="d-form-textarea"></textarea>
                            <div id="DescriptionInput-error" class="errorInput" style="display:none;">作品介绍控制在20-300字.</div>
                        </div>
                    </li>
                </ul>
                <a data-method="save" lay-submit="" lay-filter="saveDrama" class="button active_func">创建</a>
            </form>
        </div>  
    </div>
</body>
<script>
    var bug = true;
    layui.use(['form','layer','element','layedit'], function(){
        var $ = layui.jquery, layer = layui.layer; 
        var userid = $('#userid').data('id');
        var access_token = $('#access_token').data('token')
        var access_aud = $('#access_token').data('aud')
        var categorys = [ ];     // 缓存使用
        var active = {
            selectTag :function(dom){
                layer.open({
                    type: 1
                    ,fixed :false
                    ,scrollbar :false
                    ,title: '信息'
                    ,shade: 0.8
                    ,area: ['500px','500px']
                    ,shadeClose :true
                    ,id: 'LAY_layuipro3' //设定一个id，防止重复弹出
                    ,btnAlign: 'r'
                    ,btn: ['确定', '取消']
                    ,moveType: 1 
                    ,content: '<div class="LAY_layuipro3" style="padding:20px;"></div>'
                    ,yes:function(index, layero){
                        var newCategorys = []
                        $('span.cur_tag.tselected').each(function(idx,tag){
                            newCategorys.push({
                                id :$(tag).data('id'),
                                name :$(tag).data('name')
                            })
                        })
                        if(newCategorys.length > 4 || newCategorys.length == 0){
                            layer.msg('剧情类型数量必须在1-4之间',{
                                time :1000,
                            });
                        }else{
                            var taglist = $('#selected-tag-list').html('');
                            newCategorys.forEach(function(tag){
                                var n_tag = $('<a></a>').addClass('active_func')
                                            .attr('data-id',tag.id)
                                            .attr('title',tag.name)
                                            .attr('href','javascript:;')
                                            .html(tag.name+'<i data-method="dcCategory" class="closeCat active_func"></i>')
                                taglist.append(n_tag)
                            })
                            layer.close(index) 
                        }
                    }
                    ,success:function(){
                        if(categorys.length > 0){
                            categorys.forEach(function(category){
                                $('.LAY_layuipro3').append('<span data-id="' + category._id.toString() +'" data-name="' + category.name + '" data-status="not" data-method="selectedTag" class="cur_tag active_func">'+ category.name +'</span>')
                            })
                        }else{
                            $.get('/v1/category/fd', { size :999 },function(result){
                                if(result.success){
                                    categorys = result.data.list;
                                    categorys.forEach(function(category){
                                        $('.LAY_layuipro3').append('<span data-id="' + category._id.toString() +'" data-name="' + category.name + '" data-status="not" data-method="selectedTag" class="cur_tag active_func">'+ category.name +'</span>')
                                    })
                                }
                            });
                        }
                        
                    }
                });
            },
            selectedTag :function(dom){
                var status = $(dom).data('status');
                if(status == "not"){
                    $(dom).addClass('tselected');
                    $(dom).data('status','select');
                }else{
                    $(dom).removeClass('tselected');
                    $(dom).data('status','not');
                }
            },
            dcCategory :function(dom){
                $(dom).parent().remove()
            },
            save :function(dom){
                // 数据
                var title = $('*[name=title]').val();
                var book = $('*[name=book]').val();
                var description = $('*[name=description]').val();
                var state = $('*[name=state]:checked').val() ? 1 : 0;
                var ustatus = $('*[name=ustatus]:checked').val() ? 0 : 1;
                var categoryTagList = $("#selected-tag-list a");
                var verification = true;
                var categoryList = [];

                // 提示信息
                var titleError = $('#TitleInput-error').css({ display :'none' })
                var descriptError = $('#DescriptionInput-error').css({ display :'none' })
                var tagError = $('#CategoryInput-error').css({ display :'none' })
                var BOOKError = $('#BOOK-error').css({ display :'none' })
                
                // 正则
                var regEC = new RegExp("[`~!@#$^&*()=|{}':;'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。、？]",'im')
                var regTitleLength = new RegExp("^.{1,15}$",'im')
                var regDescriptLength = new RegExp("^.{20,300}$",'im')

                if(!regTitleLength.test(title) || regEC.test(title)){
                    verification = false;
                    titleError.css({ display :'block' })
                }
                if(!regDescriptLength.test(description)){
                    verification = false;
                    descriptError.css({ display :'block' })
                }
                if(categoryTagList.length > 4 || categoryTagList.length < 1){
                    verification = false;
                    tagError.css({ display :'block' })
                }else{
                    categoryTagList.each(function (){
                        const cate_id = $(this).data('id')
                        categoryList.push(cate_id)
                    })
                }
                if(!book){
                    verification = false;
                    BOOKError.css({ display :'block' })
                }

                if(verification && bug){
                    bug = false;
                    $.ajax('/v1/drama/ct', {
                        type: 'POST',
                        data: {
                            title,
                            description,
                            user_id :userid,
                            book_id :book,
                            category_id :categoryList,
                            state,
                            ustatus,
                        }, 
                        headers: { authorization: access_token ,aud: access_aud },
                        success: function(result){
                            if(result.success){
                                window.location.href="/user/other?id="+result.data._id.toString();
                            }else{
                                layer.msg('创建失败',{
                                    time :1000,
                                });
                            }
                            bug = true;
                        },
                    });
                }
            }
        }
         $(document).on('click', '.active_func', function(e){
            e.stopPropagation();
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
</script>
</html>