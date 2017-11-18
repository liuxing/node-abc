const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa()

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs',
}))

app.use(async (ctx) => {
  let title = 'Koa2'
  await ctx.render('index', {
    title,
  })
})

app.listen(3000)