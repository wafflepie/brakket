const mongoose = require("mongoose")

const {
  MINIMUM_PARTICIPANTS_COUNT,
  MAXIMUM_PARTICIPANTS_COUNT,
} = require("../../common")

const participantsValidate = array =>
  array.length >= MINIMUM_PARTICIPANTS_COUNT &&
  array.length <= MAXIMUM_PARTICIPANTS_COUNT

const seedValidate = array =>
  array.length >= MINIMUM_PARTICIPANTS_COUNT / 2 &&
  array.length <= MAXIMUM_PARTICIPANTS_COUNT / 2

const TournamentSchema = new mongoose.Schema({
  domain: {
    name: String,
    participants: {
      type: [String],
      validate: [participantsValidate, "{PATH} has invalid length"],
    },
    results: [[]],
    seed: {
      type: [
        {
          away: Number,
          home: Number,
        },
      ],
      validate: [seedValidate, "{PATH} has invalid length"],
    },
  },
  meta: {
    created: Number,
    lastModified: Number,
  },
})

TournamentSchema.pre("save", function(next) {
  const currentDate = +new Date()
  this.meta.lastModified = currentDate

  if (!this.meta.created) {
    this.meta.created = currentDate
  }

  next()
})

module.exports = mongoose.model("Tournament", TournamentSchema)
