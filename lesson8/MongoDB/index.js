const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')

app.use(express.static(path.join(__dirname, 'public')))
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
})
app.set('view engine', 'html')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
routes(app)

const server = app.listen(3000, function () {
    console.log('app listening at http:localhost:3000')
})