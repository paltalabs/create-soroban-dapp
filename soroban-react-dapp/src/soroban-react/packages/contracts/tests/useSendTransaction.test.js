const {
  contractTransaction,
  useSendTransaction,
} = require('../dist/useSendTransaction')
const StellarSdk = require('soroban-client')

// A mock implementation of the soroban server
const server = {
  async prepareTransaction() {
    // return StellarSdk.TransactionBuilder.emptyTransaction()
  },
  async getTransaction(hash) {
    return Promise.resolve({
      status: 'SUCCESS',
      resultXdr: StellarSdk.xdr.TransactionResult.toXDR(),
    })
  },
  async sendTransaction(transactionToSubmit) {
    const txResponse = {
      hash: 'hash_string',
      errorResultXdr: undefined,
      ledger: 12345,
    }
    return Promise.resolve(txResponse)
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(global.console, 'debug').mockImplementation(() => {})
})

describe('contractTransaction', () => {
  test('returns a valid transaction', () => {
    const sourceAccount = new StellarSdk.Account(
      'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
      '231'
    )
    const txn = contractTransaction({
      networkPassphrase: StellarSdk.Networks.TESTNET,
      source: sourceAccount,
      contractId:
        'cd4dae2c409c433b1e1d83994a20214d3e5f60bdd3a817978d8aa7c797864313',
      method: 'someMethod',
      params: [],
    })

    expect(txn instanceof StellarSdk.Transaction).toBe(true)
    expect(txn.operations.length).toBe(1)
    // expect(txn.source.publicKey()).toBe(sourceAccount.publicKey())
  })
})

