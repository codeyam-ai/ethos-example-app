import { useCallback, useEffect, useState } from 'react'
import { ethos, Transaction } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Transfer = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mintAndTransfer = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransaction = new Transaction();
          mintTransaction.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
            arguments: [
              mintTransaction.pure("Ethos Example NFT"),
              mintTransaction.pure("A sample NFT from Ethos Wallet."),
              mintTransaction.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png")
            ]
          })
    
          const response = await wallet.signAndExecuteTransaction({
            transaction: mintTransaction,
            options: {
              showInput: true,
              showEffects: true,
              showEvents: true,
            }
          });
          console.log("response", response)

          if (response?.effects?.events) {
            const moveEventEvent = response.effects.events.find(
              (e) => ('moveEvent' in e)
            );
            if (!moveEventEvent || !('moveEvent' in moveEventEvent)) return;

            const { moveEvent } = moveEventEvent;
            const objectId = moveEvent.fields?.object_id

            const transferTransaction = new Transaction();
            transferTransaction.transferObjects(
              [transferTransaction.object(objectId)], 
              transferTransaction.pure('0x5c48ea29ac876110006a80d036c5454cae3d1ad1')
            )
            transferTransaction.setGasBudget(1000);

            const transferResponse = await wallet.signAndExecuteTransaction({
              transaction: transferTransaction,
              options: {
                showInput: true,
                showEffects: true,
                showEvents: true,
              }
            });
            console.log("transferResponse", transferResponse)
            setNftObjectId(objectId);
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);


    const reset = useCallback(() => {
        setNftObjectId(null)
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the DevNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mintAndTransfer}
            >
                Mint and Transfer
            </button>
        </div>
    )
}

export default Transfer;