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
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint`,
            arguments: [
              mintTransactionBlock.pure("Ethos Example NFT"),
              mintTransactionBlock.pure("A sample NFT from Ethos Wallet."),
              mintTransactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png")
            ]
          })
          mintTransactionBlock.transferObjects(
            [nft],
            mintTransactionBlock.pure('0xb0e24ba1afc3d2f5e348b569e72e94cf20ec2cecf3cd27edea1c3ad628e5374c', 'address')
          )
    
          const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock: mintTransactionBlock,
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
                        View Your NFT on the TestNet Explorer 
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