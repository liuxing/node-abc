# Node操作数据库

> Web应用离不开数据库的操作，我们将了解Node操作[MongoDB](https://www.mongodb.com/)与[MySQL](https://www.mysql.com/)，这是两个具有代表性的数据库，非关系型数据库*(*NoSQL*)*及关系型数据库*(SQL)*

## 关系型数据库与非关系型数据库

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

接下来我们就一起来使用Node操作MongoDB*(下一篇介绍Node操作MySQL)*，并使用它来写一个建议的**图书管理小案例**

##  Node操作MongoDB

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。
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

**Schema**

schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义；每个schema会映射到mongodb中的一个collection，它不具备操作数据库的能力

```javascript
const kittySchema = mongoose.Schema({
    name: String
})
```

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
Model.remove([criteria], [callback]) // 参数1:查询条件
```

#### 修改

```javascript
Model.update(conditions, update, [options], [callback])
```

关于Mongoose的更多使用请移步[官网](http://mongoosejs.com)     *(推荐阅读： [Mongoose学习参考文档——基础篇](https://cnodejs.org/topic/504b4924e2b84515770103dd))*

### 图书管理



后续：Node操作MySQL