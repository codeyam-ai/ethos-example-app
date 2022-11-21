import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect';

const Sign = ({ version, reset }: {  version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();

    const [signSuccess, setSignSuccess] = useState(false);
    const [signError, setSignError] = useState(false);

    const sign = useCallback(async () => {
        const response = await wallet?.sign({ message: "Hello" });
        if (!response) {
            setSignError(true);
        } else {
            console.log("Sign result: ", response)
            setSignSuccess(true);
        }
        
    }, [wallet]);

    const _localReset = useCallback(() => {
        setSignSuccess(false);
        setSignError(false);
    }, [])

    const _reset = useCallback(() => {
        _localReset();
        reset();
    }, [_localReset, reset])

    useEffect(() => {
        _localReset();
    }, [_localReset, version])

    return (
        <>
            {signSuccess && (
                <div className='p-3 pr-12 bg-green-200 text-sm text-center relative'>
                    <div 
                        className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                        onClick={reset}
                    >
                        ✕
                    </div>
                    <b>Success!</b>
                    &nbsp;
                    Check the developer console to see the result.
                </div>
            )}
            {signError && (
                <div className='p-3 pr-12 bg-red-200 text-sm text-center relative'>
                <div 
                    className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                    onClick={_reset}
                >
                    ✕
                </div>
                Signing did not work. See the developer console for additional information.
                </div>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={sign}
            >
                Sign the message &quot;Hello&quot;
            </button>
          </>
    )
}

export default Sign;