import type { NextPage } from 'next'
import { EthosWrapper, SignInButton, ethos } from 'ethos-wallet-beta';
import { useEffect, useState } from 'react';
import { RefreshIcon } from '@heroicons/react/solid';

const Home: NextPage = () => {
  const [signer, setSigner] = useState<any>(undefined);
  const [address, setAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');

  const ethosConfiguration = {
    // When testing, use our staging link. When in production you may comment this line out.
    walletAppUrl: 'https://sui-wallet-staging.onrender.com',
    appId: 'ethos-example',
  }

  const onWalletConnected = async (provider: any, signer: any) => {
    setSigner(signer);
    const address = await signer?.getAddress();
    setAddress(address);
    refreshWalletBalance(address)
  }

  const onLogout = () => {
    ethos.logout(true);
    setSigner(undefined);
  }

  const refreshWalletBalance = async (address: string) => {
    setWalletBalance('...');
    const balance = await ethos.getWalletBalance(address);
    setWalletBalance(balance);
  }

  const fund = async () => {
    await ethos.dripSui({ address })
  }

  const mint = async () => {
    try {
      const details = {
        network: 'sui',
        chain: 'sui',
        walletAddress: address,
        address: '0x0000000000000000000000000000000000000002',
        moduleName: 'devnet_nft',
        functionName: 'mint',
        inputValues: [
          "Example NFT Name",
          'This is a description',
          'https://ethoswallet.xyz/assets/images/ethos-email-logo.png'
        ],
        gasBudget: 1000
      }
      const _address = await signer.getAddress()
      console.log('_address :>> ', _address);

      ethos.transact({
        signer,
        details,
        onSigned: () => console.log('tx signed'),
        onCanceled: () => console.log('tx cancelled'),
        onSent: () => console.log('tx sent'),
        onCompleted: async (result: any) => {
          await result;
          console.log("COMPLETED RESULT", result)
          ethos.hideWallet();
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <EthosWrapper
      ethosConfiguration={ethosConfiguration}
      onWalletConnected={({ provider, signer }) => onWalletConnected(provider, signer)}>
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {
          !signer ? (
            <SignInButton
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect
            </SignInButton>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Connected to wallet
              </h2>
              <p><code>{address}</code></p>
              <p>
                <span className="inline-flex items-center text-base font-medium text-ethos-primary space-x-1">
                  <span>Wallet balance: <code>{walletBalance}</code></span>
                  <RefreshIcon
                    className="h-5 w-5  text-blue-500 cursor-pointer"
                    aria-hidden="true"
                    onClick={() => refreshWalletBalance(address)}
                  />
                </span>
              </p>
              <p className='py-4'>
                First, fund this wallet from the Sui faucet:
              </p>
              <button
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={fund}
              >
                Fund
              </button>
              <p className='py-4'>
                then
              </p>
              <button
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={mint}
              >
                Mint an NFT
              </button>
              <p className='py-4'>
                or
              </p>
              <div>
                <button
                  className="mx-2 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={ethos.showWallet}
                >
                  Show wallet
                </button>
                <button
                  className="mx-2 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={onLogout}
                >
                  Sign Out
                </button>
              </div>
            </>
          )
        }
      </div>
    </EthosWrapper>
  )
}

export default Home
