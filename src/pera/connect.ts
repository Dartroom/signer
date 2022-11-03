import { Provider, Wallets, Pera } from '../main'

async function awaitConnect (pera: Pera): Promise<Array<string>> {
  return new Promise((resolve) => {
    pera.connector.on("connect", (error, payload) => {
      if (error) {
        throw new Error('Failed to connect with the Pera Wallet')
      } else {
  
        // Get provided accounts
        const address = payload.params[0]
        const account = address.accounts[0] as string
        resolve([account] as Array<string>)
      }
    })

    pera.connector.on('disconnect',(error, payload) => {
      if (error) {
        throw new Error('Failed to connect with the Pera Wallet')
      }
      resolve([] as Array<string>)
    })
  })
}

export default async function connect ({ pera }: Provider) {

  if (pera.connector.connected) {
    try {
      await pera.connector.killSession()
    } catch {
  
    }
  }

  let accounts = [] as Array<string>

  try {
    await pera.connector.createSession({
      chainId: 4160
    })
  } catch (err) {
    throw new Error('Failed to connect with the Pera Wallet')
  }

  pera.uri = pera.connector.uri
  pera.deeplink = `algorand://` + pera.connector.uri.split(':')[1]

  accounts = await awaitConnect(pera)

  if (accounts && accounts.length > 0) {
    return accounts.map((address) => {
      return {
        address: address,
        wallet: Wallets.PERA
      }
    })
  } else {
    throw new Error('Either the user shared no accounts, or the Pera wallet did not return any.')
  }
}