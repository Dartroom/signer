import { Provider, Wallets, Addresses, Wallet } from './main'

import connectMyAlgo from './myAlgo/connect'
import connectAlgoSigner from './algoSigner/connect'
import connectPera from './pera/connect'

export interface ConnectSettigns {
  wallet: Wallets
}

function clearWallet(p: Provider, w: Wallets) {
  p.addresses = p.addresses.filter(a => a.wallet !== w)
}

export default async function connect (provider: Provider, { wallet }: ConnectSettigns) {

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
  }

  provider.addresses.push(...newAddresses)
  localStorage.setItem('accounts', JSON.stringify(provider.addresses))

  return newAddresses
}