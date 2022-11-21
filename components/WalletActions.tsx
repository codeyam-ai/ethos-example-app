import { useCallback, useState } from 'react';
import { PrimaryButton, Sign, Transfer} from '.';

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
                    <Transfer
                        version={version}
                        reset={reset}
                    />
                </div>
            )}
        </div>
    )
}

export default WalletActions;