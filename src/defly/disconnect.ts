import { Provider } from '../main'

export default async function disconnect ({ defly }: Provider) {

  if (defly.isConnected) {
    try {
      await defly.disconnect()
    } catch (err) {
      throw new Error('Failed to disconnect from the current account: ' + err)
    }
  }
}