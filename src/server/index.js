/* eslint-disable no-console */
const Koa = require("koa")
const http = require("http")
const SocketIO = require("socket.io")
const shortid = require("shortid")
const R = require("ramda")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

app.context.io = io

const PERMISSIONS = {
  ORGANIZER: "ORGANIZER",
  SPECTATOR: "SPECTATOR",
}

const store = {
  tokenToPermissionsMap: {},
  idToTournamentMap: {},
}

const getTournamentIdBySocket = socket =>
  R.compose(
    R.head,
    R.filter(R.complement(R.equals(socket.id))),
    R.keys,
    R.prop("rooms")
  )(socket)

const getRoomClientCountById = (io, id) =>
  R.compose(
    R.length,
    R.defaultTo([]),
    R.path(["sockets", "adapter", "rooms", id])
  )(io)

io.on("connection", socket => {
  socket.on("tournamentCreated", (token, domain) => {
    if (!store.tokenToPermissionsMap[token]) {
      const id = shortid()

      socket.join(id)
      io.to(id).emit("updateClientCount", 1)

      store.tokenToPermissionsMap[token] = [id, PERMISSIONS.ORGANIZER]
      store.idToTournamentMap[id] = domain
    } else {
      socket.emit("tokenAlreadyExists")
    }
  })

  socket.on("tournamentLoaded", token => {
    const permissions = store.tokenToPermissionsMap[token]

    if (permissions) {
      const [id] = permissions
      socket.join(id)
      io.to(id).emit("updateClientCount", getRoomClientCountById(io, id))
    } else {
      socket.emit("tournamentDoesNotExist")
    }
  })

  socket.on("disconnecting", () => {
    const id = getTournamentIdBySocket(socket)

    if (id) {
      socket.leave(id)
      io.to(id).emit("updateClientCount", getRoomClientCountById(io, id))
    }
  })
})

server.listen(3001)
