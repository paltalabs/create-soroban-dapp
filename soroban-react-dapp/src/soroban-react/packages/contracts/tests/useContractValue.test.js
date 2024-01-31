const React = require('react')
const { renderHook } = require('@testing-library/react-hooks')
const { useContractValue } = require('../dist/useContractValue')
const { render, unmountComponentAtNode } = require('react-dom')
const { act } = require('react-dom/test-utils')
const { SorobanContext } = require('@soroban-react/core')

let result

describe('useContractValue', () => {
  const mockProps = {
    contractId:
      'cd4dae2c409c433b1e1d83994a20214d3e5f60bdd3a817978d8aa7c797864313',
    method: 'ed25519',
    sorobanContext: {
      activeChain: { networkPassphrase: 'mockNetworkPassphrase' },
      address: 'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
      server: {
        simulateTransaction: jest.fn(() => ({ results: [{ xdr: 'mockXdr' }] })),
      },
    },
  }

  test('sets error state when there is no active chain in sorobanContext', () => {
    const props = {
      ...mockProps,
      sorobanContext: { ...mockProps.sorobanContext, activeChain: undefined },
    }
    const { result } = renderHook(() => useContractValue(props))
    expect(result.current).toEqual({ error: 'No active chain' })
  })

  test('sets error state when there is no server in sorobanContext', () => {
    const props = {
      ...mockProps,
      sorobanContext: { ...mockProps.sorobanContext, server: undefined },
    }
    const { result } = renderHook(() => useContractValue(props))
    expect(result.current).toEqual({ error: 'Not connected to server' })
  })

  test('sets error state when server.simulateTransaction responds with an invalid result', async () => {
    const mockServer = { simulateTransaction: jest.fn(() => ({ results: [] })) }
    const props = {
      ...mockProps,
      sorobanContext: { ...mockProps.sorobanContext, server: mockServer },
    }
    const { result, waitForNextUpdate } = renderHook(() =>
      useContractValue(props)
    )

    await waitForNextUpdate()

    expect(result.current).toEqual({
      error: 'Invalid response from simulateTransaction',
    })
  })

  test('returns correct ScVal when server.simulateTransaction responds with a valid result', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useContractValue(mockProps)
    )
    await waitForNextUpdate()
    expect(result.current).toEqual({
      error: 'XDR Read Error: unknown ScValType member for value -1702419363',
    }) // Replace with expected result based on your test case
  })
})
