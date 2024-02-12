const SorobanContextPackage = require('../dist/SorobanEventsContext.js')

describe('Soroban Events context', () => {
  const { SorobanEventsContext, DefaultSorobanEventsContext } =
    SorobanContextPackage
  test('Initializes default context', async () => {
    expect(DefaultSorobanEventsContext.subscriptions).toBeDefined()
    expect(DefaultSorobanEventsContext.subscribe).toBeDefined()
    expect(DefaultSorobanEventsContext.unsubscribe).toBeDefined()
  })

  it('should subscribe to an event', () => {
    const subscription = {
      contractId: '0x123',
      topics: ['topic1'],
      cb: jest.fn(),
      id: 1,
      lastLedgerStart: 0,
      pagingToken: 'abc',
    }

    const subscription1 = {
      contractId: '0x4567',
      topics: ['topic2'],
      cb: jest.fn(),
      id: 2,
      lastLedgerStart: 1,
      pagingToken: 'def',
    }

    const { result } = renderHook(
      () => {
        DefaultSorobanEventsContext.subscribe(subscription)
        DefaultSorobanEventsContext.subscribe(subscription1)
        DefaultSorobanEventsContext.subscribe(subscription1)
      },
      {
        wrapper: ({ children }) => (
          <SorobanEventsContext.Provider value={DefaultSorobanEventsContext}>
            {children}
          </SorobanEventsContext.Provider>
        ),
      }
    )

    expect(result.current).toBeUndefined()
    expect(DefaultSorobanEventsContext.subscriptions.length).toBe(2)
    expect(DefaultSorobanEventsContext.subscriptions[0]).toEqual(subscription)
    expect(DefaultSorobanEventsContext.subscriptions[1]).toEqual(subscription1)
  })

  it('should unsubscribe from an event', () => {
    const subscription = {
      contractId: '0x123',
      topics: ['topic1'],
      cb: jest.fn(),
      id: 1,
      lastLedgerStart: 0,
      pagingToken: 'abc',
    }
    DefaultSorobanEventsContext.subscriptions.push(subscription)

    const { result } = renderHook(
      () => DefaultSorobanEventsContext.unsubscribe(1),
      {
        wrapper: ({ children }) => (
          <SorobanEventsContext.Provider value={DefaultSorobanEventsContext}>
            {children}
          </SorobanEventsContext.Provider>
        ),
      }
    )

    expect(DefaultSorobanEventsContext.subscriptions.length).toBe(2)

    const { result1 } = renderHook(
      () => DefaultSorobanEventsContext.unsubscribe(5),
      {
        wrapper: ({ children }) => (
          <SorobanEventsContext.Provider value={DefaultSorobanEventsContext}>
            {children}
          </SorobanEventsContext.Provider>
        ),
      }
    )

    expect(DefaultSorobanEventsContext.subscriptions.length).toBe(2)
  })
})
