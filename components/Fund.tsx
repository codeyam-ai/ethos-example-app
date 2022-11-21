import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'

const Fund = ({ version, reset }: { version: number, reset: () => void }) => {
    const { wallet } = ethos.useWallet();

    const [funding, setFunding] = useState(false);
    const [fundingSuccess, setFundingSuccess] = useState(false);
    const [fundingError, setFundingError] = useState(false);

    const fund = useCallback(async () => {
        if (!wallet || funding) return;
    
        setFunding(true);
        setFundingError(false);
        try {
            await ethos.dripSui({ address: wallet.address });
            setFundingSuccess(true);
        } catch (e) {
            console.log("Error", e)
            setFundingError(true);
        }
        setFunding(false);
    }, [wallet, funding]);

    const _localReset = useCallback(() => {
        setFunding(false);
        setFundingSuccess(false);
        setFundingError(false);
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
            {fundingError && (
                <div className='p-3 pr-12 bg-red-200 text-sm text-center relative'>
                <div 
                    className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                    onClick={reset}
                >
                    ✕
                </div>
                The faucet did not work. Please try again in a little bit.
                </div>
            )}
            {fundingSuccess && (
                <div className='p-3 pr-12 bg-green-200 text-sm text-center relative'>
                    <div 
                        className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-2 right-2'
                        onClick={_reset}
                    >
                        ✕
                    </div>
                    <b>Success!</b>
                    &nbsp; &nbsp;
                    Your new balance is {wallet?.contents?.suiBalance} Mist!
                </div>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={fund}
            >
                {funding ? <>Funding...</> : <>Fund</>}
            </button>
        </>
    )
}

export default Fund;