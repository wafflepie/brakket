/* eslint-disable no-console */
const Koa = require("koa")
const path = require("path")
const serve = require("koa-static")
const http = require("http")
const SocketIO = require("socket.io")
const mongoose = require("mongoose")

const attachRoutes = require("./routes")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/test")

app.context.io = io

app.use(serve(path.join(__dirname, "../../dist")))

attachRoutes(io)

server.listen(process.env.PORT || 3001)
