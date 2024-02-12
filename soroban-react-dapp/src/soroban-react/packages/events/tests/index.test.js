const yourFileExports = require('../dist/index.js')

describe('Module exports', () => {
  test('should export SorobanEventsContext', () => {
    expect(yourFileExports.SorobanEventsContext).toBeDefined()
  })

  test('should export SorobanEventsProvider', () => {
    expect(yourFileExports.SorobanEventsProvider).toBeDefined()
  })

  test('should export useSorobanEvents', () => {
    expect(yourFileExports.useSorobanEvents).toBeDefined()
  })
})
