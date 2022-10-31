import { Provider, Wallets, Addresses, Wallet } from './main'

import connectMyAlgo from './myAlgo/connect'
import connectAlgoSigner from './algoSigner/connect'
import connectPera from './pera/connect'
import connectExodus from './exodus/connect'

export interface ConnectSettings {
  wallet: Wallets
}

function clearWallet(p: Provider, w: Wallets) {
  p.addresses = p.addresses.filter(a => a.wallet !== w)
}

export default async function connect (provider: Provider, { wallet }: ConnectSettings) {

  let newAddresses: Addresses

  switch (wallet) {
    case Wallets.MYALGO:
      newAddresses = await connectMyAlgo(provider)
      clearWallet(provider, Wallets.MYALGO)
      break
    case Wallets.PERA:
      newAddresses = await connectPera(provider)
      clearWallet(provider, Wallets.PERA)
      break
    case Wallets.ALGOSIGNER:
      newAddresses = await connectAlgoSigner(provider)
      clearWallet(provider, Wallets.ALGOSIGNER)
      break
    case Wallets.EXODUS:
      newAddresses = await connectExodus(provider)
      clearWallet(provider, Wallets.EXODUS)
      break
  }

  provider.addresses.push(...newAddresses)
  localStorage.setItem('@dartsigner-accounts', JSON.stringify(provider.addresses))

  if (provider.active && (provider.active.wallet === wallet)) {

    const foundAddress = newAddresses.find((a) => a.address === provider.active?.address)

    if (!foundAddress) {
      provider.active = undefined
      localStorage.removeItem('@dartsigner-active')
    }
  }

  return newAddresses
}