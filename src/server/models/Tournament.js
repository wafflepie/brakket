const mongoose = require("mongoose")

const TournamentSchema = new mongoose.Schema({
  created: Number,
  domain: {
    name: String,
    participants: [String],
    results: [[mongoose.Schema.Types.Mixed]],
    seed: [
      {
        away: Number,
        home: Number,
      },
    ],
  },
  lastModified: Number,
})

TournamentSchema.pre("save", function(next) {
  const currentDate = +new Date()
  this.lastModified = currentDate

  if (!this.created) {
    this.created = currentDate
  }

  next()
})

module.exports = mongoose.model("Tournament", TournamentSchema)
