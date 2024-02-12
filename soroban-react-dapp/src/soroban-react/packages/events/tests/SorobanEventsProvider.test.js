const React = require('react')
const { render, unmountComponentAtNode } = require('react-dom')
const { act } = require('react-dom/test-utils')
const { SorobanEventsProvider } = require('../dist/SorobanEventsProvider')
const SorobanClient = require('soroban-client')
const { useSorobanReact } = require('@soroban-react/core')
const SorobanContextPackage = require('../dist/SorobanEventsContext.js')

jest.mock('soroban-client')
jest.mock('@soroban-react/core', () => ({
  useSorobanReact: jest.fn(),
}))

describe('SorobanEventsProvider', () => {
  let container = null
  let server = null

  const { SorobanEventsContext, DefaultSorobanEventsContext } =
    SorobanContextPackage

  // const MockChild = () => <div>Mock Child</div>

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    server = {
      getLatestLedger: jest.fn(),
      getEvents: jest.fn(),
    }

    SorobanClient.xdr.ScVal.scvSymbol.mockReturnValue({ toXDR: jest.fn() })

    useSorobanReact.mockReturnValue({
      server,
    })
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  test('renders without crashing', async () => {
    server.getLatestLedger.mockResolvedValue({ sequence: 12345 })
    server.getEvents.mockResolvedValue({
      events: [
        {
          pagingToken: 'abc',
          data: {
            type: 'contract',
            attributes: [
              {
                key: 'key1',
                value: 'value1',
              },
            ],
          },
        },
      ],
      latestLedger: { sequence: 12345 },
    })

    const subscription = {
      contractId: '0x123',
      topics: ['topic1'],
      cb: jest.fn(),
      id: 1,
      lastLedgerStart: 0,
      pagingToken: 'abc',
    }
    await act(async () => {
      DefaultSorobanEventsContext.subscribe(subscription)

      render(
        <SorobanEventsProvider>
          <div>Mock Child</div>
        </SorobanEventsProvider>,
        container
      )
    })

    expect(container.textContent).toBe('Mock Child')
  })

  test('polls events from the server', async () => {
    server.getLatestLedger.mockResolvedValue({ sequence: 12345 })
    server.getEvents.mockResolvedValue({
      events: [
        {
          pagingToken: 'abc',
          data: {
            type: 'contract',
            attributes: [
              {
                key: 'key1',
                value: 'value1',
              },
            ],
          },
        },
      ],
      latestLedger: { sequence: 12345 },
    })

    await act(async () => {
      render(
        <SorobanEventsProvider>
          <div>Mock Child</div>
        </SorobanEventsProvider>,
        container
      )
    })

    expect(server.getLatestLedger).toHaveBeenCalled()
    expect(SorobanClient.xdr.ScVal.scvSymbol).toHaveBeenCalledWith('topic1')
    expect(server.getEvents).toHaveBeenCalledWith({
      startLedger: undefined,
      cursor: 'abc',
      filters: [
        {
          contractIds: ['0x123'],
          topics: [[undefined]],
          type: 'contract',
        },
      ],
      limit: 10,
    })

    expect(container.textContent).toBe('Mock Child')
  })
})
