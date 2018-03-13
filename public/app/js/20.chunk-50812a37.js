webpackJsonp([20],{497:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),o=(n.n(r),n(747)),i=(n.n(o),n(694)),s=n(56),a=n.n(s),c=n(99),l=(n.n(c),n(607)),p=n(25),u=n(41),d=n(42),f=n(31),h=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),m=function(t){function e(e){var n=t.call(this,e)||this;return n.errorRedirect=function(){var t=setTimeout(function(){n.setState({redirectM:n.state.redirectM-1},function(){n.state.redirectM<=0?(clearTimeout(t),location.replace("#"+n.redirectURI)):n.errorRedirect()})},1e3)},n.state={redirectM:3,title:"",status:"",loading:!0},n}return h(e,t),e.prototype.componentWillMount=function(){var t=this.props.qqLogin,e=Object(i.a)(this.props.location.search),n=e.code,r=e.state;if(r&&n){var o=decodeURIComponent(r).split("#");this.redirectURI=o[0]||o[1],t(n)}else this.setState({title:"第三方登陆失败",status:"error"}),this.redirectURI="/"},e.prototype.componentWillReceiveProps=function(t){t.User.token?(this.setState({title:"第三方登陆成功",status:"success",loading:!1}),location.replace("#"+this.redirectURI)):(this.setState({title:"第三方登陆失败",status:"error",loading:!1}),this.errorRedirect())},e.prototype.render=function(){return r.createElement("div",{className:"bm_lauth"},this.state.loading?r.createElement("div",null,"正在登陆请稍等..."):r.createElement(l.a,{type:this.state.status,title:this.state.title,description:"error"===this.state.status?"第三方登陆出现错误 "+this.state.redirectM+" 秒后将跳转至登陆前页面！":"",actions:"error"===this.state.status?r.createElement("div",null,r.createElement(a.a,{type:"primary"},r.createElement(p.Link,{to:this.redirectURI},"返回")),"  ",r.createElement(a.a,null,r.createElement(p.Link,{to:"/"},"返回首页"))):""}))},e}(r.PureComponent);e.default=Object(u.b)(function(t,e){return{LoginReducer:t.LoginReducer,User:t.UserReducer}},function(t){return{qqLogin:Object(f.b)(d.f,t)}})(m)},607:function(t,e,n){"use strict";var r=n(0),o=(n.n(r),n(24)),i=n.n(o),s=n(65),a=(n.n(s),n(608)),c=(n.n(a),this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}()),l=function(t){function e(e){return t.call(this,e)||this}return c(e,t),e.prototype.componentWillMount=function(){},e.prototype.render=function(){var t={error:r.createElement(i.a,{className:"error",type:"close-circle"}),success:r.createElement(i.a,{className:"success",type:"check-circle"})};return r.createElement("div",{className:"result"},r.createElement("div",{className:"icon"},t[this.props.type]),r.createElement("div",{className:"title"},this.props.title),this.props.description&&r.createElement("div",{className:"description"},this.props.description),this.props.children&&r.createElement("div",{className:"extra"},this.props.children),this.props.actions&&r.createElement("div",{className:"actions"},this.props.actions))},e}(r.Component);e.a=l},608:function(t,e,n){var r=n(609);"string"==typeof r&&(r=[[t.i,r,""]]);var o={};o.transform=void 0;n(12)(r,o);r.locals&&(t.exports=r.locals)},609:function(t,e,n){e=t.exports=n(11)(void 0),e.push([t.i,"/* stylelint-disable at-rule-empty-line-before,at-rule-name-space-after,at-rule-no-unknown */\n/* stylelint-disable no-duplicate-selectors */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors */\n.result {\n  text-align: center;\n  width: 72%;\n  margin: 0 auto;\n}\n.result .icon {\n  font-size: 72px;\n  line-height: 72px;\n  margin-bottom: 24px;\n}\n.result .icon > .success {\n  color: #52c41a;\n}\n.result .icon > .error {\n  color: #f5222d;\n}\n.result .title {\n  font-size: 24px;\n  color: rgba(0, 0, 0, 0.85);\n  font-weight: 500;\n  line-height: 32px;\n  margin-bottom: 16px;\n}\n.result .description {\n  font-size: 14px;\n  line-height: 22px;\n  color: rgba(0, 0, 0, 0.45);\n  margin-bottom: 24px;\n}\n.result .extra {\n  background: #fafafa;\n  padding: 24px 40px;\n  border-radius: 2px;\n  text-align: left;\n}\n.result .actions {\n  margin-top: 32px;\n}\n.result .actions button:not(:last-child) {\n  margin-right: 8px;\n}\n",""])},694:function(t,e,n){"use strict";n.d(e,"a",function(){return r});var r=function(t){var e={};try{for(var n=t.split("?")[1],r=n.split("&"),o=0;o<r.length;o++){var i=r[o].split("=");e[i[0]]=i[1]}}catch(t){e={}}return e}},747:function(t,e,n){var r=n(748);"string"==typeof r&&(r=[[t.i,r,""]]);var o={};o.transform=void 0;n(12)(r,o);r.locals&&(t.exports=r.locals)},748:function(t,e,n){e=t.exports=n(11)(void 0),e.push([t.i,".bm_lauth {\n  text-align: center;\n  width: 72%;\n  margin: 0 auto;\n}\n",""])}});