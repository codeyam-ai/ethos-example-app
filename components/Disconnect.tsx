import { useCallback } from 'react'
import { ethos } from 'ethos-connect'
import { PrimaryButton } from '.';

const Disconnect = ({ reset }: { reset: () => void }) => {
    const { wallet } = ethos.useWallet();

    const disconnect = useCallback(() => {
        reset();
        wallet?.disconnect();
    }, [reset, wallet])

    return (
        <PrimaryButton
            onClick={disconnect}
        >
            Sign Out
        </PrimaryButton>
    )
}

export default Disconnect;