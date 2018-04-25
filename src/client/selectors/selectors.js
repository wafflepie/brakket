import * as R from "ramda"

import { SIDES } from "../constants"
import { extendMatchSidesWithNames, extendMatchWithWinnerSide } from "../domain"

/**
 * Flattens results and returns all matches which don't have a score of 0 or null,
 * meaning that the score has been filled in by the user.
 *
 * @param {Object} state state of the application
 */
export const selectMatchesWithScores = state =>
  R.filter(
    R.anyPass(SIDES.map(side => R.path([side, "score"]))),
    R.flatten(state.tournament.domain.results)
  )

/**
 * Selects the results with additional properties at all matches.
 *
 * @param {Object} state state of the application
 */
export const selectResults = ({
  tournament: {
    domain: { participants, seed, results },
  },
}) =>
  R.map(
    R.map(
      // this is called for each match
      R.compose(
        extendMatchWithWinnerSide(),
        extendMatchSidesWithNames(participants, seed, results)
      )
    ),
    results // is an array of rounds, which is an array of matches
  )

/**
 * Selects the final match.
 *
 * @param {Object} state state of the application
 */
export const selectFinalMatch = state =>
  R.last(R.defaultTo([], R.last(state.tournament.domain.results)))

/**
 * Selects the winner side of the final.
 *
 * @param {Object} state state of the application
 */
export const selectWinnerSideOfFinalMatch = state => {
  const results = selectResults(state)
  const finalMatch = selectFinalMatch({ tournament: { domain: { results } } })
  return R.prop(R.prop("winner", finalMatch), finalMatch)
}

/**
 * Selects the best access for the passed tournament state.
 *
 * @param {Object} tournamentState
 */
export const selectAccessFromTournamentState = tournamentState => {
  const { accesses } = tournamentState
  return accesses.creator || accesses.organizers[0] || accesses.spectator
}

/**
 * Selects the best token for the passed tournament state.
 *
 * @param {Object} tournamentState
 */
export const selectTokenFromTournamentState = tournamentState =>
  R.prop("token", selectAccessFromTournamentState(tournamentState))

/**
 * Selects the best access for the current tournament state.
 *
 * @param {Object} state state of the application
 */
export const selectAccess = state =>
  selectAccessFromTournamentState(state.tournament)

/**
 * Selects the best token for the current tournament.
 *
 * @param {Object} state state of the application
 */
export const selectToken = state =>
  selectTokenFromTournamentState(state.tournament)

/**
 * Selects whether the tournament can be displayed (it is loaded properly)
 *
 * @param {Object} state state of the application
 */
export const selectTournamentIsLoaded = state => !!state.tournament.meta.created
