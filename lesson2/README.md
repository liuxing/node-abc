# Node入门教程-了解并使用Http模块
传送门：[GitHub地址](https://github.com/ogilhinn/node-abc)
>上一节，我们用Http模块搭建了一个hello world服务器。现在我们就来了解了解Http模块，学习它的常用API，并在最后实现两个小案例。
>http模块主要用于搭建HTTP服务。使用Node搭建HTTP服务器非常简单。

*按理说，我们应该先讲讲NPM，package.json。但我觉得先讲讲Http模块实现两个小案例，可以让各位看官更有兴趣，能够愉悦的学习使用Node.js*

我想你可能已经学会了看官网的文档，但脑子在想这是什么鬼，的确，Node.js的文档对初学者不太友好。很多用不上，例子太少。大体来说Http模块，主要的应用是两部分，一部分是http.createServer 担当web服务器，另一部分是http.createClient，担当客户端，实现爬虫之类的工作。下文将从这两方面着手介绍HTTP api。

## 1.Http服务器

看上一节例子

```javascript
const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain') //writeHead，200表示页面正常，text/plain表示是文字。
  res.end('Hello World\n') // end 完成写入
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})
```
1. 首先 使用 HTTP 服务器和客户端必须 require('http')。
2. 然后使用`http.createServer([requestListener])`来创建一个web服务器，其中传入一个可选的回调函数，这回调函数有两个参数分别代表客户端请求与服务器端的响应对象
3. 使用 `server.listen([port][, hostname][, backlog][, callback])`开始在指定的 port 和 hostname 上接受连接


简单的3步一个http服务器就建好，有打开就有关闭

```javascript
server.close([callback]) // 停止服务端接收新的连接
```

Node.jsHttp模块也提供了`server.timeout`用于查看或设置超时

```javascript
server.timeout = 1000 //设置超时为1秒
console.log(server.timeout)
```

### 获取客户端请求信息
#### request对象
- request.url 客户端请求的url地址
- request.headers 客户端请求的http header
- request.method 获取请求的方式，一般有几个选项，POST,GET和DELETE等，服务器可以根据客户端的不同请求方法进行不同的处理。
- request.httpVersion http的版本
- request.trailers 存放附加的一些http头信息
- request.socket 用于监听客户端请求的socket对象

我们可以写一小段js将客户端的请求信息保存在log.txt中

```javascript
const http = require('http') //引入http模块
const fs = require('fs') //引入fs模块 文件 I/O
const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => { //创建一个http服务器
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  if(req.url !== '/favicon.ico'){
      let out = fs.createWriteStream('./log.txt') // 创建写入流
      out.write(`请求方法：${req.method} \n`)
      out.write(`请求url：${req.url} \n`)
      out.write(`请求头对象：${JSON.stringify(req.headers, null, 4)} \n`)
      out.write(`请求http版本：${req.httpVersion} \n`)      
  }
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})

log.txt
============================================
请求方法：GET 
请求url：/ 
请求头对象：{
    "host": "127.0.0.1:3000",
    "connection": "keep-alive",
    "cache-control": "max-age=0",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, sdch, br",
    "accept-language": "zh-CN,zh;q=0.8,en;q=0.6"
} 
请求http版本：1.1 
```

### response对象

- `response.writeHead(statusCode, [reasonPhrase], [headers])`
- `response.statusCode` html页面状态值
- `response.header` 返回的http header，可以是字符串，也可以是对象
- `response.setTimeout(msecs, callback)`设置http超时返回的时间，一旦超过了设定时间，连接就会被丢弃
- `response.statusCode` 设置返回的网页状态码
- `response.setHeader(name, value)`设置http协议头
- `response.headersSent`判断是否设置了http的头
- `response.write(chunk, [encoding])` 返回的网页数据，[encoding] 默认是 utf-8
- `response.end([data], [encoding])`

### URL解析

在Node.js中，提供了一个[`url`](http://nodejs.cn/api/url.html)模块与[`querystring (查询字符串)`](http://nodejs.cn/api/querystring.html)模块

#### `querystring`模块 用于 URL 处理与解析


```javascript
querystring.parse(str, [sep], [eq], [options]) // 将字符串转成对象
```
| 欲转换的字符串             | str                |
| ------------------- | ------------------ |
| 设置分隔符，默认为 ‘&'       | sep                |
| 设置赋值符，默认为 ‘='       | eq                 |
| 可接受字符串的最大长度，默认为1000 | [options]  maxKeys |

```javascript
// 例子:
querystring.parse('foo=bar&baz=qux&baz=quux&corge')
// returns
{ foo: 'bar', baz: ['qux', 'quux'], corge: '' }
```

`querystring.stringify(obj,separator,eq,options)`这个方法是将一个对象序列化成一个字符串，与`querystring.parse`相对。

```javascript
querystring.stringify({name: 'whitemu', sex: [ 'man', 'women' ] });

// returns
'name=whitemu&sex=man&sex=women'
```

#### url 模块提供了一些实用函数，用于 URL 处理与解析

一个 URL 字符串是一个结构化的字符串，它包含多个有意义的组成部分。 当被解析时，会返回一个 URL 对象，它包含每个组成部分作为属性。

以下详情描述了一个解析后的 URL 的每个组成部分
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                    href                                     │
├──────────┬┬───────────┬─────────────────┬───────────────────────────┬───────┤
│ protocol ││   auth    │      host       │           path            │ hash  │
│          ││           ├──────────┬──────┼──────────┬────────────────┤       │
│          ││           │ hostname │ port │ pathname │     search     │       │
│          ││           │          │      │          ├─┬──────────────┤       │
│          ││           │          │      │          │ │    query     │       │
"  http:   // user:pass @ host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          ││           │          │      │          │ │              │       │
└──────────┴┴───────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘
(请忽略字符串中的空格，它们只是为了格式化)
```

`url.format(urlObject)` 回一个从 urlObject 格式化后的 URL 字符串
`url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` 解析一个 URL 字符串并返回一个 URL 对象

我们可以使用`url.parse()`解析出的对象来获取URL中的各个值

更多请参考[node中文网](http://nodejs.cn/api/querystring.html)

###  实例：HTTP JSON API 服务器

  编写一个 HTTP 服务器，每当接收到一个路径为 '/api/parsetime' 的 GET
  请求的时候，响应一些 JSON 数据。我们期望请求会包含一个查询参数（query
  string），key 是 "iso"，值是 ISO 格式的时间。

- /api/parsetime?iso=2017-04-05T12:10:15.474Z

  所响应的 JSON 应该只包含三个属性：'hour'，'minute' 和 'second'。例如：

  ```json
  {
    "hour":21,
    "minute":45,
    "second":30
  }
  ```

- /api/unixtime?iso=2017-04-05T12:10:15.474Z，它的返回会包含一个属性：'unixtime'，相应值是一个 UNIX

  时间戳。例如:

  ```json
    { "unixtime": 1376136615474 }
  ```


具体代码如下
```javascript
const http = require('http')
const url = require('url')

const hostname = '127.0.0.1'
const port = 3000

// 解析时间的函数
function parsetime(time) {
    return {
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds()
    }
}

function unixtime(time) {
    return { unixtime: time.getTime() }
}

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true)
    let time = new Date(parsedUrl.query.iso)
    let result
	// 主页 返回当前时间的json
    if(req.url=='/'){
        result = parsetime(new Date())
    }
    // 返回查询时间的json
    else if (/^\/api\/parsetime/.test(req.url)) {
        result = parsetime(time)
    }
    // 返回查询时间的unixtime
    else if (/^\/api\/unixtime/.test(req.url)) {
        result = unixtime(time)
    }

    if (result) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
    } else {
        res.writeHead(404)
        res.end()
    }
})

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}`)
})
```

