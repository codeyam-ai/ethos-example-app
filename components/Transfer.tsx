import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Transfer = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mintAndTransfer = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransactionBlock = new TransactionBlock();
          const nft = mintTransactionBlock.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
            arguments: [
              mintTransactionBlock.pure("Ethos Example NFT"),
              mintTransactionBlock.pure("A sample NFT from Ethos Wallet."),
              mintTransactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png")
            ]
          })
          mintTransactionBlock.transferObjects(
            [nft],
            mintTransactionBlock.pure('0x5c48ea29ac876110006a80d036c5454cae3d1ad1')
          )
    
          const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock: mintTransactionBlock,
            options: {
              showObjectChanges: true,
            }
          });
          
          console.log("RESPONSE", response)  
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