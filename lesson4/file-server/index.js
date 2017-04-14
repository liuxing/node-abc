const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const mime = require('mime') // 处理mime

const hostname = '127.0.0.1'
const port = 3000
const server = http.createServer((req, res) => { //创建一个http服务器
    if (req.url == '/favicon.ico') return //不响应favicon请求
    // 获取url->patnname 即文件名
    let pathname = path.join(__dirname, url.parse(req.url).pathname)
    pathname = decodeURIComponent(pathname)
    // console.log(pathname)

    /**
     * 判断文件是否是文件夹
     * 是：返回文件列表
     * 否：读取文件内容
     */
    if (fs.statSync(pathname).isDirectory()) {
        // 设置响应头
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        fs.readdir(pathname, (err, files) => {
            res.write('<ul>')
            files.forEach((item) => {
                let link = path.join(url.parse(req.url).pathname, item)
                res.write(`<li><a href="${link}">${item}</a></li>`)
            })
            res.end('</ul>')
        })
    } else {
        // 以binary读取文件
        fs.readFile(pathname, 'binary', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' })
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
})

server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}`)
})