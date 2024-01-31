const yourFileExports = require('../dist/index.js')

describe('Module exports', () => {
  test('should export SorobanContext', () => {
    expect(yourFileExports.SorobanContext).toBeDefined()
  })

  test('should export SorobanReactProvider', () => {
    expect(yourFileExports.SorobanReactProvider).toBeDefined()
  })

  test('should export useSorobanReact', () => {
    expect(yourFileExports.useSorobanReact).toBeDefined()
  })

  test('should export getDefaultConnectors', () => {
    expect(yourFileExports.getDefaultConnectors).toBeDefined()
  })
})
