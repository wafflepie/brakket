/* eslint-disable no-console */
const Koa = require("koa")
const serve = require("koa-static")
const helmet = require("koa-helmet")
const http = require("http")
const SocketIO = require("socket.io")
const mongoose = require("mongoose")
const path = require("path")

const attachRoutes = require("./routes")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/test")

app.context.io = io

app.use(helmet())
app.use(serve(path.join(__dirname, "../../dist")))

attachRoutes(io)

server.listen(process.env.PORT || 3001)
