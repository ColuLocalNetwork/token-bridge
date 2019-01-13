require('dotenv').config()

const { toBN } = require('web3').utils
const { web3Home, web3Foreign } = require('../src/services/web3')
const { privateKeyToAddress } = require('../src/utils/utils')

const homeNativeErcAbi = require('../abis/HomeBridgeNativeToErc.abi')
const foreignNativeErcAbi = require('../abis/ForeignBridgeNativeToErc.abi')

const homeErcErcAbi = require('../abis/HomeBridgeErcToErc.abi')
const foreignErcErcAbi = require('../abis/ForeignBridgeErcToErc.abi')

const homeErcNativeAbi = require('../abis/HomeBridgeErcToNative.abi')
const foreignErcNativeAbi = require('../abis/ForeignBridgeErcToNative.abi')

const { VALIDATOR_ADDRESS, VALIDATOR_ADDRESS_PRIVATE_KEY } = process.env

let homeAbi
let foreignAbi
let id

switch (process.env.BRIDGE_MODE) {
  case 'NATIVE_TO_ERC':
    homeAbi = homeNativeErcAbi
    foreignAbi = foreignNativeErcAbi
    id = 'native-erc'
    break
  case 'ERC_TO_ERC':
    homeAbi = homeErcErcAbi
    foreignAbi = foreignErcErcAbi
    id = 'erc-erc'
    break
  case 'ERC_TO_ERC_MULTIPLE':
    homeAbi = homeErcErcAbi
    foreignAbi = foreignErcErcAbi
    id = 'erc-erc-multiple'
    break
  case 'ERC_TO_NATIVE':
    homeAbi = homeErcNativeAbi
    foreignAbi = foreignErcNativeAbi
    id = 'erc-native'
    break
  default:
    if (process.env.NODE_ENV !== 'test') {
      throw new Error(`Bridge Mode: ${process.env.BRIDGE_MODE} not supported.`)
    } else {
      homeAbi = homeErcNativeAbi
      foreignAbi = foreignErcNativeAbi
      id = 'erc-native'
    }
}

let maxProcessingTime = null
if (String(process.env.MAX_PROCESSING_TIME) === '0') {
  maxProcessingTime = 0
} else if (!process.env.MAX_PROCESSING_TIME) {
  maxProcessingTime =
    4 * Math.max(process.env.HOME_POLLING_INTERVAL, process.env.FOREIGN_POLLING_INTERVAL)
} else {
  maxProcessingTime = Number(process.env.MAX_PROCESSING_TIME)
}

const bridgeConfigBasic = {
  homeBridgeAbi: homeAbi,
  foreignBridgeAbi: foreignAbi,
  eventFilter: {},
  validatorAddress: VALIDATOR_ADDRESS || privateKeyToAddress(VALIDATOR_ADDRESS_PRIVATE_KEY),
  maxProcessingTime
}

const bridgeConfig = {
  ...bridgeConfigBasic,
  homeBridgeAddress: process.env.HOME_BRIDGE_ADDRESS,
  foreignBridgeAddress: process.env.FOREIGN_BRIDGE_ADDRESS
}

const homeConfigBasic = {
  eventAbi: homeAbi,
  bridgeAbi: homeAbi,
  pollingInterval: process.env.HOME_POLLING_INTERVAL,
  web3: web3Home
}

const homeConfig = {
  ...homeConfigBasic,
  eventContractAddress: process.env.HOME_BRIDGE_ADDRESS,
  bridgeContractAddress: process.env.HOME_BRIDGE_ADDRESS,
  startBlock: toBN(process.env.HOME_START_BLOCK || 0)
}

const foreignConfigBasic = {
  eventAbi: foreignAbi,
  bridgeAbi: foreignAbi,
  pollingInterval: process.env.FOREIGN_POLLING_INTERVAL,
  web3: web3Foreign
}

const foreignConfig = {
  ...foreignConfigBasic,
  eventContractAddress: process.env.FOREIGN_BRIDGE_ADDRESS,
  bridgeContractAddress: process.env.FOREIGN_BRIDGE_ADDRESS,
  startBlock: toBN(process.env.FOREIGN_START_BLOCK || 0)
}

// TODO shouldn't be hardcoded :)
const multipleBridgesConfig = {
  multipleBridges: [
    {
      // CLN (ropsten) to RCLN (fuse)
      homeBridgeAddress: '0x65a493469e15e37009a6c44b83387c45746f1559',
      // homeTokenAddress: '0x71242c1163effa46ddefb16834ef9043854d1b36',
      homeStartBlock: toBN(672994),
      foreignBridgeAddress: '0x65a493469E15e37009a6c44b83387C45746f1559',
      foreignTokenAddress: '0x41C9d91E96b933b74ae21bCBb617369CBE022530',
      foreignStartBlock: toBN(4708513)
    },
    {
      // SMT (ropsten) to RSMT (fuse)
      homeBridgeAddress: '0xDe888eb4D162fCf5e3ED47FEdedf1Dd518D2aF31',
      // homeTokenAddress: '0x3fcD19d7C058c11858dA1354028d90955450Ae12',
      homeStartBlock: toBN(881242),
      foreignBridgeAddress: '0x7210c63b6C6C4a57eef6fb941a50ff24D7F6aA94',
      foreignTokenAddress: '0xE4430c2E8E6cC5cb4D270505F120E1CC9B0b3612',
      foreignStartBlock: toBN(4785898)
    }
  ]
}

module.exports = {
  bridgeConfigBasic,
  bridgeConfig,
  homeConfigBasic,
  homeConfig,
  foreignConfigBasic,
  foreignConfig,
  multipleBridgesConfig,
  id
}
