// @TODO 图书管理
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

const server = app.listen(3000, function () {
  let host = server.address().address
  let port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})