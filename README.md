# brakket

Vue.js application for tournament brackets.

## Types

```js
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

type ExtendedSide = Side & { name: ?string }

type ExtendedMatch = {
  home: ExtendedSide,
  away: ExtendedSide,
  roundIndex: number,
  matchIndex: number,
  winner: "home" | "away",
}
```
