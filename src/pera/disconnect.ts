import { Provider } from '../main'

export default async function disconnect ({ pera }: Provider) {

  try {
    await pera.connector.killSession()
  } catch {

  }
}