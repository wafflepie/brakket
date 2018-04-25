const mongoose = require("mongoose")
const { PERMISSIONS } = require("../../common")

const AccessSchema = new mongoose.Schema({
  permissions: {
    type: String,
    enum: Object.values(PERMISSIONS),
    default: PERMISSIONS.SPECTATOR,
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

AccessSchema.static("isTokenCreator", async function(token) {
  const access = await this.findByToken(token)
  return access ? access.permissions === PERMISSIONS.CREATOR : false
})

AccessSchema.static("findTournamentByToken", async function(token) {
  const tournamentId = await this.findTournamentIdByToken(token)

  return tournamentId
    ? await this.model("Tournament").findById(tournamentId)
    : null
})

AccessSchema.static("findAccessesByToken", async function(token) {
  const access = await this.findByToken(token)

  if (!access) return []

  return await this.find({ tournament: access.tournament })
})

AccessSchema.static("findEligibleAccessesByToken", async function(token) {
  const access = await this.findByToken(token)

  if (!access) {
    return {
      creator: null,
      organizers: [],
      spectator: null,
    }
  }

  // SPECTATOR
  if (access.permissions === PERMISSIONS.SPECTATOR) {
    return {
      creator: null,
      organizers: [],
      spectator: access,
    }
  }

  const accesses = await this.find({ tournament: access.tournament })

  const spectatorAccess = accesses.find(
    access => access.permissions === PERMISSIONS.SPECTATOR
  )

  // ORGANIZER
  if (access.permissions === PERMISSIONS.ORGANIZER) {
    return {
      creator: null,
      organizers: [access],
      spectator: spectatorAccess,
    }
  } else {
    // CREATOR
    const organizerAccesses = accesses.filter(
      access => access.permissions === PERMISSIONS.ORGANIZER
    )

    return {
      creator: access,
      organizers: organizerAccesses,
      spectator: spectatorAccess,
    }
  }
})

module.exports = mongoose.model("Access", AccessSchema)
