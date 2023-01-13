import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT, ETHOS_EXAMPLE_COIN_TREASURY_CAP, ETHOS_COIN_TYPE } from '../lib/constants';

const Burn = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();
    const [transactionId, setTransactionId] = useState<string | null>(null);

    const clone = useCallback(async () => {
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
            const coinEvent = response.effects.events.find(
              (e) => (
                'coinBalanceChange' in e &&
                e.coinBalanceChange && 
                e.coinBalanceChange.coinType === ETHOS_COIN_TYPE
              )
            );

            if (!coinEvent || !('coinBalanceChange' in coinEvent)) return;

            const { coinBalanceChange: { coinObjectId } } = coinEvent;
            
            const burnTransaction = {
              kind: "moveCall" as const,
              data: {
                packageObjectId: ETHOS_EXAMPLE_CONTRACT,
                module: "ethos_example_coin",
                function: "burn",
                typeArguments: [],
                arguments: [
                  ETHOS_EXAMPLE_COIN_TREASURY_CAP,
                  coinObjectId                  
                ],
                gasBudget: 10000,
              },
            };
            

            const burnResponse = await wallet.signAndExecuteTransaction(burnTransaction);
            setTransactionId(burnResponse.effects.transactionDigest)
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    useEffect(() => {
      setTransactionId(null)
    }, [version])

    return (
        <div className='flex flex-col gap-6'>
            {transactionId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/transactions/${encodeURI(transactionId)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Coin burn transaction on the DevNet Explorer
                    </a>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={clone}
            >
                Burn A Coin
            </button>
        </div>
    )
}

export default Burn;