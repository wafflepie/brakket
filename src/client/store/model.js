export default {
  $socket: null,
  loading: {
    tournament: false,
  },
  online: false,
  tournament: {
    created: null,
    id: null,
    lastModified: null,
    name: null,
    participants: [], // Participants
    seed: [], // Seed
    results: [], // Results
  },
}
