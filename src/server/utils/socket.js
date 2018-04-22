const R = require("ramda")

const getTournamentIdBySocket = socket =>
  R.compose(
    R.head,
    R.filter(R.complement(R.equals(socket.id))),
    R.keys,
    R.prop("rooms")
  )(socket)

const getRoomClientCountByTournamentId = (io, id) =>
  R.compose(
    R.length,
    R.defaultTo([]),
    R.path(["sockets", "adapter", "rooms", id])
  )(io)

const emitClientCountByTournamentId = (io, id) =>
  io.to(id).emit("clientCount", getRoomClientCountByTournamentId(io, id))

module.exports = {
  emitClientCountByTournamentId,
  getTournamentIdBySocket,
  getRoomClientCountByTournamentId,
}
