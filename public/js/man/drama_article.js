layui.use(['element','layer','laypage'], function(){
    var replyPagDom = [];
    var bug = false;
    var laypage = layui.laypage;
    var $ = layui.jquery, layer = layui.layer ,element =layui.element; 
    var dramaID = $('#dramaID').data('id');
    var uid = $('#dramaID').data('uid');
    var drama_createAt = $('#dramaID').data('createat');
    var authoid = $('#dramaID').data('authoid');
    var access_token = $('#access_token').data('token');
    var user_id = $('#access_token').data('aud');
    var user_avatar = $('#access_token').data('avatar');
    var user_name = $('#access_token').data('name');
    var commentList = { };
    
    function replyComment () {
        $.get('/v1/comment/fd', { id: drama_id, page },function(result){
            result.data.forEach(function(comment,index){
                $('#comment-list').append(addDOMComment(comment,index))
            })
        });
    }


    function addDOMComment(comment,index) {
        let userFace = $(`<div class="user-face"><a target="_blank" href="/personal/${comment.user_id._id.toString()}" ><img src="${comment.user_id.avatar || '' }" alt=""> </a></div>`);
        let con = document.createElement("div");
        $(con).addClass('con no-border');
        let user=$(`<div class="user"><a target="_blank" href="/personal/${comment.user_id._id.toString()}" class="name vip-red-name">${comment.user_id.name  }</a></div>`)
        let content = $(`<p class="text">${comment.content}</p>`);
        let info = $('<div class="info"></div>')
        .append(`<span class="floor">${comment.user_id.name  }</span>`)
        .append(`<span class="plad"><a href="#" target="_blank"></a></span>`)
        .append(`<span class="time">${new Date(comment.create_at).toLocaleDateString()}</span>`)
        let reply = document.createElement("span");
        if(uid.toString() != comment.user_id._id.toString()){
            
            $(reply).addClass('reply btn-hover')
            $(reply).html('回复');
            $(reply).on('click', function(){
                var _this = $(this);
                if(uid){
                    if(_this.html() == "回复"){
                        _this.parent().parent().find('> .reply-actions').addClass('show')
                        _this.html('收回')
                    }else{
                        _this.parent().parent().find('> .reply-actions').removeClass('show')
                        _this.html('回复')
                    }
                }else{
                    window.location.href = '/login'
                }
            });
            info.append(reply)
        }


        // 评论框
        let replyActions_box = $(`<div class="reply-actions"></div>`)
        let input = $('<input type="text" name="" placeholder="写下您的评论..." autocomplete="off" class="layui-input">')
        let c_btn = $(`<button class="layui-btn layui-btn-normal sendComment" data-to_uid="${comment.user_id._id.toString()}" data-to_uid_name="${comment.user_id.name }" data-rid="${comment._id.toString()}">评论</button>`)
        $(c_btn).on('click', function(){
            const content = $(input).val();
            const to_uid = $(this).data('to_uid');
            const rid = $(this).data('rid');
            const to_uid_name = $(this).data('to_uid_name')
            if(content){
                sendReplyComment(rid,content,rid,to_uid,0,to_uid_name,index,function(result){
                    if(result.success){
                        $(reply).parent().parent().find('> .reply-actions').removeClass('show')
                        $(reply).html('回复')
                        layer.msg('评论成功',{
                            icon : 1,
                            time :2000,
                            offset :'100px'
                        });
                    }else{
                        layer.msg('评论失败',{
                            icon :5,
                            time :2000,
                            offset :'100px'
                        });
                    }
                })
            }else{
                layer.msg('评论内容不能为空',{
                        icon : 5,
                        time :2000,
                        offset :'100px'
                });
            }
            
        });
        let pageing_box = $(`<div id="paging-box" class="creply-box"><div>`);
        let replyPagination = comment.replys.data.pagination;
        let replyPag = {
            comment_id : comment._id.toString(),
            elem : pageing_box,
            count : replyPagination.total || 0,
            limit : replyPagination.size || 10,
            curr : replyPagination.current || 1,
        }
        replyPagDom.push(replyPag)
        let reply_box = addDOMReplyComment(comment.replys,index)
        replyActions_box.append(input).append(c_btn);
        $(con).append(user).append(content).append(info).append(replyActions_box).append(reply_box).append(pageing_box)   
        let commentItem = document.createElement("div");
        $(commentItem).addClass('reply-wrap list-item');
        $(commentItem).append(userFace).append(con)
        return commentItem;
    }


    function addDOMReplyComment(replys,index){
        let reply_box = $('<div class="reply-box"></div>')
        if(replys.data.list.length > 0){
            replys.data.list.forEach((reply) => {
                let reply_item = $('<div class="reply-item reply-wrap"></div>')
                let reply_avatar = $(`<a target="_blank" href="/personal/${reply.from_uid._id.toString()}" class="reply-face">  <img src="${reply.from_uid.avatar}" alt=""></a>`)
                let reply_con = $('<div class="reply-con"></div>')
                let reply_con_user;
                if(reply.reply_type == 1){
                    if(reply.from_uid._id == authoid){
                        reply_con_user = $(`<div class="user"><a target="_blank" href="/personal/${reply.from_uid._id.toString()}" target="_blank"  class="top">&nbsp;${reply.from_uid.name}</a><a href="#" target="_blank"></a><span class="text-con">回复 <a href="#" target="_blank">@${reply.to_uid.name} </a> ${reply.content}</span></div>`)
                    }else{
                        reply_con_user = $(`<div class="user"><a target="_blank" href="/personal/${reply.from_uid._id.toString()}" href="#" target="_blank"  class="name">&nbsp;${reply.from_uid.name}</a><a href="#" target="_blank"></a><span class="text-con">回复 <a href="#" target="_blank">@${reply.to_uid.name} </a> ${reply.content}</span></div>`)
                    }
                    
                }else{
                    if(reply.from_uid._id == authoid){
                        reply_con_user = $(`<div class="user"><a target="_blank" href="/personal/${reply.from_uid._id.toString()}" class="top">&nbsp;${reply.from_uid.name}</a><span class="text-con">${reply.content}</span></div>`)
                    }else{
                        reply_con_user = $(`<div class="user"><a target="_blank" href="/personal/${reply.from_uid._id.toString()}" class="name">&nbsp;${reply.from_uid.name}</a><span class="text-con">${reply.content}</span></div>`)
                    }
                }
                
                let reply_con_info = reply.from_uid._id == authoid ? $(`<div class="info">作者回复&nbsp;&nbsp;</div>`) : $(`<div class="info"></div>`) ;
                let reply_con_info_time = $(`<span class="time">${new Date(reply.create_at).toLocaleDateString()}</span>`)
                let reply_con_info_btn = $(`<span></span>`)
                if(uid.toString() != reply.from_uid._id.toString()){
                    reply_con_info_btn = $(`<span class="reply btn-hover">回复</span>`)
                    $(reply_con_info_btn).on('click', function(){
                        var _this = $(this);
                        if(uid){
                            if(_this.html() == "回复"){
                                _this.parent().parent().find('> .reply-actions').addClass('show')
                                _this.html('收回')
                            }else{
                                _this.parent().parent().find('> .reply-actions').removeClass('show')
                                _this.html('回复')
                            }
                        }else{
                            window.location.href = '/login'
                        }
                    });
                }

                let replyActions_box = $(`<div class="reply-actions"></div>`)
                let input = $('<input type="text" name="" placeholder="写下您的评论..." autocomplete="off" class="layui-input">')
                let c_btn = $(`<button class="layui-btn layui-btn-normal sendComment" data-cid="${reply.comment_id.toString()}" data-to_uid_name="${reply.from_uid.name }" data-to_uid="${reply.from_uid._id.toString()}" data-rid="${reply._id.toString()}">评论</button>`)
                $(c_btn).on('click', function(){
                    const content = $(input).val();
                    const to_uid = $(this).data('to_uid');
                    const rid = $(this).data('rid');
                    const cid = $(this).data('cid');
                    const to_uid_name = $(this).data('to_uid_name')
                    if(content){
                        sendReplyComment(cid,content,rid,to_uid,1,to_uid_name,index,function(result){
                            if(result.success){
                                reply_con_info_btn.parent().parent().find('> .reply-actions').removeClass('show')
                                reply_con_info_btn.html('回复')
                                layer.msg('评论成功',{
                                    icon : 1,
                                    time :2000,
                                    offset :'100px'
                                });
                            }else{
                                layer.msg('评论失败',{
                                    icon :5,
                                    time :2000,
                                    offset :'100px'
                                });
                            }
                        })
                    }else{
                        layer.msg('评论内容不能为空',{
                                icon : 5,
                                time :2000,
                                offset :'100px'
                        });
                    }
                    
                });
                
                replyActions_box.append(input).append(c_btn);
                reply_con_info.append(reply_con_info_time).append(reply_con_info_btn);
                reply_con.append(reply_con_user).append(reply_con_info).append(replyActions_box);
                reply_item.append(reply_avatar).append(reply_con);
                reply_box.append(reply_item)
            })
        }
        return reply_box;
    }

    function getComment(drama_id, page) {
        $('#comment-list').html('');
        if(commentList.success && !drama_id && !page){
            commentList.data.list.forEach(function(comment,index){
                $('#comment-list').append(addDOMComment(comment,index))
            });
        }else{
            $.get('/v1/comment/fd', { id: drama_id, page },function(result){
                if(result.data.list.length > 0) {
                    commentList = result;
                    laypage.render({
                        elem: 'comment-page'
                        ,count: result.data.pagination.total // 数据总数
                        ,limit :result.data.pagination.size
                        ,curr :result.data.pagination.current
                        ,theme :'#00a1d6'
                        ,layout :["page","next"]
                        ,jump :function(obj,first){
                            if(!first){
                                getComment(dramaID,obj.curr);
                            }
                        }
                    });
                    result.data.list.forEach(function(comment,index){
                        $('#comment-list').append(addDOMComment(comment,index))
                    });
                    replyPagDom.forEach(function(replyPag){
                        laypage.render({
                                elem: replyPag.elem
                                ,count: replyPag.count //数据总数
                                ,limit :replyPag.limit
                                ,curr  :replyPag.curr
                                ,layout : replyPag.count > 0 ? ["count","page","next"] :[]
                                ,jump :function(obj,first){
                                    if(!first){
                                        $.get('/v1/comment_reply/fd', {  
                                            cid :replyPag.comment_id,
                                            page : obj.curr 
                                        },function(result){
                                            let reply_box =  addDOMReplyComment({ data :result.data })
                                            replyPag.elem.parent().find('.reply-box').html('').append(reply_box)
                                        });
                                    }
                                }
                        });
                    })
                }else{
                    $('#comment-list').append('<div class="no-more-reply">没有更多信息<br/><img src="/image/no-commit.png" /></div>')
                }
            });
        }
    }

    

    function sendReplyComment(cid,content,rid,to_uid,rt,to_uid_name,index,callback){
        $.ajax('/v1/comment_reply/send', {
            type: 'POST',
            data: { 
                cid,    
                did :dramaID,
                rt : rt || 0,   
                content,
                rid,        
                from_uid :uid, 
                to_uid,
                create_at : drama_createAt 
            }, 
            headers: { authorization: access_token ,aud: uid },
            success: function(result){
                var newList = commentList.data.list;
                var newItem = commentList.data.list[index]
                console.log(newItem,index)
                console.log(result)
                console.log(commentList)
                var newReplyList = {
                    data : { 
                        list : newItem.replys.data.list || [],
                        pagination :newItem.replys.data.pagination
                    }
                };
                if(result.success){
                    var newReply = result.data;
                    newReplyList.data.list.unshift(Object.assign(newReply,{
                        to_uid : {
                            _id : to_uid,
                            name :to_uid_name
                        },
                        from_uid :{
                            _id : user_id,
                            name :user_name,
                            avatar :user_avatar
                        }
                    }))
                    newList[index].replys = newReplyList;
                    commentList = Object.assign(commentList,{
                        data : { list : newList }
                    })
                    getComment()
                    console.log(newReplyList)
                    
                }
                console.log(commentList,result)
                callback(result)
            },
        });
    }

    $('#commentdra_btn').click(function(){
        const content = $('#commentdra_ipt').val();
        if(content){
            $.ajax('/v1/comment/ct', {
                type: 'POST',
                data: { did :dramaID ,content ,uid :uid ,create_at :drama_createAt }, 
                headers: { authorization: access_token ,aud: uid },
                success: function(result){
                    if(result.success){
                        if(user_id && user_avatar && user_name){
                            var newComment = result.data;
                            newComment = Object.assign(newComment , {
                                user_id : {
                                    _id : user_id,
                                    avatar : user_avatar,
                                    name :user_name
                                },
                                replys :{ data : { list : [] ,pagination:{} }}
                            })
                            var newList = commentList.data.list || [];
                            newList.unshift(newComment);
                            newList.pop();
                            commentList = Object.assign(commentList ,{
                                data : { list : newList }
                            })
                            getComment()
                        }
                        $('#commentdra_ipt').val('');
                        layer.msg('评论成功',{
                                icon : 1,
                                time :2000,
                                offset :'100px'
                        });
                    }else{
                        layer.msg('评论失败',{
                                icon : 5,
                                time :2000,
                                offset :'100px'
                        });
                    }
                },
            });
        }else{
            layer.msg('评论内容不能为空',{
                    icon : 5,
                    time :2000,
                    offset :'100px'
            });
        }
    })

    var fix = $('#my-tab-title');                      //滚动悬浮块
        var fixTop = fix.offset().top,              //滚动悬浮块与顶部的距离
            fixLeft = fix.offset().left, 
            fixHeight = fix.height();              //滚动悬浮块高度
        var endTop, miss;                           //结束元素与顶部的距离
    $(window).scroll(function() {
        //页面与顶部高度
        var docTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        if (fixTop < docTop) {
            fix.css({'position': 'fixed' ,'border-bottom' : '1px solid #f5f5f5',top: 0 ,'margin-top':0,'left' :fixLeft,'background':'#f6f6f6' ,color:'#fff','z-index':'999'});
        } else {
            fix.css({'position': 'static' ,'border-bottom' : 'none','margin-top':'10px','background':'#fff','color':'#000'});
        }
    })

    if(uid && dramaID){
        $.get('/v1/dlike/is', {  
            uid :uid,
            did : dramaID
        },function(result){
            if(result.success){
                if(result.data){
                    $('#collect').removeClass('layui-btn-normal').addClass('layui-btn-danger').html('取消收藏').attr('data-state','2')
                }else{
                    $('#collect').attr('data-state','1')
                }
            }
        });
    }

    $('#collect').click(function(){
        var state = $(this).attr('data-state');
        if(state == 1 || state == "1"){
            $.ajax('/v1/dlike/collect', {
                type: 'POST',
                data: { uid ,did :dramaID }, 
                headers: { authorization: access_token ,aud: uid },
                success: function(result){
                    if(result.success){
                        $('#collect').removeClass('layui-btn-normal').addClass('layui-btn-danger').html('取消收藏').attr('data-state','2')
                        layer.msg('收藏成功',{
                            time :1000,
                        });
                    }else{
                        layer.msg(result.msg,{
                            time :1000,
                        });
                    }
                },
            });
        }else if(state == 2 || state == "2"){
            $.ajax('/v1/dlike/collect', {
                type: 'POST',
                data: { uid ,did :dramaID }, 
                headers: { authorization: access_token ,aud: uid },
                success: function(result){
                    if(result.success){
                        $('#collect').removeClass('layui-btn-danger').addClass('layui-btn-normal').html('加入收藏').attr('data-state','1')
                        layer.msg('取消了收藏',{
                            time :1000,
                        });
                    }else{
                        layer.msg(result.msg,{
                            time :1000,
                        });
                    }
                },
            });
        }else{
            window.location.href='/login';
        }
    })

    
    var layid = location.hash.replace(/^#dramaArticleTabs=/, '');
    element.tabChange('dramaArticleTabs', layid); 
    if(layid == 'comment'){
        getComment(dramaID,1);
    }
    element.on('tab(dramaArticleTabs)', function(){
        var lay_id = this.getAttribute('lay-id');
        if(lay_id == 'comment'){
            getComment(dramaID,1);
        }
        location.hash = 'dramaArticleTabs='+ lay_id;
    });




    var active = {
        thumbsUp: function(dom){
            if(!bug){
                bug = true;
                var did = $(dom).data('did');
                var createAt = $(dom).data('date');
                var sid = $(dom).data('sid');
                $.ajax('/v1/like/drama/thumbsUp', {
                        type: 'POST',
                        data: { did ,createAt ,sid }, 
                        headers: { authorization: access_token ,aud: user_id },
                        success: function(result){
                            if(result.success){
                                $(dom).css({ background :'#EA6055' ,color :'#FFF'})
                                $(dom).data('method','not')
                                var goodcount = parseInt($(dom).find('span').first().text());
                                $(dom).find('span').first().text(goodcount+1)
                            }
                        },
                        complete:function(){
                            bug = false;
                        }
                });
            }
        }
    };

    $('.active').on('click', function(){
        var othis = $(this), method = othis.data('method');
        active[method] ? active[method].call(this, othis) : '';
    });



});