## 2.Http客户端

在Node.js可以很容易的使用request方法想向其他网站求数据，也可以用`http.get(options[, callback])`

```javascript
http.request(options, callback)
```

request方法的options参数，可以是一个对象，也可以是一个字符串。如果是字符串，就表示这是一个URL，Node内部就会自动调用`url.parse()`，处理这个参数。

`http.request()`返回一个`http.ClientRequest`类的实例。它是一个可写数据流，如果你想通过POST方法发送一个文件，可以将文件写入这个ClientRequest对象

现在我们拿[www.example.com](www.example.com)试试

```javascript
const http = require('http')
let options = {
    hostname: 'www.example.com',
    port: 80,
    path: '/',
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`) //返回状态码
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部
    res.setEncoding('utf8') // 设置编码
    res.on('data', (chunk) => { //监听 'data' 事件
        console.log(`主体: ${chunk}`)
    })

})

req.end() // end方法结束请求
```

到此我们请求到了网站上的信息，基于这些我们可以开发出更有用的爬虫，提取到有用的信息，后续将介绍

## 3.一些好用的包

- [express](http://expressjs.com/) Express 是一个简洁而灵活的 node.js Web应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。
- [request](https://github.com/request/request) request模块让http请求变的更加简单

## 4.总结

本节我们学习使用Http模块建立服务端以及发起本地请求的客户端，并展示了两个超级简单的例子。想必各位看官都已经迫不及待的将Node.js用了起来，甚至觉得有点小激动。下一节，我们还是退回去学习Node的npm，package.json，以及模块机制。然后再学习其他的
