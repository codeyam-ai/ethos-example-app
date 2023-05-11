import { useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { ErrorMessage, SuccessMessage } from '.';

const MergeCoins = () => {
    const { wallet } = ethos.useWallet();
    const [mergedCoinId, setMergedCoinId] = useState<string | undefined>();
    const [error, setError] = useState<string | undefined>()

    const mergeCoins = useCallback(async () => {
    //     if (!wallet) return;
        
    //     let inputCoins = wallet.contents.tokens['0x2::sui::SUI'].coins.map((c: any) => c.objectId)
    //     if (inputCoins.length < 3) {
    //         setError("You don't have enough coins to merge them.")
    //         return;
    //     } else {
    //         console.log("inputCoins0", inputCoins);
    //         inputCoins = inputCoins.slice(0, (inputCoins.length + 1) / 2)
    //     }
    //     console.log("inputCoins", inputCoins);

    //     try {
    //       const payTransaction = {
    //         kind: "payAllSui" as const,
    //         data: {
    //           inputCoins,
    //           recipient: wallet.address,
    //           gasBudget: 1000,
    //         },
    //       };
    
    //       const response = await wallet.signAndExecuteTransaction(payTransaction);
    //       const mergedCoinId = response.effects.mutated?.[0]?.reference?.objectId;
    //       setMergedCoinId(mergedCoinId);
    //     } catch (error) {
    //       console.log(error);
    //     }
    }, [wallet]);

    const reset = useCallback(() => {
        setError(undefined)
        setMergedCoinId(undefined)
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {mergedCoinId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${mergedCoinId}?network=testnet`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View your merged coin on the Sui Explorer
                    </a>
                </SuccessMessage>
            )}
            {error && (
                <ErrorMessage reset={reset}>
                    {error}
                </ErrorMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mergeCoins}
            >
                Merge Coins
            </button>
        </div>
    )
}

export default MergeCoins;