<header>
        {% if hotCategory %}
        <div class="bm-header">
        {% endif %}
                <div class="bm-lheader">
                        <div class="layui-main">
                                <a class="logo" href="/">
                                <img src="/image/logo.png" alt="layui">
                                </a>
                                <ul class="layui-nav layui-nav-l">
                                        <li class="layui-nav-item"><a href="/">首页</a></li>
                                        <li class="layui-nav-item"><a href="/dramas/1">剧本</a></li>
                                </ul>
                                <ul class="layui-nav layui-nav-r">
                                        {% if User._id %}
                                                <li class="layui-nav-item">
                                                        <a href="javascript:;"><img src="{{ User.avatar }}" class="layui-nav-img">{{ User.name }}</a>
                                                        <dl class="layui-nav-child layui-anim layui-anim-upbit">
                                                                <dd><a href="/user/dramas"><i style="font-size: 20px; color: #1E9FFF;" class="layui-icon">&#xe665;</i>&nbsp;&nbsp;管理后台</a></dd>
                                                                <dd><a href="/user/notify"><i style="font-size: 20px; color: #1E9FFF;" class="layui-icon">&#xe667;</i>&nbsp;&nbsp;消息</a></dd>
                                                                <dd><a href="/personal/{{ User._id.toString() }}"><i style="font-size: 20px; color: #1E9FFF;" class="layui-icon">&#xe68e;</i>&nbsp;&nbsp;个人主页</a></dd>
                                                                <dd><a href="/loginout"><i style="font-size: 16px; color: #1E9FFF;" class="layui-icon">&#xe64d;</i>&nbsp;&nbsp;注销</a></dd>
                                                        </dl>

                                                </li>
                                        {% else %}
                                                <li class="layui-nav-item"><a href="/login">登陆</a></li>
                                                <li class="layui-nav-item"><a href="/register">注册</a></li>
                                        {% endif %}
                                </ul>
                        
                        </div>
                </div>
                {% if hotCategory %}
                        <div class="bm-header-search">
                                <input id="search-field" style="display: inline-block;width:500px;"  type="text" name="title" required  lay-verify="required" placeholder="搜索" autocomplete="off" class="layui-input">
                                <button onclick="search_drama()" style="display: inline-block;"  class="layui-btn layui-btn-danger">搜索</button>
                                <div class="search-gjfl">
                                        {% if hotCategory.length > 10 %}
                                                {% set newHotCategory = hotCategory.slice(0,3)  %}
                                        {% else %}
                                                {% set newHotCategory = hotCategory %}
                                        {% endif %}
                                        {% for key , item in newHotCategory %} 
                                        {% if key == newHotCategory.length - 1 %}
                                                <a href="/dramasCategoryType?id={{ item._id.toString() }}&t=all">{{ item.name }}</a>
                                        {% else %} 
                                                <a href="/dramasCategoryType?id={{ item._id.toString() }}&t=all">{{ item.name }}</a> |
                                        {% endif %}
                                        {% endfor %}
                                </div>
                        </div>
                        <script>
                                
                                function search_drama(){
                                     let search_field = document.getElementById('search-field').value;
                                     if(search_field){
                                        window.location.href= '/amalist/search?field=' + search_field;
                                     }
                                }
                        </script>
                {% endif %}
        {% if hotCategory %}
        </div>
        {% endif %}
</header>