# Node操作MySQL

> [上一篇]()我们主要介绍了Node操作MongoDB，比较了关系型数据库与非关系型数据库，并简单认识了MongoDB与MySQL这两个颇具代表性的数据库。这一节，我们将主要了解Node操作MySQL。

## 再讲讲 MySQL

MySQL是一个关系型数据库管理系统*(RDBMS )*，由瑞典MySQL AB公司开发，目前属于Oracle公司。MySQL是一种关联数据库管理系统。MySQL是相当优秀的数据库。

所谓关系型数据库，可以理解成“表格”吧，一个关系型数据库由一个或数个表格组成：

| id   | name     | age  |
| ---- | -------- | ---- |
| 0    | 流口水流     | 21   |
| 1    | liu      | 22   |
| 2    | ogilhinn | 23   |

看看这个表格，MySQL就是这样的结构：
- **表头(header)**: 每一列的名称
- **列(row)**: 具有相同数据类型的数据的集合
- **行(col)**: 每一行用来描述某个人/物的具体信息
- **值(value)**: 行的具体信息, 每个值必须与该列的数据类型相同
- **键(key)**: 即表中的id，表中用来识别某个特定的人\物的方法, 键的值在当前列中具有唯一性


### MySQL安装

请直接去官网看看[MySQL](https://dev.mysql.com/downloads/)

*由于这是续篇，所以这里就不在赘述。直接进入重点*

## Node 操作 MySQL

这里我们将用到[mysql](https://github.com/mysqljs/mysql)这个库来实现，node与mysql的交互。

```javascript
$ npm install mysql
```

**1. 连接MySQL**

MySQL不会像mongodb那样自动建立一个数据库，你在使用这数据库前，你要先自己新创建个。

在MySQL命令行执行下面的命令，建立个test数据库，后面的所有操作都将在这个中间完成

```bash
create database test # 创建test数据库

use test # 使用test
```

```javascript
const mysql      = require('mysql')
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error
  console.log('The solution is: ', results[0].solution)
})

connection.end()
```

 未完待续~~~

 未完待续~~~

 未完待续~~~

 未完待续~~~

 未完待续~~~

##  相关链接

- [个人博客](http://www.xingxin.me/)
- [MySQL菜鸟教程](http://www.runoob.com/mysql/mysql-tutorial.html)