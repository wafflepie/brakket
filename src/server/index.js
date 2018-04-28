/* eslint-disable no-console */
const Koa = require("koa")
const path = require("path")
const serve = require("koa-static")
const http = require("http")
const SocketIO = require("socket.io")
const mongoose = require("mongoose")
const { createReadStream } = require("fs")

const attachRoutes = require("./routes")

const DIST_PATH = path.join(__dirname, "../../dist")
const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/test")

app.context.io = io

app.use(serve(DIST_PATH))

app.use(async ctx => {
  ctx.type = "html"
  ctx.body = createReadStream(path.join(DIST_PATH, "index.html"))
})

attachRoutes(io)

server.listen(process.env.PORT || 3001)
