export default {
  $socket: null,
  online: false,
  tournament: {
    domain: {
      name: null,
      participants: [], // Participants
      results: [], // Results
      seed: [], // Seed
    },
    meta: {
      created: null,
      lastModified: null,
    },
    accesses: {
      main: null,
      other: [],
    },
    transient: {
      clientCount: 1, // default is 1 because we include the current client as well
      loading: false,
    },
  },
}
