const http = require('http')
let options = {
    hostname: 'www.example.com',
    port: 80,
    path: '/',
    method: 'GET'
}

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
        console.log(`主体: ${chunk}`)
    })

})

req.end()