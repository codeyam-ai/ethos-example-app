import { createFactory, useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Mint = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | undefined>();

    const mint = useCallback(async () => {
        if (!wallet?.currentAccount) return;
    
        try {
          const transactionBlock = new TransactionBlock();
          transactionBlock.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
            arguments: [
              transactionBlock.pure("Ethos Example NFT"),
              transactionBlock.pure("A sample NFT from Ethos Wallet."),
              transactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png"),
            ]
          })
    
          const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock,
            options: {
              showObjectChanges: true,
            }
          });
          
          if (response?.objectChanges) {
            const createdObject = response.objectChanges.find(
              (e) => e.type === "created"
            );
            if (createdObject && "objectId" in createdObject) {
              setNftObjectId(createdObject.objectId)
            }
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setNftObjectId(undefined)
    }, [])

    useEffect(() => {
        reset()
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${nftObjectId}?network=testnet`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the TestNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
            >
                Mint an NFT
            </button>
        </div>
    )
}

export default Mint;