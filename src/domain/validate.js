import * as R from "ramda"

import { SIDES } from "../constants"
import { getNameOfSide, getOtherSide, isSidePlaceholder } from "./compute"

/**
 * Resets the scores of a match if they have a value but shouldn't.
 *
 * @param {Array} participants list of all participants
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 */
export const validateMatch = R.curry((participants, seed, results, match) =>
  R.compose(
    ...SIDES.map(side => {
      const sideName = getNameOfSide(participants, seed, results, match, side)
      const xforms = { score: R.unless(R.equals(null), R.always(0)) }

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
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Array} results results of all matches
 */
export const validateResults = (participants, seed, results) =>
  R.map(R.map(validateMatch(participants, seed, results)), results)
