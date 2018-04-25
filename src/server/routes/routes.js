const mongoose = require("mongoose")
const shortid = require("shortid")

const { PERMISSIONS } = require("../../common")
const { Tournament, Access } = require("../models")

module.exports = io => {
  io.on("connection", socket => {
    // UTILITY
    const getCurrentRooms = () =>
      Object.keys(socket.rooms).filter(room => room !== socket.id)

    const getRoomClientCountByTournamentId = tournamentId =>
      (io.sockets.adapter.rooms[tournamentId] || []).length

    const emitClientCountByTournamentId = id =>
      io.to(id).emit("clientCount", getRoomClientCountByTournamentId(id))

    const joinRoom = access => {
      leaveAllRooms()
      const tournamentId = access.tournament
      socket.join(tournamentId)
      emitClientCountByTournamentId(tournamentId)
    }

    const leaveAllRooms = () =>
      getCurrentRooms().forEach(room => socket.leave(room))

    const emitTournamentState = async (token, tournament) =>
      socket.emit("tournamentState", {
        accesses: await Access.findEligibleAccessesByToken(token),
        domain: tournament.domain,
        meta: tournament.meta,
      })

    // HANDLERS
    socket.on("disconnecting", leaveAllRooms)

    socket.on("requestTournamentState", async token => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      joinRoom(access)

      const tournament = await Tournament.findByAccess(access)
      await emitTournamentState(token, tournament)
    })

    socket.on("tournamentClosed", async () => {
      leaveAllRooms()
    })

    socket.on("tournamentOpened", async (token, lastModified) => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      joinRoom(access)
      const tournament = await Tournament.findByAccess(access)

      if (access.isSpectator()) {
        return await emitTournamentState(token, tournament)
      }

      const localIsNewer =
        !tournament || lastModified > tournament.meta.lastModified

      if (localIsNewer) {
        socket.emit("requestTournamentState")
      } else {
        await emitTournamentState(token, tournament)
      }
    })

    socket.on("tournamentScore", async (token, payload) => {
      const { roundIndex, matchIndex, side, score } = payload

      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      if (access.isSpectator()) {
        return
      }

      const tournament = await Tournament.findByAccess(access)

      tournament.domain.results[roundIndex][matchIndex][side].score = score
      tournament.markModified("domain")

      await tournament.save()

      io.to(tournament._id).emit("tournamentScore", {
        ...payload,
        lastModified: tournament.meta.lastModified,
      })
    })

    socket.on("tournamentState", async (token, state) => {
      const access = await Access.findByToken(token)

      if (!access) {
        const tournamentId = new mongoose.Types.ObjectId()

        const creatorAccess = new Access({
          permissions: PERMISSIONS.CREATOR,
          token,
          tournament: tournamentId,
        })

        const spectatorAccess = new Access({
          permissions: PERMISSIONS.SPECTATOR,
          token: shortid.generate(),
          tournament: tournamentId,
        })

        const tournament = new Tournament({
          _id: tournamentId,
          domain: state.domain,
        })

        await creatorAccess.save()
        await spectatorAccess.save()
        await tournament.save()

        joinRoom(creatorAccess)

        return await emitTournamentState(token, tournament)
      }

      // Tournament exists
      if (access.isSpectator()) {
        return
      }

      const tournament = await Tournament.findByAccess(access)

      tournament.domain = state.domain
      tournament.markModified("domain")

      await tournament.save()
    })
  })
}
