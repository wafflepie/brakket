import * as R from "ramda"
import shuffle from "lodash.shuffle"

/**
 * Returns the number of rounds by passed seed.
 *
 * @param {Array} seed an array of matches in the first tournament round
 */
const getRoundCountBySeed = R.compose(
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
const getSideCountBySeed = seed =>
  seed.length &&
  seed.length * 2 - Number(seed[seed.length - 1].away === undefined)

/**
 * Returns the number of matches in a specified round.
 *
 * @param {number} roundCount total number of rounds
 * @param {number} roundIndex index of the round, starting with 0
 */
const getMatchCountByRoundIndex = (roundCount, roundIndex) =>
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
    const matchCount = getMatchCountByRoundIndex(roundCount, roundIndex)

    for (let matchIndex = 0; matchIndex < matchCount; matchIndex++) {
      const homeExists =
        Math.ceil(sideCount / Math.pow(2, roundIndex + 1)) > matchIndex

      const awayExists =
        Math.ceil(sideCount / Math.pow(2, roundIndex + 1) - 0.5) > matchIndex

      results[roundIndex][matchIndex] = {
        home: { score: homeExists ? 0 : null },
        away: { score: awayExists ? 0 : null },
        roundIndex,
        matchIndex,
      }
    }
  }

  return results
}
