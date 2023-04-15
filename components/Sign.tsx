import { useCallback, useEffect, useState } from 'react'

import { ethos, verifyMessage, IntentScope } from 'ethos-connect';
import { ErrorMessage, SuccessMessage } from '.';

const Sign = () => {
    const { wallet } = ethos.useWallet();

    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const sign = useCallback(async () => {
        const response = await wallet?.signMessage({ message: "Hello" });
        if (!response) {
            setSignError(true);
        } else {
            console.log("Sign result: ", response)

            const { messageBytes, signature } = response;
            const verified = await verifyMessage(messageBytes, signature, IntentScope.PersonalMessage);
            console.log("Message verified: ", verified)
            
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
                onClick={sign}
            >
                Sign the message &quot;Hello&quot;
            </button>
        </div>
    )
}

export default Sign;