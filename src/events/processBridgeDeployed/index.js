require('dotenv').config()

function processBridgeDeployedBuilder(config) {
  return async function processBridgeDeployed(bridgesDeployed) {
    console.log('!!!!!!!', bridgesDeployed)
  }
}

module.exports = processBridgeDeployedBuilder
