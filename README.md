# brakket

Offline-first web application for creating and managing tournament brackets.

* Socket.IO is used for client-server communication.
* Vue.js is used to present the data in the browser.
* Mongoose is used to persist the data to a MongoDB database.

The application is configured and ready to be deployed to Heroku alongside an mLab database.

## Core concepts

As of yet, the application supports only classic single-elimination tournaments.

### Participants

The number of participants is up to you, it does not have to be a power of two. The empty slots are filled with a placeholder and the home side always advances to the next round. You can choose to name the participants or just keep them numbered.

### Sharing tournaments

The application doesn't require any signing up or logging in. If you want to share a tournament with somebody, just send them a URL.

Remember not to send YOUR URL to anyone, as that would give them your permissions to the tournament! Instead, you can click the Share icon and proceed from there.

You can see the changes to the results in real time, similar to e.g. Google Docs. Open the same tournament in two windows, place them next to each other and see for yourself!

## Source structure

The source code of the application can essentially be divided into three parts.

### Server-side code (`src/server`)

The `index.js` file is the entry point for the entire back end. We establish a connection to the database and start both the HTTP server and the Socket.IO server here.

The `src/server/models` folder contains our Mongoose schemas and models.

`src/server/routes` handles all of our server-side business logic.

* `routes.js` uses a common Node.js dependency injection pattern (exporting a function). All the application event types (routes) are handled here, akin to a controller in a classic MVC model.

* `utils.js` contains some common logic used throughout the route handlers.

### Client-side code (`src/client`)

As with the server-side code, the `index.js` file is the entry point of the application.

The `src/client/components`, `src/client/containers` and `src/client/pages` folders contain the Vue.js components used throughout the application. Containers and views may access the Vuex store, components may not.

`src/client/domain` contains the domain logic for handling the participants, seeds and results of tournaments.

The contents of `src/client/store` are responsible for interaction with the Vuex store (alongside `src/client/selectors`, which contains functions for accessing computed data).

Other folders are not as important and you can probably figure them out yourself.

### Common code (`src/common`)

Not much happening over here, except for some constants that are shared with both the server-side and the client-side code.

## Local development

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

Open a new terminal instance in the root directory of this application (which contains the `package.json` file) and run the `yarn` command.

### Starting the application

You need to have a database running to start the application. You can start the database using the `yarn mongo` command.

Now you need to run `yarn start` alongside the database. This can be achieved by opening a second terminal instance and running the command in it. If you've done everything correctly, a browser tab pointing to `localhost:8080` will open shortly.

### Building the application for deployment

The client-side code can be built for deployment using the `yarn build` command. The server-side code is meant to be deployed as-is and will handle the built assets without any further interaction.

## Domain type reference

Although this project does not use Flow, this type reference can help you understand the domain model structure a bit better.

```js
type Participants = Array<string>
type Seed = Array<{ home: number, away: ?number }>
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
