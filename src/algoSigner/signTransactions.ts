import { Provider } from '../main'
import { Txn } from '../signTransactions'

export default async function sign ({ algoSigner }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  if (!algoSigner) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }

  const binaryTxns: Array<{ txn: string, signers?: Array<string> }> = []
  const unsignedTxns: Array<Txn> = []

  for (let g = 0; g < txns.length; g++) {

    const txnArray = txns[g]

    if (!txnArray) {
      throw new Error('Failed to parse transaction array.')
    }

    for (let t = 0; t < txnArray.length; t++) {

      const txn = txnArray[t]

      if (!txn) {
        throw new Error('Failed to parse transaction array.')
      }
      
      unsignedTxns.push(txn)

      if (txn.signers.length > 1) {
        binaryTxns.push({
          txn: algoSigner.encoding.msgpackToBase64(txn.blob),
          signers: txn.signers
        })
      } else {
        binaryTxns.push({
          txn: algoSigner.encoding.msgpackToBase64(txn.blob)
        })
      }
    }
  }

  const signedTxns = await algoSigner.signTxn(binaryTxns) as unknown as Array<{ blob: string, txID: string }>

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {

      const unsignedTxn = unsignedTxns[i]

      if (!unsignedTxn) {
        throw new Error('Failed to parse transaction array.')
      }

      return {
        blob: Uint8Array.from(atob(txn.blob), c => c.charCodeAt(0)),
        txID: unsignedTxn.txID,
        signers: unsignedTxn.signers
      }
    })
  } else {
    throw new Error('')
  }
}