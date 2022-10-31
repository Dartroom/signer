import { Provider } from '../main'

export default async function disconnect ({ exodus }: Provider) {

  try {
    await exodus.disconnect()
  } catch {

  }
}