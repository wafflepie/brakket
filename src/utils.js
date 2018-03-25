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

  for (let i = 0; i < roundCount; i++) {
    results.push([])
    const matchCount = getMatchCountByRoundIndex(i, roundCount)

    for (let j = 0; j < matchCount; j++) {
      results[i].push({
        home: { score: 0, previousMatch: i ? results[i - 1][j * 2] : null },
        away: { score: 0, previousMatch: i ? results[i - 1][j * 2 + 1] : null },
      })
    }
  }

  return results
}
