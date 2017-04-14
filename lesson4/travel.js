const fs = require('fs')
const path = require('path')

/**
 * 目录遍历 - 同步版
 * @param {string} dir 
 * @param {func} callback 
 */
function travelSync(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file)

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

/**
 * 目录遍历 - 异步版
 * @param {string} dir 
 * @param {func} callback 
 * @param {func} finish 
 */
function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                let pathname = path.join(dir, files[i])

                fs.stat(pathname, function (err, stats) {               
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function () {
                            next(i + 1)
                        })
                    } else {
                        callback(pathname)                   
                        next(i + 1)
                    }
                })
            } else {
                finish && finish()
            }
        }(0))
    })
}