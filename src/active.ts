import { Provider, Wallets } from './main'

export interface ActiveSettings {
  wallet: Wallets
  address?: string
}

export default async function setActive (provider: Provider, { wallet, address }: ActiveSettings) {

  const foundWallet = provider.addresses.find((w) => (w.wallet === wallet) && (w.address === address))

  if (!foundWallet) {
    throw new Error('The selected wallet does not match a wallet from the connected list of wallets.')
  }
  
  provider.active = foundWallet

  localStorage.setItem('@dartsigner-active', JSON.stringify(foundWallet))
}