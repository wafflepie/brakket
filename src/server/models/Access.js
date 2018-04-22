const mongoose = require("mongoose")
const { PERMISSIONS } = require("../constants")

const AccessSchema = new mongoose.Schema({
  permissions: {
    default: PERMISSIONS.SPECTATOR,
    enum: Object.values(PERMISSIONS),
    type: String,
  },
  token: String,
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
})

AccessSchema.static("findByToken", async function(token) {
  return await this.findOne({ token })
})

AccessSchema.static("findTournamentIdByToken", async function(token) {
  const access = await this.findOne({ token })
  return access ? access.tournamentId : null
})

AccessSchema.static("isTokenOrganizer", async function(token) {
  const access = await this.findByToken(token)
  return access ? access.permissions === PERMISSIONS.ORGANIZER : false
})

AccessSchema.static("findTournamentByToken", async function(token) {
  const tournamentId = await this.findTournamentIdByToken(token)

  return tournamentId
    ? await this.model("Tournament").findById(tournamentId)
    : null
})

module.exports = mongoose.model("Access", AccessSchema)
