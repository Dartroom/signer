import { Provider, Wallets, Address } from '../main'

// async function awaitConnect (pera: Pera): Promise<Array<string>> {
//   return new Promise((resolve) => {
//     pera.connector.on("connect", (error, payload) => {
//       if (error) {
//         throw new Error('Failed to connect with the Pera Wallet')
//       } else {
  
//         // Get provided accounts
//         const address = payload.params[0]
//         const account = address.accounts[0] as string
//         resolve([account] as Array<string>)
//       }
//     })

//     pera.connector.on('disconnect',(error, payload) => {
//       if (error) {
//         throw new Error('Failed to connect with the Pera Wallet')
//       }
//       resolve([] as Array<string>)
//     })
//   })
// }

function clearWallet(addresses: Provider['addresses'], w: Wallets, address?: string) {
  if (address) {
    addresses = addresses.filter(a => (a.wallet !== w) || (a.address !== address))
  } else {
    addresses = addresses.filter(a => a.wallet !== w)
  }
}


export default async function connect ({ pera, addresses }: Provider): Promise<Array<Address>> {

  // handeld by disconnect event
  // if (pera.isConnected) {
  //   try {
  //     await pera.disconnect()
  //   } catch (err) {
  //     throw new Error('Failed to disconnect from the current account: ' + err)
  //   }
  // }

  let accounts: Array<string>

  try {
    accounts = await pera.connect()
  } catch (err) {
    throw new Error('Failed to connect with the Pera Wallet: '+ err)
  }

  // Wallet Connect implementation
  // if (pera.connector.connected) {
  //   try {
  //     await pera.connector.killSession()
  //   } catch {
  
  //   }
  // }

  // let accounts = [] as Array<string>

  // try {
  //   await pera.connector.createSession({
  //     chainId: 4160
  //   })
  // } catch (err) {
  //   throw new Error('Failed to connect with the Pera Wallet')
  // }

  // pera.uri = pera.connector.uri
  // pera.deeplink = `algorand://` + pera.connector.uri.split(':')[1]

  // accounts = await awaitConnect(pera)

  pera.connector?.on('disconnect', () => {
    clearWallet(addresses, "PeraWallet")
  })

  if (accounts && accounts.length > 0) {
    return accounts.map((address) => {
      return {
        address: address,
        wallet: "PeraWallet"
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or the Pera wallet did not return any.')
  }
}