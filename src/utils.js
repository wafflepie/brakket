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

export const getRoundCountByParticipants = R.compose(
  Math.ceil,
  Math.log2,
  R.prop("length")
)

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
