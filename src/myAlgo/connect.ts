import { Provider, Wallets } from '../main'
import MyAlgoConnect from '@randlabs/myalgo-connect'

export default async function connect ({ }: Provider) {
  const myAlgo = new MyAlgoConnect()

  const accounts = await myAlgo.connect({
    shouldSelectOneAccount: false,
    openManager: true,
  })

  if (accounts && accounts.length > 0) {
    return accounts.map((a) => {
      return {
        address: a.address,
        wallet: Wallets.MYALGO
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or MyAlgo did not return any.')
  }
}