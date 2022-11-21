import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'

const Mint = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);

    const mint = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const signableTransaction = {
            kind: "moveCall" as const,
            data: {
              packageObjectId: "0x0000000000000000000000000000000000000002",
              module: "devnet_nft",
              function: "mint",
              typeArguments: [],
              arguments: [
                "Ethos Example NFT",
                "A sample NFT from Ethos Wallet.",
                "https://ethoswallet.xyz/assets/images/ethos-email-logo.png",
              ],
              gasBudget: 10000,
            },
          };
    
          const response = await wallet.signAndExecuteTransaction(signableTransaction);
          if (response?.effects?.events) {
            const { moveEvent } = response.effects.events.find((e) => e.moveEvent);
            setNftObjectId(moveEvent.fields.object_id)
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    const _localReset = useCallback(() => {
        setNftObjectId(null)
    }, [])

    const _reset = useCallback(() => {
        _localReset();
        reset();
    }, [_localReset, reset])

    useEffect(() => {
        _localReset();
    }, [_localReset, version])

    return (
        <>
            {nftObjectId && (
                <div className='p-3 pr-12 bg-green-200 text-sm text-center relative'>
                    <div 
                        className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                        onClick={_reset}
                    >
                        ✕
                    </div>
                    <b>Success!</b>
                    &nbsp; &nbsp;
                    <a 
                        href={`https://explorer.devnet.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the DevNet Explorer 
                    </a>
                </div>
              )}
              <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
              >
                Mint an NFT
              </button>
          </>
    )
}

export default Mint;