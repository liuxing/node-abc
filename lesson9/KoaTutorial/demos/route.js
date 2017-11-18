const Koa = require('koa')
const app = new Koa()

app.use(async ctx => {
  let _html = '404 NotFound'
  switch (ctx.url) {
    case '/':
      _html = '<h1>Index</h1>'
      break
    case '/adout':
      _html = '<h1>About</h1>'
      break
    case '/hello':
      _html = '<h1>world</h1>'
      break
    default:
      break
  }
  ctx.body = _html
})

app.listen(3000)