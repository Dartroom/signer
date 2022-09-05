import { Provider, Wallets } from './main'
import disconnectPera from './pera/disconnect'

export interface DisconnectSettings {
  wallet: Wallets
}

function clearWallet(p: Provider, w: Wallets) {
  p.addresses = p.addresses.filter(a => a.wallet !== w)
}

export default async function disconnect (provider: Provider, { wallet }: DisconnectSettings) {

  switch (wallet) {
    case Wallets.MYALGO:
      clearWallet(provider, Wallets.MYALGO)
      break
    case Wallets.PERA:
      await disconnectPera(provider)
      clearWallet(provider, Wallets.PERA)
      break
    case Wallets.ALGOSIGNER:
      clearWallet(provider, Wallets.ALGOSIGNER)
      break
  }

  localStorage.setItem('accounts', JSON.stringify(provider.addresses))
}