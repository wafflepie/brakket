const mongoose = require("mongoose")

const TournamentSchema = new mongoose.Schema({
  domain: {
    name: String,
    participants: [String],
    results: [[]],
    seed: [
      {
        away: Number,
        home: Number,
      },
    ],
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
