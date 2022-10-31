import { Provider, Wallets } from './main'
import disconnectPera from './pera/disconnect'
import disconnectExodus from './exodus/disconnect'

export interface DisconnectSettings {
  wallet: Wallets
  address?: string
}

function clearWallet(p: Provider, w: Wallets, address?: string) {
  console.log(address)
  if (address) {
    p.addresses = p.addresses.filter(a => (a.wallet !== w) || (a.address !== address))
  } else {
    p.addresses = p.addresses.filter(a => a.wallet !== w)
  }
}

export default async function disconnect (provider: Provider, { wallet, address }: DisconnectSettings) {

  switch (wallet) {
    case Wallets.MYALGO:
      clearWallet(provider, Wallets.MYALGO, address)
      break
    case Wallets.PERA:
      await disconnectPera(provider)
      clearWallet(provider, Wallets.PERA)
      break
    case Wallets.ALGOSIGNER:
      clearWallet(provider, Wallets.ALGOSIGNER, address)
      break
    case Wallets.EXODUS:
      await disconnectExodus(provider)
      clearWallet(provider, Wallets.EXODUS)
      break
  }

  if (provider.active && address) {
    if (provider.active.address === address && provider.active.wallet === wallet) {
      provider.active = undefined
      localStorage.removeItem('@dartsigner-active')
    }
  } else if (provider.active) {
    if (provider.active.wallet === wallet) {
      provider.active = undefined
      localStorage.removeItem('@dartsigner-active')
    }
  }

  localStorage.setItem('@dartsigner-accounts', JSON.stringify(provider.addresses))
}