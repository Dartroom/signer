import { Provider, Wallets } from '../main'

export default async function connect ({ pera }: Provider) {

  try {
    // await pera.disconnect()

  } catch {

  }

  let accounts = []

  try {
    // accounts = await pera.connect()
  } catch (err) {
    throw new Error('Failed to connect with the Pera Wallet')
  }

  // if (accounts && accounts.length > 0) {
    return []
    // return accounts.map((address) => {
    //   return {
    //     address: address,
    //     wallet: Wallets.PERA
    //   }
    // })
  // } else {
    throw new Error('Either the user shared no accounts, or MyAlgo did not return any.')
  // }
}