const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise
const db = mongoose.connect('mongodb://localhost:27017/books')

db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error)
})

db.connection.on("open", function () {
    console.log("数据库连接成功")
})

const BookSchema = Schema({
    title: {
        unique: true,
        type: 'String',
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