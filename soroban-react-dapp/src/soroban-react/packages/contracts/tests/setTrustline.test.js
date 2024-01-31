const { setTrustline } = require('../dist/setTrustline')
const StellarSdk = require('soroban-client')
describe('setTrustline', () => {
  const tokenSymbol = 'XLM'
  const tokenAdmin = 'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB'
  const account = 'GBRIRLB2XNFKPNRUHBJDTSJI5KVLZRLZAOU7TCGKITA3SZU3IBJKKXBV'
  const sorobanContext = {
    server: 'https://soroban-rpc.stellar.org',
    activeChain: {
      networkPassphrase: 'Test SoroNet',
    },
  }
  const sendTransaction = (
    tx,
    { timeout, skipAddingFootprint, sorobanContext }
  ) => {
    return 'TranactionResult'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(global.console, 'debug').mockImplementation(() => {})
  })

  test('should throw error if not connected to server', async () => {
    sorobanContext.server = ''
    await expect(
      setTrustline({
        tokenSymbol,
        tokenAdmin,
        account,
        sorobanContext,
        sendTransaction,
      })
    ).rejects.toThrowError('Not connected to server')
  })

  test('should throw error if no networkPassphrase', async () => {
    sorobanContext.server = 'https://soroban-rpc.stellar.org'
    sorobanContext.activeChain.networkPassphrase = ''
    await expect(
      setTrustline({
        tokenSymbol,
        tokenAdmin,
        account,
        sorobanContext,
        sendTransaction,
      })
    ).rejects.toThrowError('No networkPassphrase')
  })

  test('should call sendTransaction with trustline transaction', async () => {
    const mockAccount = {
      sequence: '1234567890', // Must be a string to mimic Soroban Server response
    }
    sorobanContext.server = {
      async getAccount() {
        return new StellarSdk.Account(
          'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
          '231'
        )
      },
    }
    sorobanContext.activeChain.networkPassphrase = 'Test SoroNet'
    const result = await setTrustline({
      tokenSymbol,
      tokenAdmin,
      account,
      sorobanContext,
      sendTransaction,
    })
    // expect(transactionBuilderSpy).toHaveBeenCalledWith(mockAccount, {
    //   networkPassphrase: sorobanContext.activeChain.networkPassphrase,
    //   fee: '1000',
    // })
    expect(result).toEqual('TranactionResult')
  })

  test('should call sendTransaction with trustline transaction', async () => {
    const mockAccount = {
      sequence: '1234567890', // Must be a string to mimic Soroban Server response
    }
    sorobanContext.server = {
      async getAccount() {
        return new StellarSdk.Account(
          'GAV6GQGSOSGCRX262R4MTGKNT6UDWJTNUQLLWBZK5CHHRB5GMNNC7XAB',
          '231'
        )
      },
    }
    sorobanContext.activeChain.networkPassphrase = 'Test SoroNet'
    const result = await setTrustline({
      tokenSymbol,
      tokenAdmin,
      account,
      sorobanContext,
      sendTransaction,
    })
    // expect(transactionBuilderSpy).toHaveBeenCalledWith(mockAccount, {
    //   networkPassphrase: sorobanContext.activeChain.networkPassphrase,
    //   fee: '1000',
    // })
    expect(result).toEqual('TranactionResult')
  })
})
