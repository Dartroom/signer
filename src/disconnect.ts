import { Provider, Wallets } from './main'
import disconnectPera from './pera/disconnect'
import disconnectDefly from './defly/disconnect'
import disconnectExodus from './exodus/disconnect'

export interface DisconnectSettings {
  wallet: Wallets
  address?: string
}

function clearWallet(p: Provider, w: Wallets, address?: string) {
  if (address) {
    p.addresses = p.addresses.filter(a => (a.wallet !== w) || (a.address !== address))
  } else {
    p.addresses = p.addresses.filter(a => a.wallet !== w)
  }
}

export default async function disconnect (provider: Provider, { wallet, address }: DisconnectSettings) {

  switch (wallet) {
    case "MyAlgo":
      clearWallet(provider, "MyAlgo", address)
      break
    case "PeraWallet":
      await disconnectPera(provider)
      clearWallet(provider, "PeraWallet")
      break
    case "DeflyWallet":
      await disconnectDefly(provider)
      clearWallet(provider, "DeflyWallet")
      break
    case "AlgoSigner":
      clearWallet(provider, "AlgoSigner", address)
      break
    // case Wallets.EXODUS:
    //   await disconnectExodus(provider)
    //   clearWallet(provider, Wallets.EXODUS)
    //   break
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