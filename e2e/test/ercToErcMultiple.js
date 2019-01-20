const path = require('path')
const Web3 = require('web3')
const assert = require('assert')
const promiseRetry = require('promise-retry')
const { user } = require('../constants.json')
const { generateNewBlock } = require('../utils/utils')

const abisDir = path.join(__dirname, '..', 'submodules/poa-bridge-contracts/build/contracts')

const homeWeb3 = new Web3(new Web3.providers.HttpProvider('http://parity1:8545'))
const foreignWeb3 = new Web3(new Web3.providers.HttpProvider('http://parity2:8545'))

const { toBN } = foreignWeb3.utils

homeWeb3.eth.accounts.wallet.add(user.privateKey)
foreignWeb3.eth.accounts.wallet.add(user.privateKey)

const HOME_BRIDGE_ADDRESS = '0x23Bd185ECd604d391DEa93e67084AC1bf636E0ed'
const FOREIGN_BRIDGE_ADDRESS = '0x23Bd185ECd604d391DEa93e67084AC1bf636E0ed'
const HOME_TOKEN_ADDRESS = '0xe0B5C31FD53953a36bF3755044410Ba04CC8856D'
const FOREIGN_TOKEN_ADDRESS = '0x7cF104437Dc33093078D715AC9b50dDbd256685b'

describe('erc to erc (multiple)', () => {
  it('should convert tokens in foreign to tokens in home', async () => {
    // TODO
  })

  it('should convert tokens in home to tokens in foreign', async () => {
    // TODO
  })
})
