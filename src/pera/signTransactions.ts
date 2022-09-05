import { Provider } from '../main'
import { Txn } from '../signTransactions'

export default async function sign ({ pera }: Provider, txns: Array<Array<Txn>>): Promise<Array<{ blob: Uint8Array, txID: string }>> {

  const txnIDs: Array<string> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      txnIDs.push(txns[g][t].txn.txID())
    }
  }

  let signedTxns: Array<Uint8Array> = []

  pera.reconnectSession().then(async () => {
    signedTxns = await pera.signTransaction(txns)
  })

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {
      return {
        blob: txn,
        txID: txnIDs[i]
      }
    })
  } else {
    throw new Error('')
  }
}