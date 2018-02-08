# Node.js使用Nodemailer发送邮件

*原文链接：[Node.js使用Nodemailer发送邮件](https://mp.weixin.qq.com/s?__biz=MzU0OTE3MjE1Mw==&mid=2247483763&idx=1&sn=0166a93351c092aeb2c4efb8c0e0a4b3&chksm=fbb2a7a5ccc52eb3b241f32601a23be8a431e671ff493327ff61becc4f4ceb1da319ec6c8ea8#rd)*

电子邮件是—种用电子手段提供信息交换的通信方式，是互联网应用最广的服务。通过网络的电子邮件系统，用户可以以非常低廉的价格（不管发送到哪里，都只需负担网费）、非常快速的方式（几秒钟之内可以发送到世界上任何指定的目的地），与世界上任何一个角落的网络用户联系。

在很多项目中，我们都会遇到邮件注册，邮件反馈等需求。在node中收发电子邮件也非常简单，因为强大的社区有各种各样的包可以供我么直接使用。[Nodemailer](https://github.com/nodemailer/nodemailer)包就可以帮助我们快速实现发送邮件的功能。

Github源码：[https://github.com/ogilhinn/node-abc/tree/master/lesson10](https://github.com/ogilhinn/node-abc/tree/master/lesson10)

## Nodemailer简介

Nodemailer是一个简单易用的Node.js邮件发送组件

官网地址：[https://nodemailer.com](https://nodemailer.com)

GitHub地址：[https://github.com/nodemailer/nodemailer](https://github.com/nodemailer/nodemailer)

Nodemailer的主要特点包括：

- 支持Unicode编码
- 支持Window系统环境
- 支持HTML内容和普通文本内容
- 支持附件(传送大附件)
- 支持HTML内容中嵌入图片
- 支持SSL/STARTTLS安全的邮件发送
- 支持内置的transport方法和其他插件实现的transport方法
- 支持自定义插件处理消息
- 支持XOAUTH2登录验证

## 安装使用

首先，我们肯定是要下载安装   **注意：Node.js v6+**

```bash
npm install nodemailer --save
```

打开官网可以看见一个小例子

```javascript
'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
```

这个小例子是生成了Ethereal的账户进行邮件发送演示的。但是这多没意思，我们来使用自己的邮箱来发送邮件

## 发出个真实的邮件

这里我使用了我的qq邮箱给163邮箱发送email。

```javascript
'use strict';

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: 'xxxxxx@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xxxxxx',
  }
});

let mailOptions = {
  from: '"JavaScript之禅" <xxxxx@qq.com>', // sender address
  to: 'xxxxxxxx@163.com', // list of receivers
  subject: 'Hello', // Subject line
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
  // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
});
```

运行程序，成功将返回messageId。这是便可以去收件箱查看这个新邮件啦

![email](https://mmbiz.qpic.cn/mmbiz_png/jQxqlKeecNusMOqia2lzmS4uIyp6xUENlKVLrpffOdp3iaRb9iaIBnzhytQ5CiakRafPHNpr4hWGY6clLAovwGy1BQ/0?wx_fmt=png)

这里我们需要注意，auth.pass 不是邮箱账户的密码而是stmp的授权码。

到此我们就掌握了发邮件的基本操作。

## 更多配置

- CC: Carbon Copy(抄送)，用于通知相关的人，收件人可以看到都邮件都抄送给谁了。一般回报工作或跨部门沟通时，都会CC给收件人的领导一份
- BCC:Blind Carbon Copy(暗抄送)，也是用于通知相关的人，但是收件人是看不到邮件被密送给谁了。
- attachments: 附件

更多配置项：[https://nodemailer.com/message/](https://nodemailer.com/message/)

这里我们就不演示CC、BCC了，请自行尝试。我们来试试发送附件

```javascript
...
// 只需添加attachments配置项即可
attachments: [
    {   // utf-8 string as an attachment
      filename: 'text.txt',
      content: 'hello world!'
    },
    {
      filename: 'ZenQcode.png',
      path: path.resolve(__dirname, 'ZenQcode.png'),
    }
  ]
...
```

发送email，就可以收到一个内容为hello world的text.txt文件，以及一个我公众号的二维码。

## 好看的HTML邮件

HTML Email 编写指南: [http://www.ruanyifeng.com/blog/2013/06/html_email.html](http://www.ruanyifeng.com/blog/2013/06/html_email.html)

这儿，我们使用Foundation for Emails: [https://foundation.zurb.com/emails.html](https://foundation.zurb.com/emails.html)的模板

```javascript
'use strict';

const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: 'xxxxxx@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xxxxxx',
  }
});

let mailOptions = {
  from: '"JavaScript之禅" <xxxxx@qq.com>', // sender address
  to: 'xxxxxxxx@163.com', // list of receivers
  subject: 'Hello', // Subject line
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: fs.createReadStream(path.resolve(__dirname, 'email.html')) // 流
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
  // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
});
```

运行程序，你将如愿以偿手打如下Email。*样式可能会有细微偏差*

![屏幕快照 2017-12-01 16.32.41](https://mmbiz.qpic.cn/mmbiz_png/jQxqlKeecNusMOqia2lzmS4uIyp6xUENllAX6TwscJgpOfT7hAMicWibm9mfv0tbAp4qBEgMwpmSq1by8zhLktsGA/0?wx_fmt=png)

上面email中我们用了外链的图片，我们也可以使用附件的方式，将图片嵌入进去。给附件加个`cid`属性即可。

```javascript
...
let mailOptions = {
  ...
  html: '<img src="cid:01">', // html body
  attachments: [
    {
      filename: 'ZenQcode.png',
      path: path.resolve(__dirname, 'ZenQcode.png'),
      cid: '01',
    }
  ]
};
...
```

### 使用模板引擎

邮件信息一般都不是固定的，我们可以引入模板引擎对HTML内容进行渲染。

这里我们使用Ejs：[https://github.com/mde/ejs/](https://github.com/mde/ejs/)来做演示

```bash
$ npm install ejs --save
```

*ejs具体语法请参看官方文档*

先建立一个email.ejs文件

```ejs
<h1>hello <%= title %></h1>
<p><%= desc %></p>
```

修改我们的js文件

```javascript
...
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email.ejs'), 'utf8'));

const html = template({
  title: 'Ejs',
  desc: '使用Ejs渲染模板',
});

let mailOptions = {
  from: '"JavaScript之禅" <xxxxx@qq.com>', // sender address
  to: 'xxxxx@163.com', // list of receivers
  subject: 'Hello', // Subject line
  html: html,// html body
};
...
```

到此，你的邮箱将收到一个动态渲染的hello Ejs。

本文到此告一段落，在此基础上你可以实现更多有用的功能

## HTML email 框架推荐

- MJML: [https://mjml.io/](https://mjml.io/)
- emailframe [http://emailframe.work/](http://emailframe.work/)
- Foundation for Emails 2: [https://foundation.zurb.com/emails.html]()
- responsive HTML email template: [https://github.com/leemunroe/responsive-html-email-template](https://github.com/leemunroe/responsive-html-email-template)
- campaignmonitor：[https://www.campaignmonitor.com/a/](https://www.campaignmonitor.com/a/)

**左手代码，右手砖，抛砖引玉**

如果你知道更多好用HTML email资源，留言交流让更多人知道。



### 最后福利干货来了

**…**

**…**

**…**

### 36个国内外精致电子邮件HTML模版

![产品周报类预览](https://mmbiz.qpic.cn/mmbiz_png/jQxqlKeecNusMOqia2lzmS4uIyp6xUENlkqUAvdq3BHWUb30lM954qb8Gibg8YicJqeiaoBCicr3WNoG0ia8rxNPcv8Q/0?wx_fmt=png)

![投票](https://mmbiz.qpic.cn/mmbiz_png/jQxqlKeecNusMOqia2lzmS4uIyp6xUENlzkOmSp9CbXZaBkYHaOQBJtJspZtwerREh2JABMEGTHDUlPqlq9OicjA/0?wx_fmt=png)

![知乎周报](https://mmbiz.qpic.cn/mmbiz_png/jQxqlKeecNusMOqia2lzmS4uIyp6xUENltL90Ys4QHAARS3VibfRelFekZ0ZEI6TWqn0YTYwYlzCkRDicFPnWwtibQ/0?wx_fmt=png)

#### 关注公众号【JavaScript之禅】回复【 666 】，免费获取

![JavaScript之禅](./email/ZenQcode.png)
