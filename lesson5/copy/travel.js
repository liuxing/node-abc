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
            travelSync(pathname, callback)
        } else {
            callback(pathname)
        }
    })
}

module.exports = travelSync