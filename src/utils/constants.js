module.exports = {
  EXTRA_GAS_PERCENTAGE: 1,
  MAX_CONCURRENT_EVENTS: 50,
  RETRY_CONFIG: {
    retries: 20,
    factor: 1.4,
    maxTimeout: 360000,
    randomize: true
  },
  DEFAULT_UPDATE_INTERVAL: 600000,
  EXIT_CODES: {
    IRRELEVANT: 0,
    GENERAL_ERROR: 1,
    INCOMPATIBILITY: 10,
    MAX_TIME_REACHED: 11
  }
}
