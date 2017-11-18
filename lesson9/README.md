# Koa快速入门教程（一）

![koa2](http://ommpd2lnj.bkt.clouddn.com/koa2.png)

> [Koa](https://koa.bootcss.com/#introduction) 是由 [Express](http://www.expressjs.com.cn/) 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架，采用了`async`和`await`的方式执行异步操作。 

*Koa有v1.0与v2.0两个版本，随着node对`async`和`await`的支持，Koa2的正式发布，本文Koa均指Koa2*

如果你还不熟悉`async`函数可查阅阮大的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/async)

这是一篇从零开始的简易教程，话不多说，先来快速开始：hello world！

## 一、快速开始

### 1.1 开发环境

Koa 依赖 **node v7.6.0** 或 ES2015及更高版本和 async 方法支持，你可以使用自己喜欢的版本管理器快速安装支持的 node 版本

```bash
$ node -v
v8.9.1
```

如果你的版本号小于v7.6.0,请自行升级。如使用[nvm](https://github.com/creationix/nvm)

在确认好环境后，我们就可以新建一个项目，在里面自由操练了

```bash
$ mkdir KoaTutorial && cd KoaTutorial

$ npm i koa --save
```

###  1.2 必修的 hello world 应用:

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

打开浏览器，访问 [http://localhost:3000/](http://localhost:3000/)，你会看到那可爱的`Hello World`。就是这么简单的几行代码，我们就起了一个HTTP服务，

来来看看这个hello world程序，其中前两行和后一行是架设一个 HTTP 服务。中间的则是对用户访问的处理。`ctx`则是Koa所提供的`Context`对象(上下文)，`ctx.body=`则是`ctx.response.body=`的alias(别名)，这是响应体设置的API。

### 1.3 Context 对象

Koa Context 将 node 的 `request` 和 `response` 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。上例的`ctx.body = ''`即是发送给用户内容，它是`ctx.response.body`的简写*(更多请查阅[官网](https://koa.bootcss.com))*。`ctx.response`代表 HTTP Response。`ctx.request`代表 HTTP Request。

## 二、路由(URL处理)

### 2.1 手动实现简易路由

koa是个极简的web框架，简单到连路由模块都没有配备，我们先来可以根据`ctx.request.url`或者`ctx.request.path`获取用户请求的路径，来实现简单的路由。

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  let _html = '404 NotFound'
  switch (ctx.url) {
    case '/':
      _html = '<h1>Index</h1>';
      break;
    case '/adout':
      _html = '<h1>About</h1>';
      break;
    case '/hello':
      _html = '<h1>world</h1>';
      break;
    default:
      break;
  }
  ctx.body = _html;
});

app.listen(3000);
```

运行这段代码，访问http://localhost:3000/hello将看见world，访问http://localhost:3000/about将看见返回about，访问http://localhost:3000将看见Index。是不是很有成就感…但是这也太麻烦了吧。如果依靠`ctx.request.url`去手动处理路由，将会写很多代码，这时候就需要对应的路由中间件来对路由进行控制: [koa-router](https://github.com/alexmingoia/koa-router) 

## 2.2 使用koa-router中间件

下载并引入koa-router

```bash
npm i koa-router --save
```

```javascript
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  let html = `
      <ul>
        <li><a href="/hello">helloworld</a></li>
        <li><a href="/about">about</a></li>
      </ul>
    `
  ctx.body = html
}).get('/hello', async (ctx) => {
  ctx.body = 'helloworld'
}).get('/about', async (ctx) => {
  ctx.body = 'about'
})

app.use(router.routes(), router.allowedMethods())

app.listen(3000);
```

运行这个 demo，我们将看到与上栗一样的效果。在这儿我们使用到了第三方中间件。

## 三、中间件

Koa 的最大特色，也是最重要的一个设计，就是中间件（middleware）Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。Koa中使用`app.use()`用来加载中间件，基本上Koa 所有的功能都是通过中间件实现的。每个中间件默认接受两个参数，第一个参数是 Context 对象，第二个参数是`next`函数。只要调用`next`函数，就可以把执行权转交给下一个中间件。

下图为经典的Koa洋葱模型

![koa2洋葱模型](http://ommpd2lnj.bkt.clouddn.com/onion.png)
我们来运行Koa官网这个小例子：
```javascript
const Koa = require('koa');
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

上面的执行顺序就是：请求 ==> x-response-time中间件 ==> logger中间件 ==> 响应中间件 ==> logger中间件 ==> response-time中间件 ==> 响应。 通过这个顺序我们可以发现这是个栈结构以"先进后出"（first-in-last-out）的顺序执行。Koa已经有了很多好用的中间件*([https://github.com/koajs/koa/wiki#middleware](https://github.com/koajs/koa/wiki#middleware))你需要的常用功能基本上都有人实现了*

## 四、模板引擎

在实际开发中，返回给用户的网页往往都写成模板文件。 Koa 先读取模板文件，然后将这个模板返回给用户，这事我们就需要使用模板引擎了，关于Koa的模版引擎，我们只需要安装koa模板使用中间件[koa-views](https://github.com/queckezz/koa-views) 然后在下载你喜欢的模板引擎*([支持列表](https://github.com/tj/consolidate.js#supported-template-engines))*便可以愉快的使用了。如安装使用[ejs](https://github.com/mde/ejs)

```bash
# 安装koa模板使用中间件
$ npm i --save koa-views

# 安装ejs模板引擎
$ npm i --save ejs
```

```javascript
const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa()

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}))

app.use(async (ctx) => {
    let title = 'Koa2'
    await ctx.render('index', {
        title,
    })
})

app.listen(3000)
```
`./view/index.ejs` 模板
```ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
</body>
</html>
```

打开http://localhost:3000/，你将看到返回了页面：

![koa 模板引擎](http://ommpd2lnj.bkt.clouddn.com/koa-views.png)关于ejs语法请访问ejs官网学习：[https://github.com/mde/ejs](https://github.com/mde/ejs)

## 五、静态资源服务器

网站一般都提供静态资源（图片、字体、样式表、脚本……），我们可以自己实现一个静态资源服务器，但这没必要，[koa-static](https://www.npmjs.com/package/koa-static)模块封装了这部分功能。

```bash
$ npm i --save koa-static
```

```javascript
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(static(
  path.join(__dirname, staticPath)
))


app.use(async (ctx) => {
  ctx.body = 'hello world'
})

app.listen(3000)
```

我们访问http://localhost:3000/css/app.css 将返回`app.css` 的内容，访问http://localhost:3000/koa2.png我们将看见返回下图

![koa2](http://ommpd2lnj.bkt.clouddn.com/koa2.png)
## 六、请求数据的获取

前文我们主要都在处理数据的响应，这儿我们来了解下Koa获取请求数据，主要为`GET`和`POST`方式。

### 6.1 GET请求参数的获取

在koa中，获取GET请求数据源头是koa中request对象中的query方法或querystring方法，query返回是格式化好的参数对象，querystring返回的是请求字符串。

- 请求对象ctx.query*(或ctx.request.query)*，返回如 { a:1, b:2 }
- 请求字符串 ctx.querystring*(或ctx.request.querystring)*，返回如 a=1&b=2

```javascript
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {
  const url = ctx.url
  const query = ctx.query
  const querystring = ctx.querystring

  ctx.body = {
    url,
    query,
    querystring
  }
})

app.listen(3000)
```

运行程序并访问http://localhost:3000/?page=2&limit=10，我们将得到如下结果

```json
{"url":"/?page=2&limit=10","query":{"page":"2","limit":"10"},"querystring":"page=2&limit=10"}
```

对了，在这儿推荐个插件：[JSONView](https://github.com/gildas-lormeau/JSONView-for-Chrome)，用了它你将得到格式化json数据，如下：

```json
{
  url: "/?page=2&limit=10",
  query: {
    page: "2",
    limit: "10"
  },
  querystring: "page=2&limit=10"
}
```

更多Koa Request API 请查看[http://koajs.com/#request](http://koajs.com/#request)

### 6.2 POST请求数据获取

对于POST请求的处理，koa2没有封装获取参数的方法，需要通过自己解析上下文context中的原生node.js请求对象req，将POST表单数据解析成querystring（例如：`a=1&b=2&c=3`），再将querystring 解析成JSON格式（例如：`{"a":"1", "b":"2", "c":"3"}`），我们来直接使用[koa-bodyparser](https://github.com/koajs/bodyparser) 模块从 POST 请求的数据体里面提取键值对。

```javascript
const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

// 使用koa-bodyparser中间件
app.use(bodyParser())

app.use(async (ctx) => {

  if (ctx.url === '/' && ctx.method === 'GET') {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa-bodyparser</h1>
      <form method="POST" action="/">
        Name:<input name="name" /><br/>
        Age:<input name="age" /><br/>
        Email: <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
    ctx.body = ctx.request.body
  } else {
    // 404
    ctx.body = '<h1>404 Not Found</h1>'
  }
})

app.listen(3000)
```

运行程序，填写并提交表单，请求结果为：

```json
{
  name: "ogilhinn",
  age: "120",
  email: "ogilhinn@gmail.com"
}
```

关于更多的Koa知识快打开搜索引擎搜索*([常用的搜索引擎技巧])*继续学习吧，后续将继续数据库的操作以及实现一个简单的小案例。

## 参考链接

- [Koa官网](https://koa.bootcss.com)
- [Koa进阶学习笔记](https://chenshenhai.github.io/koa2-note/)
- [Koa 框架教程](http://www.ruanyifeng.com/blog/2017/08/koa.html)
- [Koa wiki](https://github.com/koajs/koa/wiki)