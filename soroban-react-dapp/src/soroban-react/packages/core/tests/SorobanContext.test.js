const SorobanContextPackage = require('../dist/SorobanContext.js')

describe('Soroban context', () => {
  const { SorobanContext, defaultSorobanContext } = SorobanContextPackage
  test('Initializes default context', async () => {
    expect(defaultSorobanContext.server.serverURL.hostname()).toBe(
      'soroban-rpc.stellar.org'
    )
    expect(await defaultSorobanContext.connect()).toBeUndefined()
    expect(await defaultSorobanContext.disconnect()).toBeUndefined()
  })
})
