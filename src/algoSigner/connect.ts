import { Provider, Wallets } from '../main'

export default async function connect ({ algoSigner, ledger }: Provider) {

  if (!algoSigner) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }

  let accounts

  try {
    const reponse = await algoSigner.algorand.enable({
      genesisID: ledger === 'TESTNET' ? 'testnet-v1.0' : 'mainnet-v1.0'
    }) 
    accounts = reponse.accounts as Array<string>
  } catch (err) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }
  
  // try {
  //   accounts = await algoSigner.algoSigner.accounts({ ledger: ledger }) as unknown as Array<{ address: string }>
  // } catch (err) {
  //   throw new Error('There were no addresses found in your AlgoSigner account. Please add an address and try again.')
  // }

  if (accounts && accounts.length > 0) {
    return accounts.map((a) => {
      return {
        address: a,
        wallet: Wallets.ALGOSIGNER
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or the AlgoSigner did not return any.')
  }
}