webpackJsonp([23],{508:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t(0),o=(t.n(i),t(56)),a=t.n(o),c=t(99),r=(t.n(c),t(834)),l=(t.n(r),this&&this.__extends||function(){var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,e){n.__proto__=e}||function(n,e){for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t])};return function(e,t){function i(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}}()),p=t(836),s=function(n){function e(){return null!==n&&n.apply(this,arguments)||this}return l(e,n),e.prototype.render=function(){return i.createElement("div",{className:"exception",style:{minHeight:500,height:"80%"}},i.createElement("div",{className:"imgBlock"},i.createElement("div",{className:"imgEle",style:{backgroundImage:"url("+p+")"}})),i.createElement("div",{className:"content"},i.createElement("h1",null,"404"),i.createElement("div",{className:"desc"},"抱歉，你访问的页面不存在"),i.createElement("div",{className:"actions"},i.createElement(a.a,{type:"primary"},"返回首页"))))},e}(i.Component);e.default=s},834:function(n,e,t){var i=t(835);"string"==typeof i&&(i=[[n.i,i,""]]);var o={};o.transform=void 0;t(12)(i,o);i.locals&&(n.exports=i.locals)},835:function(n,e,t){e=n.exports=t(11)(void 0),e.push([n.i,'/* stylelint-disable at-rule-empty-line-before,at-rule-name-space-after,at-rule-no-unknown */\n/* stylelint-disable no-duplicate-selectors */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors */\n/* stylelint-disable declaration-bang-space-before,no-duplicate-selectors */\n.exception {\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n.exception .imgBlock {\n  flex: 0 0 62.5%;\n  width: 62.5%;\n  padding-right: 152px;\n  zoom: 1;\n}\n.exception .imgBlock:before,\n.exception .imgBlock:after {\n  content: " ";\n  display: table;\n}\n.exception .imgBlock:after {\n  clear: both;\n  visibility: hidden;\n  font-size: 0;\n  height: 0;\n}\n.exception .imgEle {\n  height: 360px;\n  width: 100%;\n  max-width: 430px;\n  float: right;\n  background-repeat: no-repeat;\n  background-position: 50% 50%;\n  background-size: 100% 100%;\n}\n.exception .content {\n  flex: auto;\n}\n.exception .content h1 {\n  color: #434e59;\n  font-size: 72px;\n  font-weight: 600;\n  line-height: 72px;\n  margin-bottom: 24px;\n}\n.exception .content .desc {\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 20px;\n  line-height: 28px;\n  margin-bottom: 16px;\n}\n.exception .content .actions button:not(:last-child) {\n  margin-right: 8px;\n}\n@media screen and (max-width: 1200px) {\n  .exception .imgBlock {\n    padding-right: 88px;\n  }\n}\n@media screen and (max-width: 576px) {\n  .exception {\n    display: block;\n    text-align: center;\n  }\n  .exception .imgBlock {\n    padding-right: 0;\n    margin: 0 auto 24px;\n  }\n}\n@media screen and (max-width: 480px) {\n  .exception .imgBlock {\n    margin-bottom: -24px;\n    overflow: hidden;\n  }\n}\n',""])},836:function(n,e,t){n.exports=t.p+"public/exception-77e.svg"}});