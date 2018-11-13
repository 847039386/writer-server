const fs = require('fs')
const path = require('path')
const qn = require('qn')
const config = require('../config')
const debug = require('debug')('benmen:fileRemove')

//切割host 判断域名来自本地还是网络
exports.splitHost = function(filePath){
  var dizhi = null;
  try {
    let isHttp  = filePath.match(/((http|https)?\:\/\/.*?)\/.*/);
    if(isHttp){
      dizhi = isHttp[1]
    }else{
      let pathSplice = filePath.split('/')
      if(pathSplice.length > 1 && pathSplice[1] == 'upload'){
        dizhi = "public"
      }
    }
  } catch (error) {
    dizhi = null;
  }
  return dizhi;
}
/**
 * 删除文件
 * path 文件地址。
 * ext 允许删除的文件后缀名
 */
exports.fileLocalRemove = async function(filepath){
    let newFilePath = path.resolve('public',filepath.substr(1))
    let exists = fs.existsSync(newFilePath);
    let info = { success :false ,msg :'未知' }
    debug('删除文件新地址：' + newFilePath)
    debug('文件存在：' + exists)
    if(exists){
        try {
          let unlinkPromise = new Promise((res ,rej) => {
            fs.unlink(newFilePath ,err => {
              err ? rej(err) : res(true)
            })
          })
          try {
            let unlink = await unlinkPromise;
            if(unlink){
              info = Object.assign({ success :true ,msg : "文件成功删除"})
            }
          } catch (error) {
            debug('remove file error：' + e)
          }
        } catch (e) {
          debug('remove file error：' + e)
          info = Object.assign({ msg : "文件删除失败"})
        }
    }else{
      info = Object.assign({ msg : "文件不存在"})
    }
    return info;
}
exports.qiniuRemove = async function(filepath){
  let info ,client ,split_name ,file_name ,deleteQiniu;
  info = { success :false , msg :'出现了未知的错误'}
  client = qn.create(config.upload.qn_access);
  split_name = filepath.split('/')
  file_name = split_name[split_name.length - 1]
  deleteQiniu =  new Promise((res ,rej) => {
    client.delete(file_name,function(err){
       err ? rej(err) : res()
    })
  })
  try {
    await deleteQiniu;
    Object.assign(info,{success :true , msg :'qiuniu删除成功'})
  } catch (e) {
    Object.assign(info,{msg :'qiniu删除出现了错误：'+ e })
  } finally {
    return info
  }
}
//按照地址的前缀判断执行本地操作还是远程操作 ，如本地删除文件。和七牛删除文件
exports.removeFile = async function(filepath ,ext){
    let info ,host ,qn;
    qn = config.upload.qn_access.origin
    info = { success :false , msg :'出现了未知的错误'}
    host = exports.splitHost(filepath)
    debug('分割后的域名：' + host + ' ' +filepath)
    if(host){
      switch(host){
          case 'public':
             debug('本地删除')
             info = await exports.fileLocalRemove(filepath ,ext)
             info.msg = info.success ? '本地删除成功' : info.msg
          break;
          case qn :
             debug('七牛删除')
             info = await exports.qiniuRemove(filepath)
          break;
          default :
             debug('未知根源则不删除')
             info.msg = '出现某些原因，找不到要删除文件的根源。'
          break
      }
    }
    return info;
}
