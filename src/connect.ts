import { Provider, Wallets, Addresses } from './main'

import connectMyAlgo from './myAlgo/connect'
import connectAlgoSigner from './algoSigner/connect'
import connectPera from './pera/connect'

export interface ConnectSettings {
  wallet: Wallets
}

function clearWallet(p: Provider, w: Wallets) {
  p.addresses = p.addresses.filter(a => a.wallet !== w)
}

export default async function connect (provider: Provider, { wallet }: ConnectSettings) {

  let newAddresses: Addresses

  switch (wallet) {
    case "MyAlgo":
      newAddresses = await connectMyAlgo(provider)
      clearWallet(provider, "MyAlgo")
      break
    case "PeraWallet":
      newAddresses = await connectPera(provider)
      clearWallet(provider, "PeraWallet")
      break
    case "AlgoSigner":
      newAddresses = await connectAlgoSigner(provider)
      clearWallet(provider, "AlgoSigner")
      break
    // case Wallets.EXODUS:
    //   newAddresses = await connectExodus(provider)
    //   clearWallet(provider, Wallets.EXODUS)
    //   break
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