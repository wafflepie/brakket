const mongoose = require("mongoose")
const R = require("ramda")

const { PERMISSIONS } = require("../constants")
const { Tournament, Access } = require("../models")

module.exports = io => {
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
      const currentTournamentId = getCurrentTournamentId()
      socket.leave(currentTournamentId)

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

    // HANDLERS
    socket.on("disconnecting", () => {
      leaveRoom(getCurrentTournamentId(socket))
    })

    socket.on("doCreateTournament", async (token, domain) => {
      if (await Access.findOne({ token })) {
        socket.emit("tokenAlreadyExists")
      } else {
        const tournamentId = new mongoose.Types.ObjectId()

        joinRoom(tournamentId)

        const access = new Access({
          permissions: PERMISSIONS.ORGANIZER,
          token,
          tournamentId,
        })

        const tournament = new Tournament({
          _id: tournamentId,
          domain,
        })

        await access.save()
        await tournament.save()
      }
    })

    socket.on("requestTournamentState", async token => {
      const tournament = await Access.findTournamentByToken(token)

      tournament
        ? socket.emit("tournamentState", tournament)
        : socket.emit("tournamentDoesNotExist")
    })

    socket.on("tournamentClosed", async token => {
      const tournamentId = await Access.findTournamentIdByToken(token)
      tournamentId && leaveRoom(tournamentId)
    })

    socket.on("tournamentOpened", async (token, lastModifiedLocally) => {
      const tournamentId = await Access.findTournamentIdByToken(token)

      if (tournamentId) {
        joinRoom(tournamentId)
        const tournament = await Access.findTournamentByToken(token)

        // lastModifiedLocally may be undefined if it was never opened client-side
        if (!tournament || lastModifiedLocally > tournament.lastModified) {
          socket.emit("requestTournamentState")
        } else {
          socket.emit("tournamentState", tournament)
        }
      } else {
        socket.emit("tournamentDoesNotExist")
      }
    })

    socket.on("tournamentScore", async (token, payload) => {
      const { roundIndex, matchIndex, side, score } = payload

      if (await Access.isTokenOrganizer(token)) {
        const tournament = await Access.findTournamentByToken(token)

        if (tournament) {
          tournament.domain.results[roundIndex][matchIndex][side].score = score

          await tournament.save()

          io.to(tournament._id).emit("tournamentScore", {
            ...payload,
            lastModified: tournament.lastModified,
          })
        } else {
          socket.emit("tournamentDoesNotExist")
        }
      }
    })

    socket.on("tournamentState", async (token, state) => {
      if (await Access.isTokenOrganizer(token)) {
        const tournament = await Access.findTournamentByToken(token)

        if (tournament) {
          tournament.domain = state.domain
          await tournament.save()
        } else {
          socket.emit("tournamentDoesNotExist")
        }
      }
    })
  })
}
