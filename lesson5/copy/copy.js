const fs = require('fs')
const file = fs.readFileSync('./README.md', {encoding: 'utf8'})
fs.writeFileSync('./TEST.md', file)