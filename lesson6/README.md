# Node的readline (逐行读取)
传送门：[github地址](https://github.com/ogilhinn/node-abc/tree/master/lesson6)
> `readline` 模块提供了一个接口，用于从可读流（如 process.stdin）读取数据，每次读取一行

先来看这个基本示例：
```javascript
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('你叫什么名字？', (answer) => {
  // 对答案进行处理
  console.log(`你好：${answer}`);

  rl.close();
});
```

在命令行中执行`node hello.js`将出现如下结果：

```bash
$ node hello.js
你叫什么名字？liu
早上好，liu
```

通过这个示例，我们可以发现`readline`模块可以方便的实现命令行的交互功能。实现如[Node命令行工具开发【看段子】](http://www.xingxin.me/posts/58cc8e617ed80d4b7974f3da)治疗的小应用

下面我们先来了解`readline`的基本用法，然后再实现一个有趣的小功能。

## readline基本用法

`readline.Interface` 类的实例是使用 `readline.createInterface()` 方法构造的。 每个实例都关联一个 `input` [可读流](http://nodejs.cn/api/stream.html#stream_readable_streams)和一个 `output` [可写流](http://nodejs.cn/api/stream.html#stream_writable_streams)。`output` 流用于为到达的用户输入打印提示，且从 `input` 流读取

### 创建Readline实例

```javascript
readline.createInterface(options)
```

创建一个`readline`的接口实例. 接受一个Object类型参数，可传递以下几个值:

- `input` - 要监听的可读流 (必需)
- `output` - 要写入 readline 的可写流 (必须).
- `completer` - 用于 Tab 自动补全的可选函数。(不常用)
- `terminal` - 如果希望 input 和 output 流像 TTY 一样对待，那么传递参数 true ，并且经由 ANSI/VT100 转码。 默认情况下检查 isTTY 是否在 output 流上实例化。(不常用)

### 方法

- `rl.close()` 关闭接口实例 (Interface instance), 放弃控制输入输出流。”close” 事件会被触发
- `rl.pause()`暂停 readline 的输入流 (input stream), 如果有需要稍后还可以恢复。 
- `rl.prompt([preserveCursor])` 为用户输入准备好readline，将现有的setPrompt选项放到新的一行，让用户有一个新的地方开始输入。将preserveCursor设为true来防止光标位置被重新设定成0。
- `rl.question(query, callback)` 预先提示指定的query，然后用户应答后触发指定的callback。 显示指定的query给用户后，当用户的应答被输入后，就触发了指定的callback
- `rl.resume() `恢复 readline 的输入流 (input stream).
- `rl.setPrompt(prompt)` 用于设置每当 `rl.prompt()` 被调用时要被写入到 `output` 的提示。
- `rl.write(data[, key])  ` 把 `data` 或一个由 `key` 指定的按键序列写入到 `output`

### 事件

- `line`事件 ：在 input 流接受了一个` \n` 时触发，通常在用户敲击回车或者返回时接收。 这是一个监听用户输入的利器。
- `pause`事件： 输入流被暂停就会触发。 同样当输入流未被暂停，但收到 SIGCONT 也会触发。 (详见 SIGTSTP 和 SIGCONT 事件)
- `resume`事件：只要输入流重新启用就会触发
- `close`事件：当 close() 被调用时触发。 当 input流接收到`end`事件时也会被触发. 流接收到表示结束传输的 `<ctrl>-D`，收到表示 SIGINT 的 `<ctrl>-C`，且 readline.Interface 实例上没有注册 SIGINT 事件监听器。 

更多请参考[node中文网](http://nodejs.cn/api/readline.html)

### readline 实列

> 现在我们来实现一个命令行可交互的百度搜索
>

#### 1.使用readline实现一个可交互的命令行

```javascript
// 先来实现一个可交互命令行
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'search>>> '
})

rl.prompt()

rl.on('line', (line) => {
  	console.log(line)
    rl.prompt()
}).on('close', () => {
    console.log('再见!')
    process.exit(0)
})
```

`node index.js `运行这段代码出现可交互的命令行，等待我们输入，输入完成回车后会打印出输入的值

#### 2.使用http模块发起请求

*这里为了加深对原生http模块的理解我们没用第三方模块，有很多好用的第三方模块如：[request](https://github.com/request/request)、[superagent](http://visionmedia.github.io/superagent/)*

```javascript
...
function search(words, callback) { // es6默认参数
    let options = {
        hostname: 'www.baidu.com',
        port: 80,
        path: `/s?wd=${encodeURI(words)}`,
        method: 'GET'
    }

    const req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`) //返回状态码
        // console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部
        res.setEncoding('utf8') // 设置编码
        let  body = ''
        res.on('data', (chunk) => { //监听 'data' 事件
            body+=chunk
        })
        res.on('end', ()=>{
            let $ = cheerio.load(body)
            $('.t a').each(function(i, el){
                console.log($(this).text(), $(this).attr('href'),'\n')
            })
            callback()
        })
    })
    req.end() // end方法结束请求
}

...
```

这里我们用http模块发起客户端请求，并打印出来搜索结果的标题与链接，如果你忘记了http模块的使用可以回头查看[了解并使用Http模块](http://www.xingxin.me/posts/58e73d13ab572f17b0297881)，http模块是node相当重要的模块，后续我们还将继续学习。

这里我们用到了[cheerio](https://github.com/cheeriojs/cheerio)具体使用可参考其官网

#### 3. 实现命令行搜索
到此，我们只需将命令行的代码与http请求的代码整合起来就可以完成这个小项目了

```javascript
...
rl.on('line', (line) => {
  	search(line.trim(), ()=>{
        rl.prompt()
    })
}).on('close', () => {
    console.log('再见!')
    process.exit(0)
})
...
```

**源码地址: [github](https://github.com/ogilhinn/node-abc/tree/master/lesson6)**

现在在快命令行中试试我们一起完成的这个小案例吧！！！

*现在我们已经基本完成了命令行百度搜索这个小案例，我们还可为他加入更多的功能.。如，我们可以把它开发为全局命令行工具，只需要一个命令便可调用。如果有兴趣可以参考[Node命令行工具开发【看段子】](http://www.xingxin.me/posts/58cc8e617ed80d4b7974f3da)、[node命令行小工具开发【翻译小工具】](http://www.xingxin.me/posts/58c9014ffc98493874be8301)，建议大家都去试一试，实现更多有趣的功能*

## 相关链接
- [Node中文网](http://nodejs.cn/api/readline.html)
- [Node命令行工具开发【看段子】](http://www.xingxin.me/posts/58cc8e617ed80d4b7974f3da)
- [node命令行小工具开发【翻译小工具】](http://www.xingxin.me/posts/58c9014ffc98493874be8301)

