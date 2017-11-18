const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  const url = ctx.url
  const query = ctx.query
  const querystring = ctx.querystring

  ctx.body = {
    url,
    query,
    querystring,
  }
})

app.listen(3000)