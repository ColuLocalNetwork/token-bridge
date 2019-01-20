/* eslint import/no-unresolved: 0  node/no-missing-require: 0 */
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '../submodules/poa-bridge-contracts/deploy/.env')
})

const {
  sendRawTx,
  getReceipt
} = require('../submodules/poa-bridge-contracts/deploy/src/deploymentUtils')
const {
  web3Foreign,
  web3Home,
  deploymentPrivateKey
} = require('../submodules/poa-bridge-contracts/deploy/src/web3')

const ForeignBridgeFactoryABI = require('../submodules/poa-bridge-contracts/build/contracts/ForeignBridgeFactory.json').abi
const HomeBridgeFactoryABI = require('../submodules/poa-bridge-contracts/build/contracts/HomeBridgeFactory.json').abi
const BridgeMapperABI = require('../submodules/poa-bridge-contracts/build/contracts/BridgeMapper.json').abi

const { user } = require('../constants.json')

const {
  DEPLOYMENT_ACCOUNT_ADDRESS,
  HOME_BRIDGE_MAPPER_ADDRESS,
  HOME_BRIDGE_FACTORY_ADDRESS,
  FOREIGN_BRIDGE_FACTORY_ADDRESS,
  ERC20_TOKEN_ADDRESS
} = process.env

async function deploy() {
  try {
    // deploy foreign bridge
    let foreignNonce = await web3Foreign.eth.getTransactionCount(DEPLOYMENT_ACCOUNT_ADDRESS)
    console.log('\n[Foreign] Deploying foreign bridge using factory')
    const foreignFactory = new web3Foreign.eth.Contract(
      ForeignBridgeFactoryABI,
      FOREIGN_BRIDGE_FACTORY_ADDRESS
    )
    const deployForeignBridgeData = await foreignFactory.methods
      .deployForeignBridge(ERC20_TOKEN_ADDRESS)
      .encodeABI( {from: DEPLOYMENT_ACCOUNT_ADDRESS} )
    await sendRawTx({
      data: deployForeignBridgeData,
      nonce: foreignNonce,
      to: foreignFactory.options.address,
      privateKey: deploymentPrivateKey,
      url: process.env.FOREIGN_RPC_URL
    })
    const foreignBridgeDeployedEvents = await foreignFactory.getPastEvents('ForeignBridgeDeployed', {fromBlock: 0})
    process.env.FOREIGN_BRIDGE_ADDRESS = foreignBridgeDeployedEvents[0].returnValues._foreignBridge
    console.log('\n[Foreign] Deployed foreign bridge at: ' + process.env.FOREIGN_BRIDGE_ADDRESS)

    // deploy home bridge

    // add bridge mapping
  } catch (e) {
    console.log(e)
  }
}

deploy()
