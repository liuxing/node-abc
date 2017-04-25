const http = require('http')
const readline = require('readline')
const cheerio = require('cheerio')

// 先来实现一个可交互命令行
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'search>>> '
})

rl.prompt() // 为用户提供一个可供输入的新的位置

rl.on('line', (line) => {
    console.log(`正在搜索${line}`)
    search(line.trim(), ()=>{
        rl.prompt()
    })
}).on('close', () => {
    console.log('再见!')
    process.exit(0)
})


function search(words, callback=null) {
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
            callback && callback()
        })
    })
    req.end() // end方法结束请求
}