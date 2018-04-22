/* eslint-disable no-console */
const Koa = require("koa")
const http = require("http")
const SocketIO = require("socket.io")
const mongoose = require("mongoose")
const attachRoutes = require("./routes")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

mongoose.connect("mongodb://localhost/test")

app.context.io = io

attachRoutes(io)

server.listen(3001)
