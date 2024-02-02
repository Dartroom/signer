import { Provider, Wallets, Address } from '../main'

function clearWallet(addresses: Provider['addresses'], w: Wallets, address?: string) {
  if (address) {
    addresses = addresses.filter(a => (a.wallet !== w) || (a.address !== address))
  } else {
    addresses = addresses.filter(a => a.wallet !== w)
  }
}

export default async function connect ({ defly, addresses }: Provider): Promise<Array<Address>> {

  let accounts: Array<string>

  try {
    accounts = await defly.connect()
  } catch (err) {
    throw new Error('Failed to connect with the Defly Wallet: '+ err)
  }

  defly.connector?.on('disconnect', () => {
    clearWallet(addresses, "DeflyWallet")
  })

  if (accounts && accounts.length > 0) {
    return accounts.map((address) => {
      return {
        address: address,
        wallet: "DeflyWallet"
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or the Defly wallet did not return any.')
  }
}