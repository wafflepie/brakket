const mongoose = require("mongoose")
const shortid = require("shortid")
const R = require("ramda")

const { PERMISSIONS } = require("../../common")
const { Tournament, Access } = require("../models")
const utils = require("./utils")

module.exports = io => {
  io.on("connection", socket => {
    socket.access = null
    socket.focus = null

    socket.on("accessName", async ({ token, value }) => {
      if (!socket.access || !socket.access.isCreator()) {
        return
      }

      const access = await Access.findByToken(token)

      if (!access || !socket.access.tournament.equals(access.tournament)) {
        return
      }

      const tournamentId = access.tournament

      access.name = value
      await access.save()

      const sockets = utils.getSocketsByTournamentId(io, tournamentId)

      sockets
        .filter(other => other.access.token === token)
        .forEach(socketToFix => {
          socketToFix.access.name = value
        })

      const tournament = await Tournament.findById(tournamentId)

      utils.emitTournamentStateToAllSockets(io, tournament)
      utils.emitClientsToAllSockets(io, tournamentId)
    })

    socket.on("addOrganizer", async () => {
      if (!socket.access || !socket.access.isCreator()) {
        return
      }

      const tournamentId = socket.access.tournament

      const organizerAccess = new Access({
        name: null,
        permissions: PERMISSIONS.ORGANIZER,
        token: R.times(shortid.generate, 2).join(""),
        tournament: tournamentId,
      })

      await organizerAccess.save()

      const tournament = await Tournament.findById(tournamentId)

      utils.emitTournamentStateToAllSockets(io, tournament)
    })

    socket.on("disconnecting", () => utils.leaveAllRooms(io, socket))

    socket.on("removeOrganizer", async token => {
      if (!socket.access || !socket.access.isCreator()) {
        return
      }

      const access = await Access.findByToken(token)

      if (!access || !socket.access.tournament.equals(access.tournament)) {
        return
      }

      await access.remove()
      const tournament = await Tournament.findById(access.tournament)

      utils.emitTournamentStateToAllSockets(io, tournament)
    })

    socket.on("requestTournamentState", async token => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      utils.joinRoom(io, socket, access)

      const tournament = await Tournament.findByAccess(access)
      await utils.emitTournamentState(socket, tournament)
    })

    socket.on("scoreBlur", () => {
      if (!socket.access) {
        return
      }

      socket.focus = null
      utils.emitClientsToAllSockets(io, socket.access.tournament)
    })

    socket.on("scoreFocus", payload => {
      if (!socket.access) {
        return
      }

      socket.focus = payload
      utils.emitClientsToAllSockets(io, socket.access.tournament)
    })

    socket.on("tournamentClosed", () => utils.leaveAllRooms(io, socket))

    socket.on("tournamentOpened", async (token, lastModified) => {
      const access = await Access.findByToken(token)

      if (!access) {
        return socket.emit("tournamentDoesNotExist")
      }

      utils.joinRoom(io, socket, access)
      const tournament = await Tournament.findByAccess(access)

      if (access.isSpectator()) {
        return await utils.emitTournamentState(socket, tournament)
      }

      const localIsNewer =
        !tournament || lastModified > tournament.meta.lastModified

      if (localIsNewer) {
        socket.emit("requestTournamentState")
      } else {
        await utils.emitTournamentState(socket, tournament)
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

        utils.joinRoom(io, socket, creatorAccess)

        return await utils.emitTournamentState(socket, tournament)
      }

      // Tournament exists
      if (access.isSpectator()) {
        return
      }

      const tournament = await Tournament.findByAccess(access)

      tournament.domain = state.domain
      tournament.markModified("domain")

      await tournament.save()

      utils.emitTournamentStateToAllSockets(io, tournament)
    })
  })
}
