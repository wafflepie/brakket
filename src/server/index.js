/* eslint-disable no-console */
const Koa = require("koa")
const http = require("http")
const SocketIO = require("socket.io")
const attachRoutes = require("./routes")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

app.context.io = io

const store = {
  tokenToAccessMap: {},
  tournamentIdToTournamentMap: {},
}

attachRoutes(io, store)

server.listen(3001)
