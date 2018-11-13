const qn     = require('qn');
const path = require('path')
const fs = require('fs')
const Busboy = require('busboy')
const utility = require('utility');
const uuid = require('uuid');



function Koa2_Upload(config){
  config = config || {}
  this.uploadPath = config.uploadPath || './public/upload/common/';
  this.qn_access = config.qn_access || null;
}
//文件无则创建
Koa2_Upload.prototype.mkdirsSync = function(dirname){
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (this.mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}
//公共解析
Koa2_Upload.prototype.busboy = function(ctx,callbck) {
    let that = this;
    let req = ctx.req
    let res = ctx.res
    let busboy = new Busboy({headers: req.headers})
    return new Promise((resolve, reject) => {
       // console.log('文件上传中...')
       let infoJson = {
         success: false,   //成功
         message: '',      //信息
         data: null,       //返回的路径
         fields : { }      //返回字段
       }
       // 解析请求文件事件
       busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          let primise = callbck(fieldname, file, filename, encoding, mimetype)
          primise.then(function(data){
            infoJson.success = true;
            infoJson.message = '文件上传成功';
            infoJson.data = data;
            resolve(infoJson)
          }).catch(function(err){
            reject(err)
          })
       })
       busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
           infoJson.fields[fieldname] = val
       });
       // 解析错误事件
       busboy.on('error', function(err) {
         reject(err)
       })
       req.pipe(busboy)
     })
}
//本地上传方法
Koa2_Upload.prototype.local_upload = function(file,filename) {
  const that = this;
  //构造一个文件名。path.extname方法用于得到原文件名的后缀
  const newFilename = utility.md5(filename + String((new Date()).getTime())) + path.extname(filename);
  const defult_upload_url = this.default_upath;
  const upload_path = path.normalize(that.uploadPath)
  this.mkdirsSync( upload_path )
  const filePath    = path.join(upload_path, newFilename);   //构造出整个文件的绝对路径
  let newUploadPathARR = that.uploadPath.split('/')
  newUploadPathARR.shift()
  const newUploadPath = newUploadPathARR.join('/')
  const fileUrl     = `/${newUploadPath}/${newFilename}`;  //这是相对路径，用于上传后访问用
  return new Promise((res ,rej) => {
    file.on('end', function () {
      res({
        url : fileUrl,
        filename : newFilename
      })
    });
    file.pipe(fs.createWriteStream(filePath));
  })
};
//七牛上传方法
Koa2_Upload.prototype.qn_upload = function(file){
  let that = this;
  return new Promise((resolve ,reject) => {
    let buf = Buffer.alloc(0);
    file.on('data', function(data) {
       buf = Buffer.concat([ buf ,data]);
    });
    file.on('end', function(){
      qn.create(that.qn_access).upload(buf,{ key : uuid.v1() },function(err,data){
        err ? reject(err) : resolve(data)
      })
    })
  })
}
//处事方法 返回 promise
Koa2_Upload.prototype.init = function(ctx) {
  let that ,busboy;
  that = this
  return that.busboy(ctx ,function(fieldname, file, filename, encoding, mimetype){
    let promise;
    if(that.qn_access){
      promise = that.qn_upload(file)
    }else{
      promise = that.local_upload(file,filename)
    }
    return promise;
  })
}

module.exports = Koa2_Upload;
