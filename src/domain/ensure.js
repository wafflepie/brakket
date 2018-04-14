import * as R from "ramda"

import { SIDES } from "../constants"
import { getNameOfSide, getOtherSide, isSidePlaceholder } from "./compute"

/**
 * Ensures that the scores of a match don't have a value if they shouldn't.
 *
 * @param {Array} participants list of all participants
 * @param {Array} seed an array of matches in the first tournament round
 * @param {Array} results results of all matches
 * @param {Object} match a single match
 */
export const ensureMatchValidity = R.curry((bracket, match) =>
  R.compose(
    ...SIDES.map(side => {
      const sideName = getNameOfSide(
        bracket.participants,
        bracket.seed,
        bracket.results,
        match,
        side
      )

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
 * Ensures that the scores in the bracket state are valid.
 *
 * @param {Object} bracket bracket state
 */
export const ensureBracketStateValidity = bracket =>
  R.evolve(
    {
      results: R.map(R.map(ensureMatchValidity(bracket))),
    },
    bracket
  )
