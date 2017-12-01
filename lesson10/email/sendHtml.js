'use strict';

const nodemailer = require('nodemailer');
const fs  = require('fs');
const path = require('path');
const account = require('./config')

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: account.user,
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: account.pass,
  }
});

let mailOptions = {
  from: `"JavaScript之禅" <${account.user}>`, // sender address
  to: account.to, // list of receivers
  subject: 'Hello', // Subject line
  // text: 'Hello world?', // plain text body
  html: fs.createReadStream(path.resolve(__dirname, 'email.html')) // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});