const http = require('http') //引入http模块

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => { //创建一个http服务器
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}`)
})
