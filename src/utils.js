import * as R from "ramda"

const mapIndexed = R.addIndex(R.map)

/**
 * Returns a new, shuffled array.
 *
 * @param {Array} array array to shuffle
 */
export const shuffle = array => {
  let counter = array.length

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter)
    counter--
    ;[array[counter], array[index]] = [array[index], array[counter]]
  }

  return array
}

/**
 * Returns the number of rounds by passed seed.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
export const getRoundCountBySeed = R.compose(
  R.add(1),
  Math.ceil,
  Math.log2,
  R.prop("length")
)

/**
 * Returns the number of matches in a specified round.
 *
 * @param {number} roundIndex index of the round, starting with 0
 * @param {number} roundCount total number of rounds
 */
export const getMatchCountByRoundIndex = (roundIndex, roundCount) =>
  Math.pow(2, roundCount - roundIndex - 1)

/**
 * Generates a seed from identifiers. The seed is an array of objects, specifying the home and
 * away side identifiers.
 *
 * @param {Array} identifiers identifiers of participants
 */
export const generateSeedFromIdentifiers = R.compose(
  R.map(([home, away]) => ({ home, away })),
  R.splitEvery(2),
  shuffle
)

/**
 * Generates participant objects from input value wrappers. Their IDs are the corresponding
 * array indices.
 *
 * @param {Array} inputs objects with value props
 */
export const createParticipantsFromValues = R.compose(
  mapIndexed((name, id) => ({ name, id })),
  R.filter(R.identity)
)

/**
 * Generates the initial result structure based on the seed.
 *
 * The result structure is a 2D array, where the first index represents the round and the second
 * index represents a single match. Every match has two sides: home and away.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
export const generateResultStructureFromSeed = seed => {
  const results = []
  const roundCount = getRoundCountBySeed(seed)
  const sideCount =
    seed.length &&
    seed.length * 2 - (seed[seed.length - 1].away === undefined ? 1 : 0)

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
    results[roundIndex] = []
    const matchCount = getMatchCountByRoundIndex(roundIndex, roundCount)

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex++) {
      const doesHomeExist =
        Math.ceil(sideCount / Math.pow(2, roundIndex + 1)) > matchIndex
      const doesAwayExist =
        Math.ceil(sideCount / Math.pow(2, roundIndex + 1) - 0.5) > matchIndex

      results[roundIndex][matchIndex] = {
        home: { score: doesHomeExist ? 0 : null },
        away: { score: doesAwayExist ? 0 : null },
        roundIndex,
        matchIndex,
      }
    }
  }

  return results
}

/**
 * Returns whether home side of the match is just a placeholder.
 */
export const isHomePlaceholder = match => match.home.score === null

/**
 * Returns whether away side of the match is just a placeholder.
 */
export const isAwayPlaceholder = match => match.away.score === null

/**
 * Returns whether home side exists but just has not been decided.
 */
export const isHomeToBeDecided = match =>
  match.home.score !== null && match.home.name === null

/**
 * Returns whether away side exists but just has not been decided.
 */
export const isAwayToBeDecided = match =>
  match.away.score !== null && match.away.name === null

/**
 * Returns whether the input for home side should be disabled.
 */
export const isHomeDisabled = match =>
  isAwayToBeDecided(match) ||
  isAwayPlaceholder(match) ||
  match.home.name === null

/**
 * Returns whether the input for away side should be disabled.
 */
export const isAwayDisabled = match =>
  isHomeToBeDecided(match) ||
  isHomePlaceholder(match) ||
  match.away.name === null

/**
 * Returns a string representing the winner of the passed match.
 *
 * @param {Object} match a single match
 */
export const getWinnerOfMatch = match => {
  if (isHomeToBeDecided(match) || isAwayToBeDecided(match)) return null
  if (isHomePlaceholder(match) && isAwayPlaceholder(match)) return null
  if (isHomePlaceholder(match)) return "away"
  if (isAwayPlaceholder(match)) return "home"
  if (Number(match.home.score) > Number(match.away.score)) return "home"
  if (Number(match.home.score) < Number(match.away.score)) return "away"

  return null
}

/**
 * Returns the previous match of the specified side.
 *
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 * @param {string} side side to find the previous match for
 */
export const getPreviousMatchBySide = (results, match, side) =>
  match.roundIndex
    ? results[match.roundIndex - 1][
        match.matchIndex * 2 + (side === "away" ? 1 : 0)
      ]
    : null

/**
 * Returns a tuple.
 * The first element is the first round match of the specified side.
 * The second element is the first round match side of the specified side.
 *
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 * @param {string} side side to find the first match for
 */
export const getFirstMatchOfSide = (results, match, side) => {
  const previousMatch = getPreviousMatchBySide(results, match, side)
  if (!previousMatch) return [match, side]

  const previousMatchWinner = getWinnerOfMatch(previousMatch)
  if (!previousMatchWinner) return [null, null]

  return [
    getFirstMatchOfSide(results, previousMatch, previousMatchWinner)[0],
    previousMatchWinner,
  ]
}

/**
 * Returns the participant name of the specified side of a match.
 *
 * @param {Array} participants list of all participants
 * @param {Array} results results of all matches
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Object} match a single match
 * @param {string} side side to find the name of
 */
export const getNameOfSide = (participants, results, seed, match, side) => {
  if (match[side].score === null) return null

  const [firstMatch, firstMatchSide] = getFirstMatchOfSide(results, match, side)

  if (!firstMatch) return null

  const firstMatchIndex = R.findIndex(
    R.whereEq({ matchIndex: firstMatch.matchIndex }),
    results[0]
  )

  const participantId = R.path([firstMatchIndex, firstMatchSide], seed)
  const participant = R.find(R.propEq("id", participantId), participants)

  return R.prop("name", participant) || null
}

/**
 * Returns the match with two additional computed properties: home.name and away.name.
 *
 * @param {Array} participants list of all participants
 * @param {Array} results results of all matches
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Object} match a single match
 */
export const extendMatchSidesWithNames = R.curry(
  (participants, results, seed, match) =>
    R.o(
      R.assocPath(
        ["home", "name"],
        getNameOfSide(participants, results, seed, match, "home")
      ),
      R.assocPath(
        ["away", "name"],
        getNameOfSide(participants, results, seed, match, "away")
      )
    )(match)
)

/**
 * Returns the match with an additional computed property: winner.
 *
 * @param {Object} match a single match
 */
export const extendMatchWithWinnerSide = match =>
  R.assoc("winner", getWinnerOfMatch(match), match)

/**
 * Returns a function which adds additional computed properties to the passed match.
 *
 * @param {Array} participants list of all participants
 * @param {Array} results results of all matches
 * @param {Array} seed an array of matches in the first tournament round
 */
export const createExtendMatch = (participants, results, seed) =>
  R.compose(
    extendMatchWithWinnerSide,
    extendMatchSidesWithNames(participants, results, seed)
  )
