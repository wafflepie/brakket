import * as R from "ramda"
import shuffle from "lodash.shuffle"

import { SIDES } from "../../common"

/**
 * Indexed version of R.filter.
 */
const groupByIndexed = R.addIndex(R.groupBy)

/**
 * Complement of R.isNil.
 */
const isNotNil = R.complement(R.isNil)

/**
 * Returns the number of participants by seed.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
const getSideCountBySeed = R.compose(
  R.prop("length"),
  R.filter(isNotNil),
  R.flatten,
  R.map(R.props(SIDES))
)

/**
 * Returns the number of rounds by passed seed.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
const getRoundCountBySeed = R.compose(Math.ceil, Math.log2, getSideCountBySeed)

/**
 * Returns the number of matches in a specified round.
 *
 * @param {number} roundCount total number of rounds
 * @param {number} roundIndex index of the round, starting with 0
 */
const getMatchCountByRoundIndex = (roundCount, roundIndex) =>
  2 ** (roundCount - roundIndex - 1)

/**
 * Returns the stringified side by identifier index.
 *
 * @param {number} identifierCount number of identifiers
 * @param {number} identifierIndex index of identifier to get the side of
 */
const getSideByIndex = (identifierCount, identifierIndex) => {
  const power = Math.log2(identifierCount)
  const roundedPower = Number.isInteger(power) ? power - 1 : Math.floor(power)

  return identifierIndex < 2 ** roundedPower ? "home" : "away"
}

/**
 * Generates a seed from identifiers. The seed is an array of objects, specifying the home and
 * away side identifiers.
 *
 * @param {Array} identifiers identifiers of participants
 */
export const generateSeedFromIdentifiers = identifiers => {
  const groupedIdentifiers = groupByIndexed(
    (identifier, index) => getSideByIndex(identifiers.length, index),
    shuffle(identifiers)
  )

  const partialSeeds = R.mapObjIndexed(
    (identifiers, side) =>
      R.map(identifier => ({ [side]: identifier }), identifiers),
    groupedIdentifiers
  )

  return partialSeeds.home.map((match, index) =>
    R.merge(match, partialSeeds.away[index])
  )
}

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
    const matchCount = getMatchCountByRoundIndex(roundCount, roundIndex)
    const roundSideCount = Math.ceil(sideCount / 2 ** roundIndex)
    const homeSideCount = matchCount
    const awaySideCount = roundSideCount - homeSideCount

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex++) {
      const awayHasScore = matchIndex < awaySideCount || roundIndex > 0

      const home = {
        score: 0,
      }

      const away = {
        score: awayHasScore ? 0 : null,
      }

      results[roundIndex][matchIndex] = {
        home,
        away,
        roundIndex,
        matchIndex,
      }
    }
  }

  return results
}
