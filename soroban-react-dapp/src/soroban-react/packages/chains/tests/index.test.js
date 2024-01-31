const {
  public_chain,
  futurenet,
  testnet,
  sandbox,
  standalone,
} = require('../dist/index.js')

const PUBLIC_PASSPHRASE = 'Public Global Stellar Network ; September 2015'
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015'
const FUTURENET_PASSPHRASE = 'Test SDF Future Network ; October 2022'
const SANDBOX_PASSPHRASE = 'Local Sandbox Stellar Network ; September 2022'
const STANDALONE_PASSPHRASE = 'Standalone Network ; February 2017'

describe('Module exports', () => {
  test('should export public_chain', () => {
    expect(public_chain.id).toEqual('public')
    expect(public_chain.name).toEqual('Public')
    expect(public_chain.networkPassphrase).toEqual(PUBLIC_PASSPHRASE)
  })

  test('should export futurenet', () => {
    expect(futurenet.id).toEqual('public')
    expect(futurenet.name).toEqual('Futurenet')
    expect(futurenet.networkPassphrase).toEqual(FUTURENET_PASSPHRASE)
  })

  test('should export testnet', () => {
    expect(testnet.id).toEqual('public')
    expect(testnet.name).toEqual('Testnet')
    expect(testnet.networkPassphrase).toEqual(TESTNET_PASSPHRASE)
  })

  test('should export sandbox', () => {
    expect(sandbox.id).toEqual('public')
    expect(sandbox.name).toEqual('Sandbox')
    expect(sandbox.networkPassphrase).toEqual(SANDBOX_PASSPHRASE)
  })

  test('should export standalone', () => {
    expect(standalone.id).toEqual('public')
    expect(standalone.name).toEqual('Standalone')
    expect(standalone.networkPassphrase).toEqual(STANDALONE_PASSPHRASE)
  })
})
