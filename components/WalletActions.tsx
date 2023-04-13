import { useCallback, useState } from 'react';
import { PrimaryButton, Modify, MergeCoins, Sign, Transfer, Transfer2, Clone, Burn, MintCoin, BurnCoin } from '.';
import SignTransaction from './SignTransaction';

const WalletActions = () => {
    const [showActions, setShowActions] = useState(false);

    const _toggle = useCallback(() => {
        setShowActions(prev => !prev)
    }, [])

    return (
        <div>
            <PrimaryButton onClick={_toggle}>
                {showActions ? 'Hide' : 'Show'} Wallet Actions
            </PrimaryButton>
            {showActions && (
                <div className='grid grid-cols-2 gap-6 pt-6'>
                    <Sign />
                    <SignTransaction />
                    <Clone />
                    <Transfer />
                    {/* <Transfer2 /> */}
                    {/* <Modify /> */}
                    <Burn />
                    <MintCoin />
                    <BurnCoin />
                    {/* <MergeCoins /> */}
                </div>
            )}
        </div>
    )
}

export default WalletActions;