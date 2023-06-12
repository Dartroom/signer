import { Provider, Wallets, Address } from '../main'
import MyAlgoConnect from '@randlabs/myalgo-connect'

export default async function connect ({ }: Provider): Promise<Array<Address>> {
  const myAlgo = new MyAlgoConnect()

  const accounts = await myAlgo.connect({
    shouldSelectOneAccount: false,
    openManager: true,
  })

  if (accounts && accounts.length > 0) {
    return accounts.map((a) => {
      return {
        address: a.address,
        wallet: "MyAlgo"
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or MyAlgo did not return any.')
  }
}