const mongoose = require("mongoose")

const AccessSchema = new mongoose.Schema({
  organizer: {
    default: false,
    type: Boolean,
  },
  token: String,
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
  },
})

AccessSchema.static("findByToken", async function(token) {
  return await this.findOne({ token })
})

AccessSchema.static("findTournamentIdByToken", async function(token) {
  const access = await this.findOne({ token })
  return access ? access.tournament : null
})

AccessSchema.static("isTokenOrganizer", async function(token) {
  const access = await this.findByToken(token)
  return access ? access.organizer : false
})

AccessSchema.static("findTournamentByToken", async function(token) {
  const tournamentId = await this.findTournamentIdByToken(token)

  return tournamentId
    ? await this.model("Tournament").findById(tournamentId)
    : null
})

module.exports = mongoose.model("Access", AccessSchema)
