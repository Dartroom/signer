import { Provider, Wallets } from '../main'

export default async function connect ({ exodus }: Provider) {

  if (!exodus) {
    throw new Error('Failed to connect with the Exodus. Make sure the browser extension is installed.')
  }

  try {
    await exodus.connect()
  } catch (err) {
    try {
      await exodus.connect()
    } catch (err) {
      throw new Error('Failed to connect with the Exodus. Make sure the browser extension is installed.')
    }
  }

  let accounts
  
  try {
    accounts = exodus.accounts
  } catch (err) {
    throw new Error('There were no addresses found in your Exodus account. Please add an address and try again.')
  }

  if (accounts) {
    return [{
      address: accounts[0],
      wallet: Wallets.EXODUS
    }]
  } else {
    throw new Error('Either the user shared no accounts, or Exodus did not return any.')
  }
}