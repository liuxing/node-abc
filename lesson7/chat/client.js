const net = require('net')
process.stdin.resume()
process.stdin.setEncoding('utf8');
const client = net.connect({ port: 8080 }, () => {
    console.log('Connected to server')
    // 获取输入的字符串
    console.log('input: ')
    process.stdin.on('data', (data) => {
        // 发送输入的字符串到服务器
        console.log('input: ')
        client.write(data)
        // 输入 'close' 字符串时关闭连接
        if (data === 'close\n') {
            client.end()
        }
    });
});
// 获取服务端发送过来的数据
client.on('data', (data) => {
    console.log('Other user\'s input', data.toString())
})
client.on('end', () => {
    console.log('Disconnected from server')
    // 退出客户端程序
    process.exit()
})