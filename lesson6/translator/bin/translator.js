#! /usr/bin/env node

const program = require('commander')
const Table = require('cli-table2') // 表格输出
const superagent = require('superagent') // http请求

program
    .allowUnknownOption()
    .version('0.0.1')
    .usage('translator <cmd> [input]')

const API = 'http://fanyi.youdao.com/openapi.do?keyfrom=toaijf&key=868480929&type=data&doctype=json&version=1.1'


program
    .command('query')
    .description('翻译输入')
    .action(function(word) {
        // 发起请求
        superagent.get(API)
        .query({ q: word})
        .end(function (err, res) {
            if(err){
                console.log('excuse me, try again')
                return false
            }
            let data = JSON.parse(res.text)
            let result = {}

            // 返回的数据处理
            if(data.basic){
                result[word] = data['basic']['explains']
            }else if(data.translation){
                result[word] = data['translation']
            }else {
                console.error('error')
            }

            // 输出表格
            let table = new Table()
            table.push(result)
            console.log(table.toString())
        })
    })

if (!process.argv[2]) {
    program.help();
    console.log();
}

program.parse(process.argv)