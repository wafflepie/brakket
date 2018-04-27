import * as R from "ramda"

import { SIDES } from "../../common"

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
 * Must return false if it is not an extended match.
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
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 * @param {string} side side to find the name of
 */
export const getNameOfSide = (participants, seed, results, match, side) => {
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
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 */
export const extendMatchSidesWithNames = R.curry(
  (participants, seed, results, match) =>
    R.compose(
      ...SIDES.map(side =>
        R.assocPath(
          [side, "name"],
          getNameOfSide(participants, seed, results, match, side)
        )
      )
    )(match)
)

/**
 * Returns the match with an additional computed property: winner.
 *
 * @param {Object} match a single match
 */
export const extendMatchWithWinnerSide = R.curry(match =>
  R.assoc("winner", getWinnerOfMatch(match), match)
)
