require('dotenv').config()
const promiseLimit = require('promise-limit')
const { redis } = require('../../services/redisClient')
const rootLogger = require('../../services/logger')
const { MAX_CONCURRENT_EVENTS } = require('../../utils/constants')

const limit = promiseLimit(MAX_CONCURRENT_EVENTS)

function processBridgeDeployedBuilder(redisKey) {
  return async function processBridgeDeployed(bridgesDeployed) {
    rootLogger.debug(`Processing ${bridgesDeployed.length} NewBridgeDeployed events`)
    const jobs = bridgesDeployed.map(bridge =>
      limit(async () => {
        const {
          homeBridge,
          foreignBridge,
          homeToken,
          foreignToken,
          homeStartBlock,
          foreignStartBlock
        } = bridge.returnValues

        const logger = rootLogger.child({
          eventTransactionHash: bridge.transactionHash
        })

        logger.info(
          {
            homeBridge,
            foreignBridge,
            homeToken,
            foreignToken,
            homeStartBlock,
            foreignStartBlock
          },
          `Processing bridge ${bridge.transactionHash}`
        )

        return redis.sadd(
          redisKey,
          JSON.stringify({
            homeBridge,
            foreignBridge,
            homeToken,
            foreignToken,
            homeStartBlock,
            foreignStartBlock
          })
        )
      })
    )

    await Promise.all(jobs)
  }
}

module.exports = processBridgeDeployedBuilder
