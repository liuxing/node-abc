# node命令行工具开发

> NodeJs有许多命令行工具。它们全局安装，并提供一个命令供我们使用，完成相应的功能。 现在我们就用node来开发一个实用的命令行小工具

## 一.初探

### 一个最简单的命令行工具

1.首先我们新建一目录，然后执行`npm init`生成package.json文件

2.新建一bin目录并在目录下创建一个hi.js

```javascript
#! /usr/bin/env node
console.log("hi")
```

执行`node hi.js`我们可以看到终端输出‘hi’。。当然这并不是我们要的命令行工具，我们需要直接运行`hi`就可出现结果

3.现在我们告诉npm可执行文件是哪个，在package.json里添加如下信息：

```json
 "bin": {
    "hi": "bin/hi.js"
  }
```

4. `npm link` 

   现在我们执行`npm link`启用命令行，现在再试试在终端直接输入`hi`命令，这次我们可以如愿见到结果

### 处理参数

命令行参数可通过系统变量`process.argv`获取。 *process.argv返回一个数组 第一个是node 第二个是脚本文件 第三个是输入的参数，*`process.argv[2]`开始得到才是真正的参数部分

```javascript
  #! /usr/bin/env node

let argv = process.argv.slice(2)
let yourName = argv[0]
console.log(`hi, ${yourName}!`)

// 执行 hi liu
// hi, liu!
```

### Commander.js
对于参数处理，我们一般使用[commander](https://github.com/tj/commander.js)，commander是一个轻巧的nodejs模块，提供了用户命令行输入和参数解析强大功能如：自记录代码、自动生成帮助、合并短参数（“ABC”==“-A-B-C”）、默认选项、强制选项、命令解析、提示符

 ```bash
 $ npm install commander --save
 ```

```javascript
#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander')

program
  .version('0.0.1')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv)

console.log('you ordered a pizza with:')
if (program.peppers) console.log('  - peppers')
if (program.pineapple) console.log('  - pineapple')
if (program.bbqSauce) console.log('  - bbq')
console.log('  - %s cheese', program.cheese)
```
### Commander API
- `Option()`: 初始化自定义参数对象，设置“关键字”和“描述” 
- `Command()`: 初始化命令行参数对象，直接获得命令行输入 
- `Command#command()`: 定义一个命令名字 
- `Command#action()`: 注册一个callback函数 
- `Command#option()`: 定义参数，需要设置“关键字”和“描述”，关键字包括“简写”和“全写”两部分，以”,”,”|”,”空格”做分隔。 
- `Command#parse()`: 解析命令行参数argv 
- `Command#description()`: 设置description值 
- `Command#usage()`: 设置usage值
- 更多参考 [commander官网](http://tj.github.io/commander.js/)

除了commander外，[yargs](http://yargs.js.org/)也是一个优秀的命令行参数处理模块

## 二.开发命令行翻译工具

### 1.新建并初始化项目
新建 文件夹translator/进入目录下执行`npm init` 生成package.json文件
```bash
npm install commander superagent cli-table2 --save
```
- *[cli-table2](http://npm.taobao.org/package/cli-table2)命令行表格输出*
- *[superagent](http://visionmedia.github.io/superagent/)用于http请求*

新建bin/translator.js文件，并加入package.json文件中
```json
 "bin": {
    "translator": "bin/translator.js"
  },
```
然后
```bash
npm link
```

这里我们会用到[有道API](http://fanyi.youdao.com/openapi?path=data-mode)
一切准备就绪我们就可以进行编码了

### 2.coding
*由于代码量很小，这里就直接贴代码，在代码中以注释讲解*
```javascript
#! /usr/bin/env node
// 引入需要的模块
const program = require('commander')
const Table = require('cli-table2') // 表格输出
const superagent = require('superagent') // http请求
// 初始化commander
program
    .allowUnknownOption()
    .version('0.0.1')
    .usage('translator <cmd> [input]')

// 有道api
const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=toaijf&key=868480929&type=data&doctype=json&version=1.1'

// 添加自定义命令
program
    .command('query')
    .description('翻译输入')
    .action(function(word) {
        // 发起请求
        superagent.get(API)
        .query({ q: word})
        .end(function (err, res) {
            if(err){
                console.log('excuse me, try again')
                return false
            }
            let data = JSON.parse(res.text)
            let result = {}

            // 返回的数据处理
            if(data.basic){
                result[word] = data['basic']['explains']
            }else if(data.translation){
                result[word] = data['translation']
            }else {
                console.error('error')
            }

            // 输出表格
            let table = new Table()
            table.push(result)
            console.log(table.toString())
        })
    })

// 没有参数时显示帮助信息
if (!process.argv[2]) {
    program.help();
    console.log();
}

program.parse(process.argv)
```

现在在终端中愉快的使用`translator`了

```
$ translator
Usage:  translator <cmd> [input]
  Commands:
    query   翻译输入
  Options:
    -h, --help     output usage information
    -V, --version  output the version number
```

## 三.小结

1. 了解nodeJs 可执行脚步
2. 了解命令行参数解析
3. 了解commander,cli-table2,superagent等第三方模块

*抛砖引玉，更多请参考各个模块的官方示例及API文档*

### 相关链接
- [CommandJs](http://tj.github.io/commander.js/#Command.prototype.parseExpectedArgs)
- [cli-table2](http://npm.taobao.org/package/cli-table2)
- [superagent](http://visionmedia.github.io/superagent/)
- [Node.js 命令行程序开发教程-阮一峰](http://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)
- [Commander写自己的Nodejs命令-粉丝日志](http://blog.fens.me/nodejs-commander/)

