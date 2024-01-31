const yourFileExports = require('../dist/index.js')

describe('Module exports', () => {
  test('should export useContractValue', () => {
    expect(yourFileExports.useContractValue).toBeDefined()
  })

  test('should export useSendTransaction', () => {
    expect(yourFileExports.useSendTransaction).toBeDefined()
  })

  test('should export setTrustline', () => {
    expect(yourFileExports.setTrustline).toBeDefined()
  })
})
