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
      creator: null,
      organizers: [],
      spectator: null,
    },
    transient: {
      clientCount: 1, // default is 1 because we include the current client as well
      loading: false,
    },
  },
}
