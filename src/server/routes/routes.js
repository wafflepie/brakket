const mongoose = require("mongoose")

const { PERMISSIONS } = require("../../common")
const { Tournament, Access } = require("../models")

module.exports = io => {
  io.on("connection", socket => {
    // UTILITY
    const getCurrentTournamentId = () =>
      Object.keys(socket.rooms).filter(room => room !== socket.id)[0]

    const getRoomClientCountByTournamentId = id =>
      (io.sockets.adapter.rooms[id] || []).length

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

    const emitTournamentState = async (token, tournament) =>
      socket.emit("tournamentState", {
        accesses: await Access.findEligibleAccessesByToken(token),
        domain: tournament.domain,
        meta: tournament.meta,
      })

    // HANDLERS
    socket.on("disconnecting", () => {
      leaveRoom(getCurrentTournamentId(socket))
    })

    socket.on("requestTournamentState", async token => {
      const tournament = await Access.findTournamentByToken(token)

      if (tournament) {
        joinRoom(tournament._id)
        await emitTournamentState(token, tournament)
      } else {
        socket.emit("tournamentDoesNotExist")
      }
    })

    socket.on("tournamentClosed", async token => {
      const tournamentId = await Access.findTournamentIdByToken(token)
      tournamentId && leaveRoom(tournamentId)
    })

    socket.on("tournamentOpened", async (token, lastModified) => {
      const tournamentId = await Access.findTournamentIdByToken(token)

      if (tournamentId) {
        joinRoom(tournamentId)
        const tournament = await Access.findTournamentByToken(token)

        // lastModified may be undefined if it was never opened client-side
        if (!tournament || lastModified > tournament.meta.lastModified) {
          socket.emit("requestTournamentState")
        } else {
          await emitTournamentState(token, tournament)
        }
      } else {
        socket.emit("tournamentDoesNotExist")
      }
    })

    socket.on("tournamentScore", async (token, payload) => {
      const { roundIndex, matchIndex, side, score } = payload

      if (await Access.isTokenCreator(token)) {
        const tournament = await Access.findTournamentByToken(token)

        if (tournament) {
          tournament.domain.results[roundIndex][matchIndex][side].score = score
          tournament.markModified("domain")

          await tournament.save()

          io.to(tournament._id).emit("tournamentScore", {
            ...payload,
            lastModified: tournament.meta.lastModified,
          })
        } else {
          socket.emit("tournamentDoesNotExist")
        }
      }
    })

    socket.on("tournamentState", async (token, state) => {
      if (await Access.isTokenCreator(token)) {
        const tournament = await Access.findTournamentByToken(token)

        if (tournament) {
          tournament.domain = state.domain
          tournament.markModified("domain")

          await tournament.save()
        }
      } else {
        const tournamentId = new mongoose.Types.ObjectId()

        joinRoom(tournamentId)

        const access = new Access({
          permissions: PERMISSIONS.CREATOR,
          token,
          tournament: tournamentId,
        })

        const tournament = new Tournament({
          _id: tournamentId,
          domain: state.domain,
        })

        await access.save()
        await tournament.save()
      }
    })
  })
}
