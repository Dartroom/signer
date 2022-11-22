import { Provider } from '../main'
import { Txn } from '../signTransactions'

export default async function sign ({ algoSigner }: Provider, txns: Array<Array<Txn>>): Promise<Array<Txn>> {

  if (!algoSigner) {
    throw new Error('Failed to connect with the AlgoSigner. Make sure the browser extension is installed.')
  }

  const binaryTxns: Array<{ txn: string, signers?: Array<string> }> = []
  const unsignedTxns: Array<Txn> = []

  for (let g = 0; g < txns.length; g++) {
    for (let t = 0; t < txns[g].length; t++) {
      
      unsignedTxns.push(txns[g][t])

      if (txns[g][t].signers.length > 1) {
        binaryTxns.push({
          txn: algoSigner.encoding.msgpackToBase64(txns[g][t].blob),
          signers: txns[g][t].signers
        })
      } else {
        binaryTxns.push({
          txn: algoSigner.encoding.msgpackToBase64(txns[g][t].blob)
        })
      }
    }
  }

  const signedTxns = await algoSigner.signTxn(binaryTxns) as unknown as Array<{ blob: string, txID: string }>

  if (signedTxns.length > 0) {
    return signedTxns.map((txn, i) => {
      return {
        blob: Uint8Array.from(atob(txn.blob), c => c.charCodeAt(0)),
        txID: unsignedTxns[i].txID,
        signers: unsignedTxns[i].signers
      }
    })
  } else {
    throw new Error('')
  }
}