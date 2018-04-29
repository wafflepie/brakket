# brakket

Offline-first web application for creating and managing tournament brackets.

* Socket.IO is used for client-server communication.
* Vue.js is used to present the data in the browser.
* Mongoose is used to persist the data to a MongoDB database.

The application is configured and ready to be deployed to Heroku alongside an mLab database.

## Installation guide

### Prerequisites

Make sure that you have these tools installed and added to your `PATH`.

* [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)
* [Node.js](https://nodejs.org/en/) v8.9.4 or higher (but not v10)
* [Yarn](https://yarnpkg.com/en/docs/install)

You can check that everything is properly set up by typing these commands into your terminal:

```sh
node -v
yarn -v
mongod --version
```

If all of these commands print the version, you're all set! If not, you may have forgotten to add them to `PATH`.

### Installing application dependencies

Open a new terminal instance in the root directory of this application (which contains the `package.json`) file and run the `yarn` command.

### Starting the application

You need to have a database running to start the application. You can start the database using the `yarn mongo` command.

Now you need to run `yarn start` alongside the database. This can be achieved by opening a second terminal instance and running the command in it. If you've done everything correctly, a browser tab pointing to `localhost:8080` will open shortly.

### Building the application for deployment

The client-side code can be built for deployment using the `yarn build` command. The server-side code is meant to be deployed as-is and will handle the built assets without any further interaction.

## Domain type reference

Although this project does not use Flow, this type reference can help you understand the domain model structure a bit better.

```js
// This is the model structure used in Vuex state.
type Participants = Array<string>
type Seed = Array<{ home: ?number, away: ?number }>
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
