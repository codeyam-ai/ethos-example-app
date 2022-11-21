import { useCallback } from 'react'
import { ethos } from 'ethos-connect'

const Disconnect = ({ reset }: { reset: () => void }) => {
    const { wallet } = ethos.useWallet();

    const disconnect = useCallback(() => {
        reset();
        wallet?.disconnect();
    }, [reset, wallet])

    return (
        <button
            className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={disconnect}
        >
            Sign Out
        </button>
    )
}

export default Disconnect;