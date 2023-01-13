import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT, ETHOS_COIN_TYPE, ETHOS_EXAMPLE_COIN_TREASURY_CAP } from '../lib/constants';

const Mint = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | null>(null);

    const mint = useCallback(async () => {
        if (!wallet) return;
    
        try {
          const mintTransaction = {
            kind: "moveCall" as const,
            data: {
              packageObjectId: ETHOS_EXAMPLE_CONTRACT,
              module: "ethos_example_coin",
              function: "mint",
              typeArguments: [],
              arguments: [ETHOS_EXAMPLE_COIN_TREASURY_CAP, "100000"],
              gasBudget: 10000,
            },
          };
    
          const response = await wallet.signAndExecuteTransaction(mintTransaction);
          if (response?.effects?.events) {
            const coinBalanceChangeEvent = response.effects.events.find(
                (e) => (
                    ('coinBalanceChange' in e) &&
                    ('coinType' in e.coinBalanceChange) &&
                    (e.coinBalanceChange.coinType === ETHOS_COIN_TYPE)
                )
            );

            if (!coinBalanceChangeEvent || !('coinBalanceChange' in coinBalanceChangeEvent)) return;

            const { coinBalanceChange } = coinBalanceChangeEvent

            if (!coinBalanceChange || !('coinObjectId' in coinBalanceChange)) return;

            const { coinObjectId } = coinBalanceChange;
            setNftObjectId(coinObjectId as string)
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
                        View Your Coin on the DevNet Explorer 
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