const shortid = require("shortid")
const R = require("ramda")

const { PERMISSIONS } = require("../constants")

module.exports = (io, store) => {
  io.on("connection", socket => {
    // UTILITY
    const getCurrentTournamentId = () =>
      R.compose(
        R.head,
        R.filter(R.complement(R.equals(socket.id))),
        R.keys,
        R.prop("rooms")
      )(socket)

    const getRoomClientCountByTournamentId = id =>
      R.compose(
        R.length,
        R.defaultTo([]),
        R.path(["sockets", "adapter", "rooms", id])
      )(io)

    const emitClientCountByTournamentId = id =>
      io.to(id).emit("clientCount", getRoomClientCountByTournamentId(id))

    const joinRoom = tournamentId => {
      if (tournamentId) {
        socket.join(tournamentId)
        emitClientCountByTournamentId(tournamentId)
      }
    }

    const leaveRoom = tournamentId => {
      if (tournamentId) {
        socket.leave(tournamentId)
        emitClientCountByTournamentId(tournamentId)
      }
    }

    const getTournamentIdByToken = token =>
      R.path(["tokenToAccessMap", token, 0], store)

    const getTournamentByToken = token =>
      R.path(
        ["tournamentIdToTournamentMap", getTournamentIdByToken(token)],
        store
      )

    const isTokenOrganizer = token =>
      R.equals(
        R.path(["tokenToAccessMap", token, 1], store),
        PERMISSIONS.ORGANIZER
      )

    // HANDLERS
    socket.on("disconnecting", () => {
      leaveRoom(getCurrentTournamentId(socket))
    })

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
      } else {
        socket.emit("tokenAlreadyExists")
      }
    })

    socket.on("requestTournamentState", token => {
      const tournament = getTournamentByToken(token)

      token
        ? socket.emit("tournamentState", tournament)
        : socket.emit("tournamentDoesNotExist")
    })

    socket.on("tournamentClosed", token => {
      const tournamentId = getTournamentIdByToken(token)
      tournamentId && leaveRoom(tournamentId)
    })

    socket.on("tournamentOpened", (token, lastModifiedLocally) => {
      const tournamentId = getTournamentIdByToken(token)

      if (tournamentId) {
        joinRoom(tournamentId)
        const tournament = getTournamentByToken(token)

        if (lastModifiedLocally > tournament.remote.lastModified) {
          socket.emit("requestTournamentState")
        } else {
          socket.emit("tournamentState", tournament)
        }
      } else {
        socket.emit("tournamentDoesNotExist")
      }
    })

    socket.on("tournamentScore", (token, payload) => {
      const { roundIndex, matchIndex, side, score } = payload

      if (isTokenOrganizer(token)) {
        const tournamentId = getTournamentIdByToken(token)
        const tournament = getTournamentByToken(token)
        const lastModified = +new Date()

        tournament.domain.results[roundIndex][matchIndex][side].score = score
        tournament.remote.lastModified = lastModified

        io
          .to(tournamentId)
          .emit("tournamentScore", { ...payload, lastModified })
      }
    })

    socket.on("tournamentState", (token, tournamentState) => {
      if (isTokenOrganizer(token)) {
        const tournament = getTournamentByToken(token)
        tournament.domain = tournamentState.domain
        tournament.remote.lastModified = tournamentState.local.lastModified
      }
    })
  })
}
