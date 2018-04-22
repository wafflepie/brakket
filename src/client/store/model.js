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
    local: {
      created: null,
      lastModified: null,
    },
    remote: {
      created: null,
      lastModified: null,
    },
    token: null,
    transient: {
      clientCount: 1, // default is 1 because we include the current client as well
      loading: false,
    },
  },
}
