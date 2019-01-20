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

describe('erc to erc (multiple)', () => {
  it('should convert tokens in foreign to tokens in home', async () => {
    // TODO
  })

  it('should convert tokens in home to tokens in foreign', async () => {
    // TODO
  })
})
