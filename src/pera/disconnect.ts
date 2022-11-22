import { Provider } from '../main'

export default async function disconnect ({ pera }: Provider) {

  if (pera.isConnected) {
    try {
      await pera.disconnect()
    } catch (err) {
      throw new Error('Failed to disconnect from the current account: ' + err)
    }
  }

  // Wallet Connect implementation
  // try {
  //   await pera.connector.killSession()
  // } catch {

  // }
}