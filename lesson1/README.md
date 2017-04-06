# 【Node入门教程】搭建Node.js开发环境
HELLO WORLD
> 本章节我们将向大家介绍在各个平台上(win,mac与ubuntu)安装Node.js的方法。本安装教程以Latest LTS Version: **v6.10.2** (includes npm 3.10.10)版本为例

## 安装配置

要学习一门语言，我们首先应该去它的官网逛逛，Node.js的官网地址为[https://nodejs.org](https://nodejs.org)（现在腾讯团队翻译的[Node.js中文网](http://nodejs.cn)貌似也进行的差不多了）

进入到Node.js的官网，我们点击[Download](https://nodejs.org/en/download/)可以看到各个平台Node.js的安装包，现在我们就来看看如何在各个平台安装Node（*当然官网也提供了详细的[安装指引](https://nodejs.org/en/download/package-manager/)*）

![Node.js](http://ommpd2lnj.bkt.clouddn.com/node.png)

### Windows和mac平台

其实windows和mac上安装Node.js没有什么好说的，和安装其他软件一样，同意协议然后一直点击下一步就好了。Duang的一下安装完后，我们就可以打开命令行查看是否安装成功

```bash
$ node -v
v6.10.2 #如果出现如下结果，那么恭喜你安装成功了
```

### Linux平台(Ubuntu)

相比于Windows与mac，Linux平台的安装还是有些许繁琐，但无非也就是使用命令行

- #### Node.js官网提供的安装方式

  ```bash
  $ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  $ sudo apt-get install -y nodejs
  ```

  *当然了可能会不成功，不要怕还可以试试我们其他的方式*

- #### 从源代码安装Node.js

  首先我们更新下系统，并下载编译需要的包

  ```bash
  $ apt-get update
  $ apt-get install python gcc make g++
  ```

  然后使用wget下载源码包

  ```bash
  $ wget https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-x64.tar.gz 
  # 移动目录
  $ cp node-v6.10.2-linux-x64.tar.gz  /usr/local/src/
  ```

  现在我们解压源代码，并进入目录下开始编译

  ```bash
  $ tar zxvf node-v0.12.4.tar.gz
  $ cd node-v0.12.4/
  $ ./configure
  $ make install
  ```

  最后我们`node -v`现在我们应该可以看见Node.js的版本号

  上述每一步操作注意权限问题*


- #### apt-get安装

  我们也有简单的选择`apt-get`

  ```bash
  $ sudo apt-get install nodejs
  ```

  但是`apt-get`安装有一个问题就是版本有点老

- #### 使用[nvm](https://github.com/creationix/nvm)

  这放在最后说就说明这玩意儿不简单，毕竟重量级选手都最后出场。

  nvm是Node版本管理器：nvm。简单的bash脚本来管理多个活跃的node.js版本，与nvm类似的还有[n](https://github.com/tj/n)模块

  ##### 安装nvm

  我们可以使用curl或者wget安装

  ```bash
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
  ```

  ```bash
  wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
  ```

  #####nvm使用

  使用nvm可以方便的下载安装删除各个版本的Node.js

  ```bash
  nvm install stable #安装最新稳定版 node，现在是 5.0.0
  nvm install 4.2.2 #安装 4.2.2 版本
  nvm install 0.12.7 #安装 0.12.7 版本

  # 特别说明：以下模块安装仅供演示说明，并非必须安装模块
  nvm use 0 #切换至 0.12.7 版本
  nvm use 4 #切换至 4.2.2 版本
  ```

  具体使用请参考[nvm官网](https://github.com/creationix/nvm)

## hello world

到此想必各位看官已经在自己的电脑上安装后了Node.js开发环境（*我想大家没看这个就已经安好了，安装指引只是列行公事* ~.~）

下面我们来一个hello world开启本次学习之路

这是官网的一个例子，一个使用 Node.js 编写的 web 服务器，响应返回 'Hello World'

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
```

## 一些有用的工具

- [nrm](https://github.com/Pana/nrm) 快速切换 NPM 源 
- [cnpm](http://npm.taobao.org/) 淘宝 NPM 镜像
- [supervisor](https://www.npmjs.com/package/supervisor)Supervisor实现监测文件修改并自动重启应用

## 总结

1. 在本机成功安装Node.js
2. 用http模块起一个http服务器，打开Node的大门
3. 了解一些有用的模块（详细使用请自行了解）

既然这节用http模块说了hello world，下一节，我们就来一起看看http模块