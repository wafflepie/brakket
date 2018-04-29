const R = require("ramda")
const { Access } = require("../models")

const utils = {
  getSocketsByTournamentId: (io, tournamentId) =>
    R.compose(
      R.map(socketId => io.sockets.connected[socketId]),
      R.keys,
      R.path(["sockets", "adapter", "rooms", tournamentId, "sockets"])
    )(io),

  emitTournamentState: async (socket, tournament) => {
    const accesses = await Access.findEligibleAccessesByToken(
      socket.access.token
    )

    socket.emit("tournamentState", {
      accesses,
      domain: tournament.domain,
      meta: tournament.meta,
    })
  },

  emitTournamentStateToAllSockets: (io, tournament) =>
    utils
      .getSocketsByTournamentId(io, tournament._id)
      .forEach(socket => utils.emitTournamentState(socket, tournament)),

  emitClientsToAllSockets: (io, tournamentId) => {
    const sockets = utils.getSocketsByTournamentId(io, tournamentId)

    sockets.forEach(socket => {
      // remove the socket we are emitting to from the list
      const payloadSockets = sockets.filter(other => other.id !== socket.id)

      const payload = payloadSockets.map(payloadSocket => ({
        focus: payloadSocket.focus,
        id: payloadSocket.id,
        name: payloadSocket.access.name,
        permissions: payloadSocket.access.permissions,
      }))

      socket.emit("clients", payload)
    })
  },

  joinRoom: (io, socket, access) => {
    utils.leaveAllRooms(io, socket)
    const tournamentId = access.tournament
    socket.join(tournamentId)
    socket.access = access

    utils.emitClientsToAllSockets(io, tournamentId)
  },

  leaveAllRooms: (io, socket) => {
    Object.keys(socket.rooms)
      .filter(room => room !== socket.id)
      .forEach(room => socket.leave(room))

    if (socket.access) {
      utils.emitClientsToAllSockets(io, socket.access.tournament)
    }

    socket.access = null
    socket.focus = null
  },
}

module.exports = utils
