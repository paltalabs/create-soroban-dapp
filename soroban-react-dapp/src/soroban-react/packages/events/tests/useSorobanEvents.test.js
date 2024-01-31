const React = require('react')
const { renderHook } = require('@testing-library/react-hooks')
const {
  SorobanEventsContext,
  SorobanEventsContextType,
} = require('../dist/SorobanEventsContext')
const { useSorobanEvents } = require('../dist/useSorobanEvents')

describe('useSorobanEvents', () => {
  it('throws when used outside of a provider', () => {
    const { result } = renderHook(() => useSorobanEvents())
    expect(result.error).toEqual(
      Error(
        'useSorobanEvents can only be used within the SorobanEventsProvider component'
      )
    )
  })

  it('returns the expected context values', () => {
    const mockValue = {
      events: ['Addition', 'Subtraction', 'Multiplication'],
      setEvents: jest.fn(),
    }
    const wrapper = ({ children }) => (
      <SorobanEventsContext.Provider value={mockValue}>
        {children}
      </SorobanEventsContext.Provider>
    )
    const { result } = renderHook(() => useSorobanEvents(), { wrapper })
    expect(result.current).toEqual(mockValue)
  })
})
