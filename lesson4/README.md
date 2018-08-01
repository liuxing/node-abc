#  🔨Node入门教程-搭建静态文件服务器

传送门：[GitHub地址](https://github.com/ogilhinn/node-abc/tree/master/lesson4)

> 通过前面的几篇介绍，我们这个教程算正式打开Node开发的大门，学习了[环境搭建](http://www.xingxin.me/posts/58e651fcab572f17b0297880)、然后为了提高各位看官的新趣粗略的介绍了[Http模块](http://www.xingxin.me/posts/58e73d13ab572f17b0297881)、之后又了解了[Node的模块](http://www.xingxin.me/posts/58ecf9ffab572f17b0297882)。之前说过，**我们将通过实例来学习Node**，从这一篇开始，我们就将用实例来学习各个模块。


> 这一节我们将学习[File System (文件系统)](http://nodejs.cn/api/fs.html)以及[Path(路径)](http://nodejs.cn/api/path.html))并结合之前学习的知识打造 🔨一个Node静态文件服务器

## Node.js 文件系统
> Node.js提供本地文件的读写能力，基本上类似 UNIX（POSIX）标准的文件操作API。 所有的方法都有异步和同步的形式。例如读取文件内容的函数有异步的fs.readFile() 和同步的 fs.readFileSync()。

异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)，则第一个参数会是 null 或 undefined。

```javascript
const fs = require('fs')
/*异步读取
 *==================================*/
fs.readFile('README.md', function (err, data) {
   if (err) {
     return console.error(err)
   }
   console.log("异步读取: " + data.toString())
})
console.log("程序执行完毕。")
```
结果：`程序执行完毕。`会被先打印出来
```javascript
/*同步读取
 *==================================*/
const fs = require('fs')
const data = fs.readFileSync('README.md')
console.log("同步读取: " + data.toString())

console.log("程序执行完毕。")
```
结果：`程序执行完毕。`后打印出来
*强烈推荐大家是用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞*

接下来我们一起来看看fs模块的常用方法

#### 写入文件

```javascript
fs.writeFile(file, data[, options], callback)
```

参数说明：

- `file` - 文件名或文件描述符
- `data` - 要写入文件的数据，可以是 String(字符串) 或 Buffer(流) 对象
- `options` - 该参数是一个对象，包含 {encoding, mode, flag}。默认编码为 utf8, 模式为 0666 ， flag 为 'w'，*如果是一个字符串，则它指定了字符编码
- `callback` - 回调函数

以追加模式往README.me写入字符串Hello Node.js

```javascript
fs.writeFile('README.md', 'Hello Node.js', {flag: 'a+'}, (err) => {
  if (err) throw err
  console.log('It\'s saved!')
})
```

这里我们介绍下`flags` ：

| Flag | 描述                             |
| ---- | ------------------------------ |
| r    | 以读取模式打开文件。如果文件不存在抛出异常。         |
| r+   | 以读写模式打开文件。如果文件不存在抛出异常。         |
| rs   | 以同步的方式读取文件。                    |
| rs+  | 以同步的方式读取和写入文件。                 |
| w    | 以写入模式打开文件，如果文件不存在则创建。          |
| wx   | 类似 'w'，但是如果文件路径存在，则文件写入失败。     |
| w+   | 以读写模式打开文件，如果文件不存在则创建。          |
| wx+  | 类似 'w+'， 但是如果文件路径存在，则文件读写失败。   |
| a    | 以追加模式打开文件，如果文件不存在则创建。          |
| ax   | 类似 'a'， 但是如果文件路径存在，则文件追加失败。    |
| a+   | 以读取追加模式打开文件，如果文件不存在则创建。        |
| ax+  | 类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。 |

#### 打开文件

- 同步 `fs.open(path, flags[, mode], callback)`
- 异步`fs.openSync(path, flags[, mode])`

参数说明：

- `path` - 文件的路径
- `flags`  - 文件打开的行为。具体值详见下文
- `mode ` - 设置文件模式(权限)，文件创建默认权限为 0666(可读，可写)
- `callback` - 回调函数，带有两个参数如：callback(err, fd)
```javascript
const fs = require("fs");

fs.open('README.md', 'r+', function(err, fd) {
   if (err) {
       return console.error(err)
   }
  console.log("文件打开成功！")
})
```

#### 读取文件

```javascript
fs.read(fd, buffer, offset, length, position, callback)
```

参数说明：

- `fd` - 通过 fs.open() 方法返回的文件描述符
- `buffer` - 是数据将被写入到的 buffer
- `offset` - 是 buffer 中开始写入的偏移量
- `length` - 是一个整数，指定要读取的字节数
- `position` - 是一个整数，指定从文件中开始读取的位置。 如果 `position` 为 `null`，则数据从当前文件位置开始读取
- `callback` - 回调函数，有三个参数err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象

```javascript
const fs = require("fs");
let buf = new Buffer(1024)
fs.open('README.md', 'r+', function(err, fd) {
   if (err) {
       return console.error(err)
   }
  fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
      if (err){
         console.error(err);
      }
      console.log(bytes + "  字节被读取")
      // 仅输出读取的字节
      if(bytes > 0){
         console.log(buf.slice(0, bytes).toString())
      }
   })
})
```

现在我们就可以从README.md中读取出1kb的数据

#### 读取目录

`readdir`方法用于读取目录，返回一个所包含的文件和子目录的数组。

```javascript
fs.readdir(path[, options], callback)
```

同步版本：

```javascript
fs.readdirSync(path[, options])
```

我们来写个遍历目录的方法吧！这是个同步的*(同步版本简单点)*

遍历目录时一般使用**递归算法**，否则就难以编写出简洁的代码。递归算法与数学归纳法类似，通过不断缩小问题的规模来解决问题，目录是一个树状结构，在遍历时一般使用**深度优先**+**先序遍历算法**

```javascript
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file)

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}
```

该函数以某个目录作为遍历的起点。遇到一个子目录时，就先接着遍历子目录。遇到一个文件时，就把文件的绝对路径传给回调函数。回调函数拿到文件路径后，就可以做各种判断和处理了：

```javascript
travel(__dirname, function (pathname) {
    console.log(pathname)
})
```

接下来，大家可以试着去实现异步遍历，原理都是一样的

关于File System (文件系统)的更多API请自行查看[Node中文网](http://nodejs.cn/api/fs.html)，

## Path模块

> `path` 模块提供了一些工具函数，用于处理文件与目录的路径，`path` 模块的默认操作会根据 Node.js 应用程序运行的操作系统的不同而变化。 比如，当运行在 Windows 操作系统上时，`path` 模块会认为使用的是 Windows 风格的路径

常用方法介绍

 `path.join([...paths])`方法用于连接路径

```javascript
path.join('foo', "bar");
// 返回: '/foo/bar'

path.join('foo', {}, 'bar')
// 抛出 TypeError: path.join 的参数必须为字符串
```

`path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径方法用于将相对路径转为绝对路径

```javascript
path.resolve('/foo/bar', './baz')
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/')
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
// 如果当前工作目录为 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

`path.extname()` 方法返回 `path` 的扩展名，即从 `path` 的最后一部分中的最后一个 `.`（句号）字符到字符串结束

```javascript
path.extname('index.html')
// 返回: '.html'

path.extname('index.coffee.md')
// 返回: '.md'
```

关于Path (路径)的更多API请自行查看[Node中文网](http://nodejs.cn/api/path.html)

上面介绍了fs与path模块的几个常用API，在使用时我们应该经常查看API文档，上面所学习的方法已经足够打造一静态文件服务器了，下面我们就一起开完成这个小案例吧。

## Node静态文件服务器
这个静态文件服务器大致是这样的：浏览器发送URL，服务端解析URL，对应到硬盘上的文件。如果文件存在，返回200状态码，并发送文件到浏览器端，我们要实现的功能如下：

- 主页显示当前目录下的文件和文件夹
- 点击链接可以打开文件或者文件夹

**有图有真相**，话不多说看图：
![Node静态文件服务器](http://ommpd2lnj.bkt.clouddn.com/file-server-index.png)
![Node静态文件服务器](http://ommpd2lnj.bkt.clouddn.com/file-server-js.png)
![Node静态文件服务器](http://ommpd2lnj.bkt.clouddn.com/file-server-dog.png)
*现在我们来一步一步实现这个小项目*

#### 1.首先起一个http服务器

 我们先来初始化工作：
1. 新建文件夹`file-server`
2. `npm init`初识初识化生成package.json
3. 新建index.js文件

现在我们在index.js文件中起一个服务器：

```javascript
const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})
```
还记得我们第一节让大家自己如了解的[supervisor](https://github.com/petruisfan/node-supervisor)工具吗？它可以实现监测文件修改并自动重启应用

```bash
$ supervisor --harmony index.js
Running node-supervisor with
  program '--harmony index.js'
  --watch '.'
  --extensions 'node,js'
  --exec 'node'

Starting child process with 'node --harmony index.js'
Watching directory '/Users/lx/Documents/workspace/node-abc/lesson4/file-server' for changes.
Press rs for restarting the process.
服务器运行在 http://127.0.0.1:3000
```

🚩现在我们这个服务器跑了起来，而且每次更该文件后不需要手动重启服务。

#### 2.处理URL请求
现在我们就要url模块与path来识别请求的文件*(还记得第二节了解的[url模块吗](https://github.com/ogilhinn/node-abc/tree/master/lesson2)？)*

```javascript
const http = require('http')
const url = require('url') //引入url模块
const path= require('path') //引入path模块

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  if(req.url == '/favicon.ico') return //不响应favicon请求
  // 获取url->patnname 即文件名
  let pathname = path.join(__dirname, url.parse(req.url).pathname)
  pathname = decodeURIComponent(pathname) // url解码，防止中文路径出错
  console.log(pathname) // .../node-abc/lesson4/file-server/ 请求的pathname
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})
```

#### 3. 读取文件发送给浏览器

接下来我们就运用本节所讲的文件系统的知识来处理文件,

1.先来处理文件夹：

```javascript
....
  if(req.url == '/favicon.ico') return //不响应favicon请求
  // 获取url->patnname 即文件名
  let pathname = path.join(__dirname, url.parse(req.url).pathname)
  pathname = decodeURIComponent(pathname) // url解码，防止中文路径出错
  console.log(pathname) // .../node-abc/lesson4/file-server/ 请求的pathname
  
  /**
   * 判断文件是否是文件夹
   * 是：返回文件列表
   * 否：读取文件内容
   */
   // stat方法的参数是一个文件或目录，它产生一个对象，该对象包含了该文件或目录的具体信息。我们往往通过该方法，判断正在处理的到底是一个文件，还是一个目录，这儿使用的是它的同步版本
    if(fs.statSync(pathname).isDirectory()){
        // 设置响应头
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        fs.readdir(pathname, (err, files)=>{
            res.write('<ul>')
            files.forEach((item)=>{
              	// 处理路径
                let link = path.join(url.parse(req.url).pathname, item)
                res.write(`<li><a href="${link}">${item}</a></li>`)
            })
            res.end('</ul>')
        })
    }
...
```

我们先用`fs.statSync(pathname).isDirectory()`来判断是否为文件夹，是则给浏览器返回当前文件夹下的文件列表，请求`/`直返回：

![Node静态文件服务器](http://ommpd2lnj.bkt.clouddn.com/file-server-index.png)
*此处我们新建了个test文件夹放了一些文件作为测试文件*

2.文件处理

因为我们的服务器同时要存放html, css, js, png, gif, jpg等等文件。并非每一种文件的MIME类型都是text/html的，所以这里我们引入了[mime](https://github.com/broofa/node-mime)模块，来处理mime支持

```javascript
const mime = require('mime');

// mime 2.x lookup 更名为 getType
mime.lookup('/path/to/file.txt');         // => 'text/plain'
mime.lookup('file.txt');                  // => 'text/plain'
mime.lookup('.TXT');                      // => 'text/plain'
mime.lookup('htm');                       // => 'text/html'
//具体使用异步官网
```
这儿用到了前面讲的文件读取：
```javascript
else{
  // 以binary读取文件
  fs.readFile(pathname, 'binary', (err, data)=>{
    if(err){
      res.writeHead(500, { 'Content-Type': 'text/plain'})
      res.end(JSON.stringify(err))
      return false
    }
    res.writeHead(200, { 
      'Content-Type': `${mime.lookup(pathname)};charset:UTF-8`
    })
    res.write(data, 'binary')
    res.end()
  })
}
```

如果路径不是文件夹，就读取具体的文件，这儿我们以二进制(binary)编码读取，你也可以试试UTF-8比较他们的区别。

到此我们这个**Node静态文件服务器**就算搭建完成👏👏👏，当然了还有许多优化的地方如：缓存、Gzip、页面美化等等…在此就不做介绍了，请自行搜索了解。

源码地址[node-abc](https://github.com/ogilhinn/node-abc/tree/master/lesson4)

## 总结：

这一节我们了解了**fs模块**，**path模块**。并运用这些知识搭建一**简单的文件服务器**
> 一切学问最重要的是融会贯通,要把它转变成自身的学问.

