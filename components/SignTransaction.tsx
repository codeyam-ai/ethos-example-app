import { useCallback, useEffect, useState } from 'react'

import { ethos , TransactionBlock} from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';

const SignTransaction = () => {
    const { wallet } = ethos.useWallet();

    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const signTransaction = useCallback(async () => {
        const transactionBlock = new TransactionBlock();
        transactionBlock.moveCall({
        target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
        arguments: [
            transactionBlock.pure("Ethos Example NFT"),
            transactionBlock.pure("A sample NFT from Ethos Wallet."),
            transactionBlock.pure("https://ethoswallet.xyz/assets/images/ethos-email-logo.png"),
        ]
        })

        const response = await wallet?.signTransactionBlock({ transactionBlock });
        if (!response) {
            setSignError(true);
        } else {
            console.log("Sign result: ", response)
            setSignSuccess(true);
        }
        
    }, [wallet]);

    const reset = useCallback(() => {
        setSignSuccess(false);
        setSignError(false);
    }, [])

    useEffect(() => {
        reset();
    }, [reset])

    return (
        <div className='flex flex-col gap-6'>
            {signSuccess && (
                <SuccessMessage reset={reset}>
                    Check the developer console to see the result.
                </SuccessMessage>
            )}
            {signError && (
                <ErrorMessage reset={reset}>
                    Signing did not work. See the developer console for additional information.
                </ErrorMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={signTransaction}
            >
                Sign transaction
            </button>
        </div>
    )
}

export default SignTransaction;