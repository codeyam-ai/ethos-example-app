import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT, ETHOS_COIN_TYPE, ETHOS_EXAMPLE_COIN_TREASURY_CAP } from '../lib/constants';

const Mint = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mint = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const transactionBlock = new TransactionBlock();
          transactionBlock.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_coin::mint`,
            arguments: [
                transactionBlock.object(ETHOS_EXAMPLE_COIN_TREASURY_CAP),
                transactionBlock.pure("100000")
            ]
          })
    
          const response = await wallet.signAndExecuteTransactionBlock({ 
            transactionBlock, 
            options: { 
                showObjectChanges: true,
            }
          });

          if (response.objectChanges) {
            const createObjectChange = response.objectChanges.find(
                (objectChange) => objectChange.type === "created"
            );

            if (!!createObjectChange && "objectId" in createObjectChange) {
                setNftObjectId(createObjectChange.objectId)
            }
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
                        View Your Coin on the TestNet Explorer 
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
            >
                Mint a Coin
            </button>
        </div>
    )
}

export default Mint;