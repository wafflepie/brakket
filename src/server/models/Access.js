const mongoose = require("mongoose")
const { PERMISSIONS } = require("../../common")

const AccessSchema = new mongoose.Schema({
  name: String,
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

AccessSchema.method("isCreator", function() {
  return this.permissions === PERMISSIONS.CREATOR
})

AccessSchema.method("isOrganizer", function() {
  return this.permissions === PERMISSIONS.ORGANIZER
})

AccessSchema.method("isSpectator", function() {
  return this.permissions === PERMISSIONS.SPECTATOR
})

module.exports = mongoose.model("Access", AccessSchema)
