<html>
<head>
<meta charset="utf-8">
<meta name="renderer" content="webkit|ie-comp|ie-stand">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" /> 
<title>北门中文网 - 一个编剧汇集的平台</title>
<meta name="keywords" content="关键词,5个左右,单个8汉字以内"> 
<meta name="description" content="网站描述，字数尽量空制在80个汉字，160个字符以内！"> 
<link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
<!--[if lt IE 9]> 
<script type="text/javascript" src="Lib/html5.js"></script>
<script type="text/javascript" src="Lib/respond.min.js"></script>
<![endif]--> 
<link href="/css/layui.css" rel="stylesheet" type="text/css" />
<link href="/css/reset.css" rel="stylesheet" type="text/css" />
<link href="/css/bm-style.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<link href="/css/bm-main.css" rel="stylesheet" type="text/css" /><!--自己的样式-->
<script src="/js/layui.js"></script>
<!-- ZUI 标准版压缩后的 JavaScript 文件 -->
<!--[if IE 6]> 
<script type="text/javascript" src="Lib/DD_belatedPNG_0.0.8a-min.js" ></script>
<script>DD_belatedPNG.fix('.pngfix,.icon');</script> 
<![endif]--> 
</head> 
<style>
    .exception { width :600px; margin :50px auto; min-height:500px;}
    .exception ul li{ margin:15px 0; }
    .exception .title{ color : #848484; font-weight: bold; font-size:34px; }
    .exception .desc{ color : #969696; font-size :24px; }
    .exception .other{ color : #ABABAB; font-size :16px; }

</style>
<body style="background:#f6f6f6;">
{% include "../includes/header/head.swig" %}
<div class="bm-container ovh">
   <div class="exception">
        <ul>
            <li class="title">{{ title }}</li>
            <li class="desc">{{ desc }}</li>
            <li class="other">
                {% if other %}
                    <span>请&nbsp;<a href="/">返回首页</a>&nbsp;或&nbsp;<a href="#" onClick="javascript :history.back(-1);">返回上级</a></span>
                {% endif %}
            </li>
        </ul>
   </div>
</div>
{% include "../includes/footer/footer.swig" %}
</body>
</html>