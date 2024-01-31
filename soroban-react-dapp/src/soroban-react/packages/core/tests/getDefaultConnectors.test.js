const { getDefaultConnectors } = require('../dist/getDefaultConnectors.js')
const { freighter } = require('@soroban-react/freighter')

describe('getDefaultConnectors', () => {
  test('should contain the freighter connector', () => {
    const connectors = getDefaultConnectors()
    const foundFreighter = connectors.find(
      connector => connector.id === freighter().id
    )
    expect(foundFreighter).toBeDefined()
    expect(foundFreighter.name).toBe(freighter().name)
  })

  test('should return a new array on each function call', () => {
    const connectors1 = getDefaultConnectors()
    const connectors2 = getDefaultConnectors()
    expect(connectors1).not.toBe(connectors2)
  })
})
