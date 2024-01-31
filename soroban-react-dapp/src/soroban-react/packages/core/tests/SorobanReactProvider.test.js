const React = require('react')
const { render, unmountComponentAtNode } = require('react-dom')
const { act } = require('react-dom/test-utils')
const { SorobanReactProvider } = require('../dist/SorobanReactProvider')

jest.mock('soroban-client', () => ({
  Server: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('@soroban-react/types', () => ({
  Connector: jest.fn(),
  WalletChain: jest.fn(),
}))

describe('SorobanReactProvider', () => {
  let container = null

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  test('renders without crashing', async () => {
    const mockChains = {
      id: 'testnet',
      name: 'testnet',
      networkPassphrase: 'testnet',
    }

    await act(async () => {
      render(
        <SorobanReactProvider chains={[mockChains]} connectors={[]}>
          <div>Test</div>
        </SorobanReactProvider>,
        container
      )
    })

    expect(container.textContent).toBe('Test')
  })

  test('connects to wallet when autoconnect is true', async () => {
    let activeConnectorMock = {
      isConnected: jest.fn().mockReturnValue(true),
      getPublicKey: jest.fn().mockResolvedValue('address'),
      getNetworkDetails: jest.fn().mockResolvedValue({
        networkUrl: 'http://example.com',
        networkPassphrase: 'test',
      }),
    }

    const mockChains = [
      {
        id: 'testnet',
        name: 'testnet',
        networkPassphrase: 'test',
      },
    ]
    await act(async () => {
      render(
        <SorobanReactProvider
          autoconnect
          chains={mockChains}
          connectors={[activeConnectorMock]}
        >
          <div>Test</div>
        </SorobanReactProvider>,
        container
      )
    })

    expect(activeConnectorMock.getNetworkDetails).toHaveBeenCalled()
    expect(activeConnectorMock.getPublicKey).toHaveBeenCalledTimes(2)
  })

  // test('reconnects when address changes', async () => {
  //   const activeConnectorMock = {
  //     getNetworkDetails: jest.fn().mockResolvedValue({
  //       networkUrl: 'http://example.com',
  //       networkPassphrase: 'test',
  //     }),
  //     isConnected: jest.fn().mockReturnValue(true),
  //     getPublicKey: jest
  //       .fn()
  //       .mockResolvedValueOnce('address1')
  //       .mockResolvedValueOnce('address2'),
  //   }

  //   await act(async () => {
  //     render(
  //       <SorobanReactProvider
  //         autoconnect
  //         chains={[]}
  //         connectors={[activeConnectorMock]}
  //       >
  //         <div>Test</div>
  //       </SorobanReactProvider>,
  //       container
  //     )
  //   })

  //   expect(activeConnectorMock.getNetworkDetails).toHaveBeenCalled()
  //   expect(activeConnectorMock.getPublicKey).not.toHaveBeenCalled()

  //   await act(async () => {
  //     activeConnectorMock.getPublicKey.mockResolvedValueOnce('address2')
  //     await jest.useFakeTimers(300)
  //   })

  //   expect(activeConnectorMock.getPublicKey).not.toHaveBeenCalledTimes(2)
  // })

  // test('reconnects when networkPassphrase changes', async () => {
  //   const activeConnectorMock = {
  //     getNetworkDetails: jest
  //       .fn()
  //       .mockResolvedValueOnce({
  //         networkUrl: 'http://example.com',
  //         networkPassphrase: 'test1',
  //       })
  //       .mockResolvedValueOnce({
  //         networkUrl: 'http://example.com',
  //         networkPassphrase: 'test2',
  //       }),
  //     isConnected: jest.fn().mockReturnValue(true),
  //     getPublicKey: jest.fn().mockResolvedValue('address'),
  //   }

  //   await act(async () => {
  //     render(
  //       <SorobanReactProvider
  //         autoconnect
  //         chains={[]}
  //         connectors={[activeConnectorMock]}
  //       >
  //         <div>Test</div>
  //       </SorobanReactProvider>,
  //       container
  //     )
  //   })

  //   expect(activeConnectorMock.getNetworkDetails).toHaveBeenCalled()

  //   await act(async () => {
  //     activeConnectorMock.getNetworkDetails.mockResolvedValueOnce({
  //       networkUrl: 'http://example.com',
  //       networkPassphrase: 'test2',
  //     })
  //     jest.useFakeTimers(300)
  //   })

  //   expect(activeConnectorMock.getNetworkDetails).not.toHaveBeenCalledTimes(2)
  //   // Expect reconnect to be called
  // })

  // test('throws an error when the wallet network is not supported', async () => {
  //   const activeConnectorMock = {
  //     getNetworkDetails: jest.fn().mockResolvedValue({
  //       networkUrl: 'http://example.com',
  //       networkPassphrase: 'unsupported',
  //     }),
  //     isConnected: jest.fn().mockReturnValue(true),
  //     getPublicKey: jest.fn().mockResolvedValue('address'),
  //   }

  //   await act(async () => {
  //     try {
  //       render(
  //         <SorobanReactProvider chains={[]} connectors={[activeConnectorMock]}>
  //           <div>Test</div>
  //         </SorobanReactProvider>,
  //         container
  //       )
  //     } catch (error) {
  //       expect(error.message).toBe(
  //         'Your Wallet network is not supported in this app'
  //       )
  //     }
  //   })

  //   expect(activeConnectorMock.getNetworkDetails).toHaveBeenCalled()
  // })

  test('disconnects when SorobanReactProvider unmounts', async () => {
    const activeConnectorMock = {
      isConnected: jest.fn().mockReturnValue(true),
      getPublicKey: jest.fn().mockResolvedValue('address'),
      getNetworkDetails: jest.fn().mockResolvedValue({}),
    }

    await act(async () => {
      render(
        <SorobanReactProvider chains={[]} connectors={[activeConnectorMock]}>
          <div>Test</div>
        </SorobanReactProvider>,
        container
      )
    })

    await act(async () => {
      unmountComponentAtNode(container)
    })
  })
})
