import { useCallback, useState } from 'react';
import { PrimaryButton, Modify, MergeCoins, Sign, Transfer, Transfer2, Clone, Burn, MintCoin, BurnCoin } from '.';

const WalletActions = ({ version, reset }: { version: number, reset: () => void }) => {
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
                    <Sign
                        version={version}
                        reset={reset}
                    />
                    <Clone
                        version={version}
                        reset={reset}
                    />
                    <Transfer
                        version={version}
                        reset={reset}
                    />
                    <Transfer2
                        version={version}
                        reset={reset}
                    />
                    <Modify
                        version={version}
                        reset={reset}
                    />
                    <Burn
                        version={version}
                        reset={reset}
                    />
                    <MintCoin
                        version={version}
                        reset={reset}
                    />
                    <BurnCoin
                        version={version}
                        reset={reset}
                    />
                    <MergeCoins
                        version={version}
                        reset={reset}
                    />
                </div>
            )}
        </div>
    )
}

export default WalletActions;