describe('useSendTransaction', () => {
  test('throws an error when no secret key or active wallet', () => {
    const { result } = renderHook(() =>
      useSendTransaction(undefined, undefined)
    )

    const {
      isIdle,
      isError,
      isLoading,
      isSuccess,
      sendTransaction,
      reset,
      status,
    } = result.current

    expect(isIdle).toEqual(true)
    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(isSuccess).toEqual(false)
    expect(status).toEqual('idle')
    expect(reset).toBeDefined()

    expect(sendTransaction()).rejects.toThrowError(
      'No secret key or active wallet. Provide at least one of those'
    )
  })

  test('throws an error when no transaction or wallet or chain', () => {
    const sorobanContext = {
      activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
      activeConnector: {},
    }

    const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

    const { result } = renderHook(() =>
      useSendTransaction(undefined, {
        secretKey,
        sorobanContext,
      })
    )

    const {
      isIdle,
      isError,
      isLoading,
      isSuccess,
      sendTransaction,
      reset,
      status,
    } = result.current

    expect(isIdle).toEqual(true)
    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(isSuccess).toEqual(false)
    expect(status).toEqual('idle')
    expect(reset).toBeDefined()

    act(() => {
      expect(sendTransaction(undefined, { secretKey })).rejects.toThrowError(
        'No transaction or wallet or chain'
      )
    })
  })

  test('throws an error when not connected to server', () => {
    const sorobanContext = {
      activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
      activeConnector: {
        signTransaction: () => Promise.resolve(''),
      },
      undefined,
    }
    const txn = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(
        'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        '231'
      ),
      { fee: '100', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          amount: '100',
          asset: new StellarSdk.Asset(
            'xlm',
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
          ),
          destination:
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        })
      )
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build()

    const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

    const { result } = renderHook(() =>
      useSendTransaction(txn, {
        secretKey,
        sorobanContext,
      })
    )

    const {
      isIdle,
      isError,
      isLoading,
      isSuccess,
      sendTransaction,
      reset,
      status,
    } = result.current

    expect(isIdle).toEqual(true)
    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(isSuccess).toEqual(false)
    expect(status).toEqual('idle')
    expect(reset).toBeDefined()

    expect(
      sendTransaction(txn, {
        secretKey,
        sorobanContext,
      })
    ).rejects.toThrowError('Not connected to server')
  })

  test('throws an error when no transaction after adding footprint', () => {
    const sorobanContext = {
      activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
      activeConnector: {
        signTransaction: () => Promise.resolve(''),
      },
      server,
    }
    const txn = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(
        'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        '231'
      ),
      { fee: '100', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          amount: '100',
          asset: new StellarSdk.Asset(
            'xlm',
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
          ),
          destination:
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        })
      )
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build()

    const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

    const { result } = renderHook(() =>
      useSendTransaction(txn, {
        secretKey,
        sorobanContext,
      })
    )

    const {
      isIdle,
      isError,
      isLoading,
      isSuccess,
      sendTransaction,
      reset,
      status,
    } = result.current

    expect(isIdle).toEqual(true)
    expect(isError).toEqual(false)
    expect(isLoading).toEqual(false)
    expect(isSuccess).toEqual(false)
    expect(status).toEqual('idle')
    expect(reset).toBeDefined()

    act(() => {
      expect(
        sendTransaction(txn, {
          secretKey,
          sorobanContext,
        })
      ).rejects.toThrowError('No transaction after adding footprint')
    })
  })

  test('throws a custom error when with status as FAILED', async () => {
    const server1 = {
      async prepareTransaction() {
        // return StellarSdk.TransactionBuilder.emptyTransaction()
      },
      async getTransaction(hash) {
        return Promise.resolve({
          status: 'SUCCESS',
          resultXdr: StellarSdk.xdr.TransactionResult.toXDR(),
        })
      },
      async sendTransaction(transactionToSubmit) {
        const txResponse = {
          hash: 'hash_string',
          errorResultXdr: 'XDR Write Error: undefined is not a TransactionResult',
          ledger: 12345,
        }
        return Promise.resolve(txResponse)
      },
    }

    const sorobanContext = {
      activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
      activeConnector: {
        signTransaction: () => Promise.resolve(''),
      },
      server: server1,
    }
    const txn = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(
        'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        '231'
      ),
      { fee: '100', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          amount: '100',
          asset: new StellarSdk.Asset(
            'xlm',
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
          ),
          destination:
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        })
      )
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build()

    const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

    const { result, waitForNextUpdate } = renderHook(() =>
      useSendTransaction(txn, {
        secretKey,
        sorobanContext,
        skipAddingFootprint: true,
      })
    )

    const { sendTransaction } = result.current

    expect(result.current.status).toEqual('idle')
    expect(result.current.isIdle).toEqual(true)
    expect(result.current.isError).toEqual(false)
    expect(result.current.isLoading).toEqual(false)
    expect(result.current.isSuccess).toEqual(false)
    expect(result.current.reset).toBeDefined()

    act(() => {
      expect(
        sendTransaction(txn, {
          secretKey,
          sorobanContext,
          skipAddingFootprint: true,
        })
      ).rejects.toThrowError('XDR Write Error: undefined is not a TransactionResult')
    })

    // await waitForNextUpdate()

    // expect(result.current.status).toEqual('error')
  })

  test('sendTransaction success', () => {
    const server1 = {
      async prepareTransaction() {
        // return StellarSdk.TransactionBuilder.emptyTransaction()
      },
      async getTransaction(hash) {
        return Promise.resolve({
          status: 'FAILED',
          resultXdr: undefined,
        })
      },
      async sendTransaction(transactionToSubmit) {
        const txResponse = {
          hash: 'hash_string',
          errorResultXdr: undefined,
          ledger: 12345,
        }
        return Promise.resolve(txResponse)
      },
    }

    const sorobanContext = {
      activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
      activeConnector: {
        signTransaction: () => Promise.resolve(''),
      },
      server: server1,
    }
    const txn = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(
        'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        '231'
      ),
      { fee: '100', networkPassphrase: StellarSdk.Networks.TESTNET }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          amount: '100',
          asset: new StellarSdk.Asset(
            'xlm',
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
          ),
          destination:
            'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
        })
      )
      .setTimeout(StellarSdk.TimeoutInfinite)
      .build()

    const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

    const { result, waitForNextUpdate } = renderHook(() =>
      useSendTransaction(txn, {
        secretKey,
        sorobanContext,
        skipAddingFootprint: true,
      })
    )

    const { sendTransaction } = result.current

    expect(result.current.isIdle).toEqual(true)
    expect(result.current.isError).toEqual(false)
    expect(result.current.isLoading).toEqual(false)
    expect(result.current.isSuccess).toEqual(false)
    expect(result.current.status).toEqual('idle')
    expect(result.current.reset).toBeDefined()

    act(() => {
      sendTransaction(txn, {
        secretKey,
        sorobanContext,
        skipAddingFootprint: true,
      })
    })
    expect(result.current.status).toEqual('loading')
  })

  // test('throws a custom error when sendTransaction', () => {
  //   const server1 = {
  //     async prepareTransaction() {
  //       // return StellarSdk.TransactionBuilder.emptyTransaction()
  //     },
  //     async getTransaction(hash) {
  //       return Promise.resolve({
  //         status: 'NOT_FOUND',
  //         resultXdr: 'resultXdr',
  //       })
  //     },
  //     async sendTransaction(transactionToSubmit) {
  //       const txResponse = {
  //         hash: 'hash_string',
  //         errorResultXdr: undefined,
  //         ledger: 12345,
  //       }
  //       return Promise.resolve(txResponse)
  //     },
  //   }

  //   const sorobanContext = {
  //     activeChain: { networkPassphrase: StellarSdk.Networks.TESTNET },
  //     activeConnector: {
  //       signTransaction: () => Promise.resolve(''),
  //     },
  //     server: server1,
  //   }
  //   const txn = new StellarSdk.TransactionBuilder(
  //     new StellarSdk.Account(
  //       'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
  //       '231'
  //     ),
  //     { fee: '100', networkPassphrase: StellarSdk.Networks.TESTNET }
  //   )
  //     .addOperation(
  //       StellarSdk.Operation.payment({
  //         amount: '100',
  //         asset: new StellarSdk.Asset(
  //           'xlm',
  //           'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
  //         ),
  //         destination:
  //           'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
  //       })
  //     )
  //     .setTimeout(StellarSdk.TimeoutInfinite)
  //     .build()

  //   const secretKey = 'SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM'

  //   const { result, waitForNextUpdate } = renderHook(() =>
  //     useSendTransaction(txn, {
  //       secretKey,
  //       sorobanContext,
  //       skipAddingFootprint: true,
  //     })
  //   )

  //   const { sendTransaction } = result.current

  //   expect(result.current.isIdle).toEqual(true)
  //   expect(result.current.isError).toEqual(false)
  //   expect(result.current.isLoading).toEqual(false)
  //   expect(result.current.isSuccess).toEqual(false)
  //   expect(result.current.status).toEqual('idle')
  //   expect(result.current.reset).toBeDefined()

  //   act(() => {
  //     sendTransaction(txn, {
  //       secretKey,
  //       sorobanContext,
  //       skipAddingFootprint: true,
  //     })
  //   })

  //   // expect(result).toEqual([StellarSdk.xdr.ScVal.scvI32(-1)])
  // })
})
