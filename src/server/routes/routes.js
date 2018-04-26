const mongoose = require("mongoose")
const shortid = require("shortid")
const R = require("ramda")

const { PERMISSIONS } = require("../../common")
const { Tournament, Access } = require("../models")

module.exports = io => {
  io.on("connection", socket => {
    socket.access = null
    socket.focus = null

    // UTILITY
    const getSocketsByTournamentId = tournamentId =>
      R.compose(
        R.map(socketId => io.sockets.connected[socketId]),
        R.keys,
        R.path(["sockets", "adapter", "rooms", tournamentId, "sockets"])
      )(io)

    const joinRoom = access => {
      leaveAllRooms()
      const tournamentId = access.tournament
      socket.join(tournamentId)
      socket.access = access

      emitClients(true)
    }

    const leaveAllRooms = () => {
      Object.keys(socket.rooms)
        .filter(room => room !== socket.id)
        .forEach(room => socket.leave(room))

      emitClients()
    }

    const emitTournamentState = async (tournament, emitter = socket) => {
      const accesses = await Access.findEligibleAccessesByToken(
        emitter.access.token
      )

      emitter.emit("tournamentState", {
        accesses,
        domain: tournament.domain,
        meta: tournament.meta,
      })
    }

    const emitClients = (includeSender = false) => {
      if (!socket.access) {
        return
      }

      const tournamentId = socket.access.tournament
      const sockets = getSocketsByTournamentId(tournamentId)

      // emit only to sockets which are not the source of focusing
      // unless includeSender is true and we want to send him the initial data
      sockets
        .filter(other => includeSender || other.id !== socket.id)
        .forEach(targetSocket => {
          // remove the socket we are emitting to from the list
          const payloadSockets = sockets.filter(
            other => other.id !== targetSocket.id
          )

          const payload = payloadSockets.map(payloadSocket => ({
            focus: payloadSocket.focus,
            id: payloadSocket.id,
            name: payloadSocket.access.name,
            permissions: payloadSocket.access.permissions,
          }))

          targetSocket.emit("clients", payload)
        })
    }

    // HANDLERS
    socket.on("disconnecting", leaveAllRooms)

    socket.on("requestTournamentState", async token => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      joinRoom(access)

      const tournament = await Tournament.findByAccess(access)
      await emitTournamentState(tournament)
    })

    socket.on("scoreBlur", () => {
      socket.focus = null
      emitClients()
    })

    socket.on("scoreFocus", payload => {
      socket.focus = payload
      emitClients()
    })

    socket.on("tournamentClosed", leaveAllRooms)

    socket.on("tournamentOpened", async (token, lastModified) => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      joinRoom(access)
      const tournament = await Tournament.findByAccess(access)

      if (access.isSpectator()) {
        return await emitTournamentState(tournament)
      }

      const localIsNewer =
        !tournament || lastModified > tournament.meta.lastModified

      if (localIsNewer) {
        socket.emit("requestTournamentState")
      } else {
        await emitTournamentState(tournament)
      }
    })

    socket.on("tournamentScore", async payload => {
      const { roundIndex, matchIndex, side, score } = payload

      if (!socket.access) {
        return socket.emit("tournamentDoesNotExist")
      }

      if (socket.access.isSpectator()) {
        return
      }

      const tournament = await Tournament.findByAccess(socket.access)

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
          name: null,
          permissions: PERMISSIONS.CREATOR,
          token,
          tournament: tournamentId,
        })

        const spectatorAccess = new Access({
          name: null,
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

        return await emitTournamentState(tournament)
      }

      // Tournament exists
      if (access.isSpectator()) {
        return
      }

      const tournament = await Tournament.findByAccess(access)

      tournament.domain = state.domain
      tournament.markModified("domain")

      await tournament.save()

      // this informs all sockets (viewing the tournament) of the changed state
      getSocketsByTournamentId(tournament._id).forEach(socket =>
        emitTournamentState(tournament, socket)
      )
    })
  })
}
