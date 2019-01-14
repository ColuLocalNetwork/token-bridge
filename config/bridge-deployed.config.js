const baseConfig = require('./base.config')

const id = `${baseConfig.id}-bridge-deployed`

module.exports = {
  ...baseConfig.bridgeConfigBasic,
  ...baseConfig.bridgeMapperConfig,
  event: 'NewBridgeDeployed',
  name: `watcher-${id}`,
  id
}
