/* eslint import/no-unresolved: 0  node/no-missing-require: 0 */
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '../submodules/poa-bridge-contracts/deploy/.env')
})

const { sendRawTx } = require('../submodules/poa-bridge-contracts/deploy/src/deploymentUtils')
const {
  web3Foreign,
  web3Home,
  deploymentPrivateKey
} = require('../submodules/poa-bridge-contracts/deploy/src/web3')

const ForeignBridgeFactoryABI = require('../submodules/poa-bridge-contracts/build/contracts/ForeignBridgeFactory.json')
  .abi
const HomeBridgeFactoryABI = require('../submodules/poa-bridge-contracts/build/contracts/HomeBridgeFactory.json')
  .abi
const BridgeMapperABI = require('../submodules/poa-bridge-contracts/build/contracts/BridgeMapper.json')
  .abi

const {
  DEPLOYMENT_ACCOUNT_ADDRESS,
  HOME_BRIDGE_MAPPER_ADDRESS,
  HOME_BRIDGE_FACTORY_ADDRESS,
  FOREIGN_BRIDGE_FACTORY_ADDRESS,
  ERC20_TOKEN_ADDRESS,
  BRIDGEABLE_TOKEN_NAME,
  BRIDGEABLE_TOKEN_SYMBOL,
  BRIDGEABLE_TOKEN_DECIMALS
} = process.env

const foreignBridgeData = {}
const homeBridgeData = {}
const bridgeMapping = {}

async function deployForeignBridge() {
  const foreignNonce = await web3Foreign.eth.getTransactionCount(DEPLOYMENT_ACCOUNT_ADDRESS)
  console.log('\n[Foreign] Deploying foreign bridge using factory')
  const foreignFactory = new web3Foreign.eth.Contract(
    ForeignBridgeFactoryABI,
    FOREIGN_BRIDGE_FACTORY_ADDRESS
  )
  const deployForeignBridgeData = await foreignFactory.methods
    .deployForeignBridge(ERC20_TOKEN_ADDRESS)
    .encodeABI({ from: DEPLOYMENT_ACCOUNT_ADDRESS })
  await sendRawTx({
    data: deployForeignBridgeData,
    nonce: foreignNonce,
    to: foreignFactory.options.address,
    privateKey: deploymentPrivateKey,
    url: process.env.FOREIGN_RPC_URL
  })
  const foreignBridgeDeployedEvents = await foreignFactory.getPastEvents('ForeignBridgeDeployed')
  foreignBridgeData.adderss = foreignBridgeDeployedEvents[0].returnValues._foreignBridge
  foreignBridgeData.blockNumber = foreignBridgeDeployedEvents[0].returnValues._blockNumber
  console.log('\n[Foreign] Deployed foreign bridge:', JSON.stringify(foreignBridgeData))
}

async function deployHomeBridge() {
  const homeNonce = await web3Home.eth.getTransactionCount(DEPLOYMENT_ACCOUNT_ADDRESS)
  console.log('\n[Home] Deploying home bridge using factory')
  const homeFactory = new web3Home.eth.Contract(HomeBridgeFactoryABI, HOME_BRIDGE_FACTORY_ADDRESS)
  const deployHomeBridgeData = await homeFactory.methods
    .deployHomeBridge(BRIDGEABLE_TOKEN_NAME, BRIDGEABLE_TOKEN_SYMBOL, BRIDGEABLE_TOKEN_DECIMALS)
    .encodeABI({ from: DEPLOYMENT_ACCOUNT_ADDRESS })
  await sendRawTx({
    data: deployHomeBridgeData,
    nonce: homeNonce,
    to: homeFactory.options.address,
    privateKey: deploymentPrivateKey,
    url: process.env.HOME_RPC_URL
  })
  const homeBridgeDeployedEvents = await homeFactory.getPastEvents('HomeBridgeDeployed')
  homeBridgeData.address = homeBridgeDeployedEvents[0].returnValues._homeBridge
  homeBridgeData.token = homeBridgeDeployedEvents[0].returnValues._token
  homeBridgeData.blockNumber = homeBridgeDeployedEvents[0].returnValues._blockNumber
  console.log('\n[Home] Deployed home bridge:', JSON.stringify(homeBridgeData))
}

async function addBridgeMapping() {
  const homeNonce = await web3Home.eth.getTransactionCount(DEPLOYMENT_ACCOUNT_ADDRESS)
  console.log('\n[Home] Add bridge mapping')
  const mapper = new web3Home.eth.Contract(BridgeMapperABI, HOME_BRIDGE_MAPPER_ADDRESS)
  const addBridgeMappingData = await mapper.methods
    .addBridgeMapping(
      ERC20_TOKEN_ADDRESS,
      homeBridgeData.token,
      foreignBridgeData.adderss,
      homeBridgeData.address,
      foreignBridgeData.blockNumber,
      homeBridgeData.blockNumber
    )
    .encodeABI({ from: DEPLOYMENT_ACCOUNT_ADDRESS })
  await sendRawTx({
    data: addBridgeMappingData,
    nonce: homeNonce,
    to: mapper.options.address,
    privateKey: deploymentPrivateKey,
    url: process.env.HOME_RPC_URL
  })
  const bridgeMappingAddedEvents = await mapper.getPastEvents('BridgeMappingAdded')
  bridgeMapping.foreignToken = bridgeMappingAddedEvents[0].returnValues.foreignToken
  bridgeMapping.homeToken = bridgeMappingAddedEvents[0].returnValues.homeToken
  bridgeMapping.foreignBridge = bridgeMappingAddedEvents[0].returnValues.foreignBridge
  bridgeMapping.homeBridge = bridgeMappingAddedEvents[0].returnValues.homeBridge
  bridgeMapping.foreignStartBlock = bridgeMappingAddedEvents[0].returnValues.foreignStartBlock
  bridgeMapping.homeStartBlock = bridgeMappingAddedEvents[0].returnValues.homeStartBlock
  console.log('\n[Home] bridge mapping added: ', JSON.stringify(bridgeMapping))
}

async function deploy() {
  try {
    await deployForeignBridge()
    await deployHomeBridge()
    await addBridgeMapping()
  } catch (e) {
    console.log(e)
  }
}

deploy()
