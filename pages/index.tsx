import type { NextPage } from 'next'
import { SignInButton, ethos } from 'ethos-connect';
import { useState } from 'react';

const Home: NextPage = () => {
  const contractAddress = '0x0000000000000000000000000000000000000002';
  const [loading, setLoading] = useState(false);
  const { connected, connecting, wallet } = ethos.useWallet()

  const fund = async () => {
    setLoading(true);
    await ethos.dripSui({ address: wallet.address })
    setLoading(false);
  }

  const mint = async () => {
    try {
      const signableTransaction = {
        kind: "moveCall" as const,
        data: {
          packageObjectId: contractAddress,
          module: 'devnet_nft',
          function: 'mint',
          typeArguments: [],
          arguments: [
            "Example NFT Name",
            'This is a description',
            'https://ethoswallet.xyz/assets/images/ethos-email-logo.png'
          ],
          gasBudget: 10000
        }
      };

      wallet.signAndExecuteTransaction({
        signableTransaction,
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      Connected: {connected ? 'true' : 'false'}
      <br />
      Connecting: {connecting ? 'true' : 'false'}

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {
          !wallet ? (
            <SignInButton
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect
            </SignInButton>
          ) : (
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-2'>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Connected to wallet
                </h2>
                <code>{wallet.address}</code>
                <div className="flex flex-row place-content-center text-base font-medium text-ethos-primary space-x-1">
                  <span>Wallet balance: <code>{wallet.contents?.suiBalance}</code></span>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                First, fund this wallet from the Sui faucet:
                <button
                  className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={fund}
                >
                  Fund
                </button>
                then
                <button
                  className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={mint}
                >
                  Mint an NFT
                </button>
                or
                <button
                  className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={wallet.disconnect}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
