import * as R from "ramda"

const mapIndexed = R.addIndex(R.map)

export const shuffle = array => {
  let counter = array.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--
    ;[array[counter], array[index]] = [array[index], array[counter]]
  }

  return array
}

export const getRoundCountBySeed = R.compose(
  R.add(1),
  Math.ceil,
  Math.log2,
  R.prop("length")
)

export const getMatchCountByRoundIndex = (roundIndex, roundCount) =>
  Math.pow(2, roundCount - roundIndex - 1)

export const generateSeedFromIdentifiers = R.compose(
  R.map(([home, away]) => ({ home, away })),
  R.splitEvery(2),
  shuffle
)

export const getParticipantsFromInputs = R.compose(
  mapIndexed((name, id) => ({ name, id })),
  R.filter(R.identity),
  R.map(R.prop("value"))
)

export const generateResultStructureFromSeed = seed => {
  const results = []
  const roundCount = getRoundCountBySeed(seed)

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
    results.push([])
    const matchCount = getMatchCountByRoundIndex(roundIndex, roundCount)

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex++) {
      results[roundIndex].push({
        home: { score: 0 },
        away: { score: 0 },
        roundIndex,
        matchIndex,
      })
    }
  }

  return results
}

export const getWinnerOfMatch = match => {
  if (match.home.score > match.away.score) return "home"
  if (match.away.score > match.home.score) return "away"
  return null
}

export const getPreviousMatchBySide = (results, match, side) =>
  match.roundIndex
    ? results[match.roundIndex - 1][
        match.matchIndex * 2 + side === "away" ? 1 : 0
      ]
    : null

export const getRootMatchBySide = (results, match, side) => {
  const previousMatch = getPreviousMatchBySide(results, match, side)
  if (!previousMatch) return match

  const previousMatchWinner = getWinnerOfMatch(previousMatch)
  if (!previousMatchWinner) return null

  return getRootMatchBySide(results, previousMatch, previousMatchWinner)
}

export const getNameOfMatchSide = (state, match, side) => {
  const rootMatch = getRootMatchBySide(state.results, match, side)

  if (!rootMatch) return null

  const rootMatchIndex = state.results[0].indexOf(rootMatch)
  const participantIndex = state.seed[rootMatchIndex][side]

  return R.path([participantIndex, "name"], state.participants) || null
}

export const assocParticipantNamesToMatchSides = R.curry((state, match) =>
  R.compose(
    R.assocPath(["home", "name"], getNameOfMatchSide(state, match, "home")),
    R.assocPath(["away", "name"], getNameOfMatchSide(state, match, "away"))
  )(match)
)
