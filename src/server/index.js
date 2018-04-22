/* eslint-disable no-console */
const Koa = require("koa")
const http = require("http")
const SocketIO = require("socket.io")
const shortid = require("shortid")

const { PERMISSIONS } = require("./constants")

const {
  emitClientCountByTournamentId,
  getTournamentIdBySocket,
} = require("./utils")

const app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

app.context.io = io

const store = {
  tokenToAccessMap: {},
  tournamentIdToTournamentMap: {},
}

io.on("connection", socket => {
  socket.on("doCreateTournament", (token, domain) => {
    if (!store.tokenToAccessMap[token]) {
      const tournamentId = shortid()

      store.tokenToAccessMap[token] = [tournamentId, PERMISSIONS.ORGANIZER]
      store.tournamentIdToTournamentMap[tournamentId] = {
        domain,
        remote: {
          created: +new Date(),
          lastModified: +new Date(),
        },
      }

      socket.join(tournamentId)
      emitClientCountByTournamentId(io, tournamentId)
    } else {
      socket.emit("tokenAlreadyExists")
    }
  })

  socket.on("requestTournamentState", token => {
    const access = store.tokenToAccessMap[token]

    if (access) {
      const [tournamentId] = access
      const tournament = store.tournamentIdToTournamentMap[tournamentId]

      socket.emit("tournamentState", tournament)
    } else {
      socket.emit("tournamentDoesNotExist")
    }
  })

  socket.on("tournamentClosed", token => {
    const access = store.tokenToAccessMap[token]

    if (access) {
      const [tournamentId] = access
      socket.leave(tournamentId)
      emitClientCountByTournamentId(io, tournamentId)
    }
  })

  socket.on("tournamentOpened", (token, lastModifiedLocally) => {
    const access = store.tokenToAccessMap[token]

    if (access) {
      const [tournamentId] = access

      socket.join(tournamentId)
      emitClientCountByTournamentId(io, tournamentId)

      const tournament = store.tournamentIdToTournamentMap[tournamentId]

      if (lastModifiedLocally > tournament.remote.lastModified) {
        socket.emit("requestTournamentState")
      } else {
        socket.emit("tournamentState", tournament)
      }
    } else {
      socket.emit("tournamentDoesNotExist")
    }
  })

  socket.on("tournamentState", (token, tournamentState) => {
    const access = store.tokenToAccessMap[token]

    if (access) {
      const [tournamentId, permissions] = access

      if (permissions === PERMISSIONS.ORGANIZER) {
        const tournament = store.tournamentIdToTournamentMap[tournamentId]
        tournament.domain = tournamentState.domain
        tournament.remote.lastModified = tournamentState.local.lastModified
      }
    }
  })

  socket.on("tournamentScore", (token, payload) => {
    const { roundIndex, matchIndex, side, score } = payload

    const access = store.tokenToAccessMap[token]

    if (access) {
      const [tournamentId, permissions] = access

      if (permissions === PERMISSIONS.ORGANIZER) {
        const tournament = store.tournamentIdToTournamentMap[tournamentId]
        const lastModified = +new Date()

        tournament.domain.results[roundIndex][matchIndex][side].score = score
        tournament.remote.lastModified = lastModified

        io
          .to(tournamentId)
          .emit("tournamentScore", { ...payload, lastModified })
      }
    }
  })

  socket.on("disconnecting", () => {
    const tournamentId = getTournamentIdBySocket(socket)

    if (tournamentId) {
      socket.leave(tournamentId)
      emitClientCountByTournamentId(io, tournamentId)
    }
  })
})

server.listen(3001)
