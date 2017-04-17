const fs = require("fs");
const zlib = require('zlib')

// 压缩 README.md 文件为 README.md.gz
fs.createReadStream('./README.md')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('README.md.gz'))
  
console.log("文件压缩完成")