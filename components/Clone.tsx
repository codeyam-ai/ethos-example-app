import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const Clone = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const clone = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransaction = {
            kind: "moveCall" as const,
            data: {
              packageObjectId: ETHOS_EXAMPLE_CONTRACT,
              module: "example",
              function: "mint",
              typeArguments: [],
              arguments: [],
              gasBudget: 10000,
            },
          };
    
          const response = await wallet.signAndExecuteTransaction(mintTransaction);
          if (response?.effects?.events) {
            const newObjectEvent = response.effects.events.find(
              (e) => ('newObject' in e)
            );
            if (!newObjectEvent || !('newObject' in newObjectEvent)) return;

            const { newObject: { objectId } } = newObjectEvent;
            
            const cloneTransaction = {
              kind: "moveCall" as const,
              data: {
                packageObjectId: ETHOS_EXAMPLE_CONTRACT,
                module: "example",
                function: "clone",
                typeArguments: [],
                arguments: [
                  objectId
                ],
                gasBudget: 10000,
              },
            };

            await wallet.signAndExecuteTransaction(cloneTransaction);
            setNftObjectId(objectId)
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    useEffect(() => {
        setNftObjectId(null)
    }, [version])

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.devnet.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View your cloned NFT on the DevNet Explorer 
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