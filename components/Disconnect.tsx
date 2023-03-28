import { useCallback } from 'react'
import { ethos } from 'ethos-connect'
import { PrimaryButton } from '.';

const Disconnect = () => {
    const { wallet } = ethos.useWallet();

    const disconnect = useCallback(() => {
        if (!wallet) return;
        wallet.disconnect();
    }, [wallet])

    return (
        <PrimaryButton
            onClick={disconnect}
        >
            Sign Out
        </PrimaryButton>
    )
}

export default Disconnect;