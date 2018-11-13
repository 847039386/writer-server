const nodemailer = require('nodemailer');
const config = require('../config')

let transporter = nodemailer.createTransport({
    host: config.email.smtp,
    auth: {
        user: config.email.user, 
        pass: config.email.token  
    }
});

const send = async function(recipient ,code ,options){
    options = options || {};
    const html = options.html || `您好！感谢您使用本服务，您正在进行邮箱验证，本次请求的验证码为：<br />${code}&nbsp;&nbsp;(为了保障您帐号的安全性，请在1小时内完成验证。)`;
    const title = options.title || '通行证验证';
    const mailOptions = {
        from: `"Fred Foo 👻" <${config.email.user}>`, // 发件人
        to: recipient, // 收件人邮箱
        subject: title, 
        html, 
    };
    return new Promise((resolve ,reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                resolve({ success :false ,msg :error.message })
            }else{
                resolve({ success :true })
            }
        });
    })
}

const sendFile = async function(recipient, file ,options){
    options = options || {};
    const html = options.html || `请注意查收文件`;
    const title = options.title || '文件发送';
    const filename = options.filename;
    return new Promise((resolve ,reject) => {
        transporter.sendMail({
            from: `"Fred Foo 👻" <${config.email.user}>`, // 发件人
            to: recipient, // 收件人邮箱
            subject: title, 
            html, 
            attachments:[
                {
                  filename : filename,
                  path: file
                }
            ]
        }, function (err, info) {
            if (err) {
                reject(err)
            }else{
                resolve()
            }
        })
    })
}



exports.send = send;
exports.sendFile = sendFile;