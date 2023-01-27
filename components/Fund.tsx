import { useCallback, useEffect, useState } from 'react'
import { ethos } from 'ethos-connect'
import { ErrorMessage, SuccessMessage } from '.';
import { NETWORK } from '../lib/constants';

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
            await ethos.dripSui({ address: wallet.address, network: NETWORK });
            setFundingSuccess(true);
        } catch (e) {
            console.log("Error", e)
            setFundingError(true);
        }
        setFunding(false);
    }, [wallet, funding]);

    useEffect(() => {
        setFunding(false);
        setFundingSuccess(false);
        setFundingError(false);
    }, [version])

    return (
        <div className='flex flex-col gap-6'>
            {fundingError && (
                <ErrorMessage reset={reset}>
                    <>The faucet did not work. Please try again in a little bit.</>
                </ErrorMessage>
            )}
            {fundingSuccess && (
                <SuccessMessage reset={reset}>
                    <>Your new balance is {wallet?.contents?.suiBalance} Mist!</>
                </SuccessMessage>
            )}
            <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={fund}
            >
                {funding ? <>Funding...</> : <>Fund</>}
            </button>
        </div>
    )
}

export default Fund;