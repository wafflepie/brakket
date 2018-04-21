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
      clientCount: 0,
      loading: false,
    },
  },
}
