import * as R from "ramda"
import shuffle from "lodash.shuffle"

const SIDES = ["home", "away"]

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
 * Returns the number of participants by seed.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
export const getSideCountBySeed = seed =>
  seed.length &&
  seed.length * 2 - Number(seed[seed.length - 1].away === undefined)

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
 * Generates the initial result structure based on the seed.
 *
 * The result structure is a 2D array, where the first index represents the round and the second
 * index represents a single match. Every match has two sides: home and away.
 *
 * Every side has a default score of 0. If the score is null, it means that it is a placeholder
 * side which does not participate in the tournament.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
export const generateResultStructureFromSeed = seed => {
  const results = []
  const roundCount = getRoundCountBySeed(seed)
  const sideCount = getSideCountBySeed(seed)

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
 * Returns the other side of the match.
 *
 * @param {string} side string representation of a side
 */
export const getOtherSide = side => R.last(R.without([side], SIDES))

/**
 * Returns whether specified side of the match is just a placeholder.
 *
 * @param {Object} match a single match
 * @param {string} side string representation of a side
 */
export const isSidePlaceholder = (match, side) => match[side].score === null

/**
 * Returns whether specified side exists but just has not been decided.
 *
 * @param {Object} match a single match
 * @param {string} side string representation of a side
 */
export const isSideToBeDecided = (match, side) =>
  !isSidePlaceholder(match, side) && match[side].name === null

/**
 * Returns whether the input for specified side should be disabled.
 *
 * @param {Object} match a single match
 * @param {string} side string representation of a side
 */
export const isSideDisabled = (match, side) =>
  isSideToBeDecided(match, side) ||
  isSideToBeDecided(match, getOtherSide(side)) ||
  isSidePlaceholder(match, side) ||
  isSidePlaceholder(match, getOtherSide(side))

/**
 * Returns a string representing the winner of the passed match.
 *
 * @param {Object} match a single match
 */
export const getWinnerOfMatch = match => {
  for (const side of SIDES) if (isSideToBeDecided(match, side)) return null

  if (isSidePlaceholder(match, "home") && isSidePlaceholder(match, "away"))
    return null

  for (const side of SIDES)
    if (isSidePlaceholder(match, side)) return getOtherSide(side)

  for (const side of SIDES)
    if (Number(match[side].score) > Number(match[getOtherSide(side)].score))
      return side

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
  R.defaultTo(
    null,
    R.path(
      [match.roundIndex - 1, match.matchIndex * 2 + Number(side === "away")],
      results
    )
  )

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

  return getFirstMatchOfSide(results, previousMatch, previousMatchWinner)
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
  if (isSidePlaceholder(match, side)) return null

  const [firstMatch, firstMatchSide] = getFirstMatchOfSide(results, match, side)

  if (!firstMatch || !firstMatchSide) return null

  const firstMatchIndex = R.findIndex(
    R.whereEq({ matchIndex: firstMatch.matchIndex }),
    results[0]
  )

  const participantId = R.path([firstMatchIndex, firstMatchSide], seed)
  const participant = R.prop(participantId, participants)

  return participant || null
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
    R.compose(
      ...SIDES.map(side =>
        R.assocPath(
          [side, "name"],
          getNameOfSide(participants, results, seed, match, side)
        )
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

/**
 * Resets the scores of a match if they have a value but shouldn't.
 *
 * @param {Array} participants list of all participants
 * @param {Array} results results of all matches
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Object} match a single match
 */
export const validateMatch = R.curry((participants, results, seed, match) =>
  R.compose(
    ...SIDES.map(side => {
      const sideName = getNameOfSide(participants, results, seed, match, side)
      const xforms = { score: R.always(0) }

      return R.when(
        // if it is an existing side but no name was found for it
        match => !isSidePlaceholder(match, side) && sideName === null,
        R.evolve({ [side]: xforms, [getOtherSide(side)]: xforms })
      )
    })
  )(match)
)

/**
 * Resets the scores of all matches if they have a value but shouldn't.
 *
 * @param {Array} participants list of all participants
 * @param {Array} results results of all matches
 * @param {Array} seed an array of matches in the first tournament round
 */
export const validateResults = (participants, results, seed) =>
  R.map(R.map(validateMatch(participants, results, seed)), results)
