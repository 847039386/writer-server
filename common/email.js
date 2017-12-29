const nodemailer = require('nodemailer');
const config = require('../config')

let transporter = nodemailer.createTransport({
    host: config.email.smtp,
    auth: {
        user: config.email.user, 
        pass: config.email.token  
    }
});

const send = async function(recipient ,code){
    let mailOptions = {
        from: `"Fred Foo 👻" <${config.email.user}>`, // 发件人
        to: recipient, // 收件人邮箱
        subject: '通行证验证', 
        html: `您好！感谢您使用本服务，您正在进行邮箱验证，本次请求的验证码为：<br />${code}&nbsp;&nbsp;(为了保障您帐号的安全性，请在1小时内完成验证。)`, 
    };
    return new Promise((resolve ,reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                resolve(false)
            }else{
                resolve(true)
            }
        });
    })
}


exports.send = send;