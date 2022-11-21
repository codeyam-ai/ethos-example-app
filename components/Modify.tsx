import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { SUI_8192_CONTRACT } from '../lib/constants'
import SuccessMessage from './SuccessMessage';

const Modify = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState(null);

    const mintAndTransfer = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransaction = {
            kind: "moveCall" as const,
            data: {
              packageObjectId: SUI_8192_CONTRACT,
              module: "game_8192",
              function: "create",
              typeArguments: [],
              arguments: [],
              gasBudget: 10000,
            },
          };
    
          const response = await wallet.signAndExecuteTransaction(mintTransaction);
          if (response?.effects?.events) {
            const { moveEvent } = response.effects.events.find((e) => e.moveEvent);
            const objectId = moveEvent.fields.game_id

            const moveTransaction = {
                kind: "moveCall" as const,
                data: {
                  packageObjectId: SUI_8192_CONTRACT,
                  module: "game_8192",
                  function: "make_move",
                  typeArguments: [],
                  arguments: [
                    objectId, 
                    0
                  ],
                  gasBudget: 10000,
                },
            };

            const moveResponse = await wallet.signAndExecuteTransaction(moveTransaction);
            console.log("moveResponse", moveResponse)
            setNftObjectId(objectId);
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
                        View Your NFT on the DevNet Explorer 
                    </a>
                </SuccessMessage>
              )}
              <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mintAndTransfer}
              >
                Mint and Modify
              </button>
          </div>
    )
}

export default Modify;