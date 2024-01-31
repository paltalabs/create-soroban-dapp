const { renderHook } = require('@testing-library/react-hooks')
const { useContext } = require('react')
const { SorobanContext } = require('../dist/SorobanContext.js')
const { useSorobanReact } = require('../dist/useSorobanReact.js')

describe('useSorobanReact', () => {
  test('should throw an error when used outside of SorobanContextProvider', () => {
    const { result } = renderHook(() => useSorobanReact(), {
      wrapper: ({ children }) => (
        <SorobanContext.Provider value={undefined}>
          {children}
        </SorobanContext.Provider>
      ),
    })

    expect(result.error).toEqual(
      Error(
        'useSorobanReact can only be used within the useSorobanReact component'
      )
    )
  })

  test('should return the context value when used within SorobanContextProvider', () => {
    const sorobanContextValue = {
      appName: 'Test App',
      chains: [],
      connectors: [],
      connect: jest.fn(),
      disconnect: jest.fn(),
    }

    const { result } = renderHook(() => useSorobanReact(), {
      wrapper: ({ children }) => (
        <SorobanContext.Provider value={sorobanContextValue}>
          {children}
        </SorobanContext.Provider>
      ),
    })

    expect(result.current).toEqual(sorobanContextValue)
  })
})
