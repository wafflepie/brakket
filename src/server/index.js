const Koa = require("koa")

const app = new Koa()
const server = require("http").createServer(app.callback())
const io = require("socket.io")(server)

app.context.io = io

server.listen(3001)
