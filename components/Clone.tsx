import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Clone = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const clone = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransactionBlock = new TransactionBlock(); 
          mintTransactionBlock.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::example::mint`
          })
    
          const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock: mintTransactionBlock,
            options: {
              showObjectChanges: true,
            }
          });
          if (response?.objectChanges) {
            const newObjectEvent = response.objectChanges.find(
              (e) => e.type === "created"
            );
            if (!newObjectEvent || !('objectId' in newObjectEvent)) return;

            const { objectId } = newObjectEvent;
            
            const cloneTransactionBlock = new TransactionBlock();
            cloneTransactionBlock.moveCall({
              target: `${ETHOS_EXAMPLE_CONTRACT}::example::clone`,
              arguments: [
                cloneTransactionBlock.object(objectId)
              ]
            });

            await wallet.signAndExecuteTransactionBlock({
              transactionBlock: cloneTransactionBlock
            });
            setNftObjectId(objectId)
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
                        href={`https://explorer.sui.io/objects/${nftObjectId}?network=testnet`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View your cloned NFT on the TestNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={clone}
            >
                Clone an NFT
            </button>
        </div>
    )
}

export default Clone;