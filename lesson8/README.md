# Node操作MongoDB数据库

> Web应用离不开数据库的操作，我们将陆续了解Node操作[MongoDB](https://www.mongodb.com/)与[MySQL](https://www.mysql.com/)这是两个具有代表性的数据库，非关系型数据库*(*NoSQL*)*及关系型数据库*(SQL)*。这一节，我们主要了解node中使用MongoDB，并与express结合实现一个简单图书管理小应用

我们来简单看看关系型数据库与非关系型数据库

### 非关系型数据库-NoSQL

在NoSQL之前，数据库中SQL一支独秀。随着web2.0的快速发展，非关系型、分布式数据存储得到了快速的发展，访问量巨大，传统关系型数据库遇到各种瓶颈*(如：高并发读写需求，高扩展性和可用性，复杂SQL，特别是多表关联查询等等)*。NoSQL就诞生于此背景下，NoSQL数据库的出现，弥补了关系数据（比如MySQL）在某些方面的不足，在某些方面能极大的节省开发成本和维护成本

#### NoSQL的优势
- 易扩展
- 高性能
- 灵活的数据模型
- 高可用


#### NoSQL的分类

NoSQL可以大体上分为4个种类：**Key-value、Document-Oriented、Column-Family Databases以及 Graph-Oriented Databases**

| 类型                                   | 代表         | 特点                                       |
| ------------------------------------ | ---------- | ---------------------------------------- |
| 键值（Key-Value）                        | MemcacheDB | 键值数据库就像在传统语言中使用的哈希表。你可以通过key来添加、查询或者删除数据，鉴于使用主键访问，所以会获得不错的性能及扩展性。 |
| 面向文档（Document-Oriented）              | MongoDB    | 文档存储一般用类似json的格式存储，存储的内容是文档型的。这样也就有有机会对某些字段建立索引，实现关系数据库的某些功能。 |
| 列存储（Wide Column Store/Column-Family） | Cassandra  | 顾名思义，是按列存储数据的。最大的特点是方便存储结构化和半结构化数据，方便做数据压缩，对针对某一列或者某几列的查询有非常大的IO优势。 |
| 图（Graph-Oriented）                    | Neo4J      | 图形关系的最佳存储。使用传统关系数据库来解决的话性能低下，而且设计使用不方便。  |

### 关系型数据库-SQL

SQL指结构化查询语言，全称是 Structured Query Language，关系数据库，是建立在关系模型基础上的数据库，借助于集合代数等数学概念和方法来处理数据库中的数据，关简单来说，关系模型指的就是二维表格模型，而一个关系型数据库就是由二维表及其之间的联系所组成的一个数据组织

#### SQL的优点

- 容易理解：二维表结构是非常贴近逻辑世界的一个概念，关系模型相对网状、层次等其他模型来说更容易理解
- 使用方便：通用的SQL语言使得操作关系型数据库非常方便
- 易于维护：丰富的完整性(实体完整性、参照完整性和用户定义的完整性)大大减低了数据冗余和数据不一致的概率

*前文提到了SQL遇到了瓶颈，并不是说SQL不行(个人认为MySQL是业内相当优秀的数据库)，只是应用场景的不同*

#### RDBMS 数据库程序
RDBMS 指关系型数据库管理系统*(Relational Database Management System)*。RDBMS 是 SQL 的基础，同样也是所有现代数据库系统的基础，比如 MS SQL Server、IBM DB2、Oracle、MySQL 以及 Microsoft Access。RDBMS 中的数据存储在被称为表的数据库对象中。表是相关的数据项的集合，它由列和行组成

接下来我们就一起来使用Node操作MongoDB*(Node操作MySQL将在下一篇介绍)*，并使用它来写一个建议的**图书管理小案例** 

##  Node操作MongoDB

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。下面这个表就展示出来MongoDB与SQL数据库的一个简单比较

| SQL术语/概念    | MongoDB术语/概念 | 解释/说明                   |
| ----------- | ------------ | ----------------------- |
| database    | database     | 数据库                     |
| table       | collection   | 数据库表/集合                 |
| row         | document     | 数据记录行/文档                |
| column      | field        | 数据字段/域                  |
| index       | index        | 索引                      |
| table joins |              | 表连接,MongoDB不支持          |
| primary key | primary key  | 主键,MongoDB自动将_id字段设置为主键 |

MongoDB和Node.js特别配，因为MongoDB是基于文档的，文档是按BSON（JSON的轻量化二进制格式）存储的，增删改查等管理数据库的命令和JavaScript语法很像，这里我们选择[mongoose](http://mongoosejs.com/)来进行增删改查，mongoose构建在MongoDB之上，提供了Schema、Model和Document对象，用起来很方便

### 1. 安装Mongoose

```bash
$ npm install mongoose
```

安装好后 `require('mongoose')`就可以使用了

#### 2.使用Mongoose进行CRUD 

连接数据库

```javascript
const mongoose = require("mongoose")
// 使用原生promise，mongoose自带promise不再支持了
mongoose.Promise = global.Promise

const db=mongoose.connect('mongodb://localhost/test')

db.connection.on("error", function (error) {  
  console.log("数据库连接失败：" + error)
})

db.connection.on("open", function () {  
  console.log("数据库连接成功")
})
```

我们来看看Mongoose的几个名词

- `Schema`  ：  一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
- `Model`   ：  由`Schema`发布生成的模型，具有抽象属性和行为的数据库操作对
- `Entity`  ：  由`Model`创建的实体，他的操作也会影响数据库

**`Schema`生成`Model`，`Model`创造`Entity`，`Model`和`Entity`都可对数据库操作造成影响，但`Model`比`Entity`更具操作性**

关于mongoose最重要的就是理解`Schema` `Model` `Entity` ，它的各种方法直接去查文档使用就好。

**Schema**

schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力

```javascript
const kittySchema = mongoose.Schema({
    name: String
})
```

**Schema.Type**

`Schema.Type`是由`Mongoose`内定的一些数据类型，基本数据类型都在其中，他也内置了一些`Mongoose`特有的`Schema.Type`。当然，你也可以自定义`Schema.Type`，只有满足`Schema.Type`的类型才能定义在`Schema`内

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- Objectid
- Array

**Model**

定义好了Schema，接下就是生成Model。
model是由schema生成的模型，可以对数据库的操作

```javascript
var Kitten = mongoose.model('Kitten', kittySchema)
```

**Entity**
用Model创建Entity，`Entity`可以对数据库操作

```javascript
var silence = new Kitten({ name: 'Silence' })
console.log(silence.name); // 'Silence'
```

#### 查询

```javascript
model.find({},field,callback) // 参数1忽略,或为空对象则返回所有集合文档

model.find({},{'name':1, 'age':0},callback) //过滤查询,参数2: {'name':1, 'age':0} 查询文档的返回结果包含name , 不包含age.(_id默认是1)

model.find({},null,{limit:20}) // 游标操作 limit 限制返回结果数量为20个,如不足20个则返回所有

model.findOne({}, callback) // 查询找到的第一个文档

model.findById('obj._id', callback) // 查询找到的第一个文档, 只接受 _id 的值查询
```

#### 创建

```javascript
// 在集合中创建一个文档
Model.create(doc(s), [callback])

Entity.save(callback)
```

#### 删除

```javascript
Model.remove([criteria], [callback]) // 根据条件查找到并删除

Model.findByIdAndRemove(id, [options], [callback]) // 根据id查找到并删除
```

#### 修改

```javascript
Model.update(conditions, update, [options], [callback]) // 根据参数找到并更新

Model.findByIdAndUpdate(id, [update], [options], [callback])  // 根据id查找到并更新
```

上面简单写了几个常用操作，关于Mongoose的更多使用请移步[官网](http://mongoosejs.com) ，我就不搬了   *(推荐阅读： [Mongoose学习参考文档——基础篇](https://cnodejs.org/topic/504b4924e2b84515770103dd))*

### 图书管理系统

了解了MongoDB以及Mongoose的简单使用，我们一起来实现一个图书管理的小案例，其有最基本的增删改查，同时我们将了解到express的基本使用，同时会认识下模板引擎，*但这些只是简略了解，这节的重点是Mongoose操作MongoDB*

UI采用了漂亮的[UIkit3](http://www.getuikit.net/v3/)

![Node图书管理](http://ommpd2lnj.bkt.clouddn.com/librarian.png)

传送门： [Github](https://github.com/ogilhinn/node-abc/tree/master/lesson8) 

*可以去github拉下来，然后`npm install ` 然后`node index.js`即可跑起来*

#### 1. 准备工作

我们先随便新建一个文件夹，然后在这个目录下

```bash
$ npm init
```

初始化项目完成后使用下载express,mongoose,nunjucks(模板引擎), body-parser(bodyParser中间件用来解析http请求体)

```bash
$ npm install express mongoose nunjucks body-parser --save
```

接下来我们新建index.js文件，在里面将express跑起来

```javascript
const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// 配置模板引擎
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
})
app.set('view engine', 'html')
// 配置bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 路由
app.get('/', (req, res)=>{
    res.send('HELLO mongo')
})

const server = app.listen(3000, function () {
    console.log('app listening at http:localhost:3000')
})
```

现在我们执行`node index.js` 便可以跑起来了，当然更推荐使用以前介绍到的[supervisor](https://github.com/petruisfan/node-supervisor)

这里我们再聊一聊Node web应用的模板引擎，这儿我们用了[nunjucks](http://mozilla.github.io/nunjucks/) 这是mozilla维护的一个模板引擎，他是 [jinja2](http://docs.jinkan.org/docs/jinja2/)的javascript版本，用过python的jinja2一定会感觉很亲切，除此之外，很有很多有些的模板引擎如[ejs](http://ejs.co/)，[jade](https://pugjs.org/api/getting-started.html)。但个人认为jade是反人类的，因此更推荐Nunjucks及ejs。当然了，这取决于大家的喜好，更多模板引擎请自行搜索了解。

我们新建一个views文件夹，放置模板。这儿只需要一个主页显示所有图书index.html，add.html添加图书，edit.html编辑图书，base.html作为基础模板，其他模板文件可以继承它

关于nunjucks，我们以他官网的那一段小代码来简单看一下

```jinja2
{% extends "base.html" %} {# 继承base.html 这是注释 #}

{# 区块 #}
{% block header %}
<h1>{{ title }}</h1>
{% endblock %}

{% block content %}
<ul>
  {# 循环 #}
  {% for name, item in items %}
  <li>{{ name }}: {{ item }}</li>
  {% endfor %}
</ul>
{% endblock %}   
```

更多使用请自行查看[官网](http://mozilla.github.io/nunjucks/)，

#### 2.  功能设计以及路由配置 

这儿我们就来看看，这个小的图书管理系统需要的功能。**增删改查**  *就是新增图书，删除图书，修改图书，显示所有图书*

我们就可以根据这几个功能来配置我们的路由了

```javascript
const express = require('express')
const router = express.Router()

// GET 首页显示全部书籍
router.get('/', (req, res) => {
    
})

// GET 新增书籍
router.get('/add', (req, res) => {
    
})
// POST 新增书籍
router.post('/add', (req, res) => {
    
})

// GET 删除
router.get('/:bookId/remove', (req, res) => {
    
})
// GET 编辑
router.get('/:bookId/edit', (req, res) => {
    
})

// POST 编辑
router.post('/:bookId/edit', (req, res) => {
    
})
```

这儿为了项目结构更清晰，我们不把路由写在index.js中，而是提取到routes目录下，我们新建routes目录，在下面新建book.js ，然后将相关路由全部放到其中并导出，

```javascript
const express = require('express')
const router = express.Router()

···
···
···

module.exports = router // 导出
```

然后新建一个index.js文件

```javascript
module.exports = function (app) {
    app.use('/', require('./book'))
}
```
这儿这样划分，在这可能看不出太多优势，但是在大一点的应用中，我们这样配置可以让功能划分很清晰。

最后我们在入口文件index.js中将路由`require`进去，就可以使用了，

```javascript
···
routes(app)
···
```

到此，前置工作就差不多了，下面我们就可以进入今天的重头戏**Mongoose**

#### 3. 功能实现, Mongoose操作MongoDB

新建lib文件夹，新建mongo.js文件，连接数据库，在其中定义 Schema 并发布为model

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

// MongoDB会自动建立books数据库
const db = mongoose.connect('mongodb://localhost:27017/books')

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error)
})

db.connection.on("open", function () {
    console.log("数据库连接成功")
})

const BookSchema = Schema({
    title: {
        unique: true, // 唯一的不可重复
        type: 'String', // Schema.Type String类型
    },
    summary: 'String',
    price: 'Number',
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        }
    }
})

exports.Book = mongoose.model('Book', BookSchema)
```

新建Models文件夹，在其中新建books.js放置对MongoDB 的一些操作，这里面使用了promise，如果还不会那你就得去补补了

```javascript
const Book = require('../lib/mongo').Book

module.exports = {
    getBooks(){
        return Book
            .find({})
            .sort({_id: -1})
            .exec()
    },
    getBook(id){
        return Book
            .findById(id)
            .exec()
    },
    editBook(id, data){
        return Book
        .findByIdAndUpdate(id, data)
        .exec()
    },
    addBook(book){
        return Book.create(book)
    },
    delBook(id){
        return Book
            .findByIdAndRemove(id)
            .exec()
    }
}
```

这里面的一些方法，我们在前面讲Mongoose的时候都了解过了，想了解的更多还是推荐去[官网看看](http://mongoosejs.com/)

最后我们就是根据不同的路由进行不同的处理了

```javascript
const express = require('express')
const router = express.Router()
const BookModel = require('../models/books')

router.get('/', (req, res) => {
    BookModel.getBooks()
    .then((books) => {
        res.render('index', {books})
    })
})

router.get('/add', (req, res) => {
    res.render('add')
})

router.post('/add', (req, res) => {
    let book = req.body
    BookModel.addBook(book)
    .then((result) => {
        res.redirect('/')
    })
})

router.get('/:bookId/remove', (req, res) => {
    BookModel.delBook(req.params.bookId)
    .then((book) => {
        res.redirect('/')
    })
})


router.get('/:bookId/edit', (req, res) => {
    let book = req.body
    BookModel.getBook(req.params.bookId)
    .then((book) => {
        res.render('edit', { 
            book,
            bookid: req.params.bookId
         })
    })
})

router.post('/:bookId/edit', (req, res) => {
    let book = req.body
    BookModel.editBook(req.params.bookId, book)
    .then((result)=>{
        res.redirect('/')
    })
})

module.exports = router
```

OK!!!到此，我们这小项目基本就算完成了。代码详见[GitHub](https://github.com/ogilhinn/node-abc/tree/master/lesson8) 作为一个学习案例，这算完成了，但其中可以优化完善的地方还很多，大家可以自行探索···

**抛砖引玉**

### 相关连接
- [express](http://www.expressjs.com.cn/)
- [mongoose](http://mongoosejs.com)
- [bodyParser](https://github.com/expressjs/body-parser)
- [JavaScript Promise迷你书中文版](http://liubin.org/promises-book/)