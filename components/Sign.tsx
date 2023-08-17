import { useCallback, useEffect, useState } from 'react'

import { ethos } from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '.';
import { verifyPersonalMessage } from '@mysten/sui.js/verify';
import { toB64 } from '@mysten/sui.js/utils';

const Sign = () => {
    const { wallet } = ethos.useWallet();

    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const sign = useCallback(async () => {
        if (!wallet) return;

        const message = new TextEncoder().encode('hello');
        const response = await wallet.signPersonalMessage({ message });
        if (!response) {
            setSignError(true);
        } else {
            console.log("Sign result: ", response)

            const {bytes, signature } = response;

            try {
                // use verifyTransactionBlock() for transaction blocks
                const publicKey = await verifyPersonalMessage(message, signature);
                console.log("Signing public key: ", publicKey)
                console.log("Signing address: ", publicKey.toSuiAddress());
                console.log("Verified message: ", bytes === toB64(message) && wallet?.address === publicKey.toSuiAddress())
                console.log("Visit https://github.com/EthosWallet/ethos-example-app/blob/main/components/Sign.tsx#L20 for more details.") 

                setSignSuccess(true);
            } catch (e) {
                console.error(e);
                setSignError(true);
            }
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
                onClick={sign}
            >
                Sign the message &quot;Hello&quot;
            </button>
        </div>
    )
}

export default Sign;