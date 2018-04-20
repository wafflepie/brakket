# brakket

Vue.js application for tournament brackets.

## Type reference

Although this project does not use Flow, this type reference can help you understand the model structure a bit better.

```js
// This is the model structure used in Vuex state.
type Participants = Array<string>
type Seed = Array<{ home: number, away: number }>
type Side = { score: ?number }

type Match = {
  home: Side,
  away: Side,
  roundIndex: number,
  matchIndex: number,
}

type Round = Array<Match>
type Results = Array<Round>

// These types are used in selectors only.
type ExtendedSide = Side & { name: ?string }

type ExtendedMatch = {
  home: ExtendedSide,
  away: ExtendedSide,
  roundIndex: number,
  matchIndex: number,
  winner: "home" | "away",
}
```
