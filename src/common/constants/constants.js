module.exports = {
  SIDES: ["home", "away"],
  DEFAULT_TOURNAMENT_LIST_SIZE_LIMIT: 10,
  MINIMUM_PARTICIPANTS_COUNT: 2,
  MAXIMUM_PARTICIPANTS_COUNT: 64,
  // must be ordered from highest permissions to lowest
  PERMISSIONS: {
    CREATOR: "CREATOR",
    ORGANIZER: "ORGANIZER",
    SPECTATOR: "SPECTATOR",
  },
}
