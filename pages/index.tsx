import type { NextPage } from 'next'
import { EthosWrapper, SignInButton, ethos } from 'ethos-connect';
import { useCallback, useEffect, useState } from 'react';
import { RefreshIcon } from '@heroicons/react/solid';
import ExampleIcon from '../icons/ExampleIcon';

const Home: NextPage = () => {
  const contractAddress = '0x0000000000000000000000000000000000000002';
  const [signer, setSigner] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');

  const { connected, connecting, getAddress } = ethos.useSuiWalletConnect()
  const { contents } = ethos.useContents();


  const ethosConfiguration = {
    // When testing, use our staging link. When in production you may comment this line out.
    // walletAppUrl: 'https://sui-wallet-staging.onrender.com',
    appId: 'ethos-example-app',
  }

  const onWalletConnected = async (provider: any, signer: any) => {
    if (signer) {
      setSigner(signer);
      const address = await getAddress();
      setAddress(address);
      refreshWalletBalance(address)
      console.log('contents :>> ', contents);
      const walletContents = await ethos.getWalletContents(address);
      console.log('ethos.getWalletContents() :>> ', walletContents);
    }
  }

  const onLogout = () => {
    ethos.logout(signer);
    setSigner(undefined);
  }

  const refreshWalletBalance = async (address: string) => {
    setWalletBalance('...');
    const walletContents = await ethos.getWalletContents(address);
    setWalletBalance(walletContents.suiBalance.toString());
  }

  const fund = async () => {
    setLoading(true);
    await ethos.dripSui({ address })
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

      ethos.transact({
        signer,
        signableTransaction,
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <EthosWrapper
      ethosConfiguration={ethosConfiguration}
      onWalletConnected={({ provider, signer }) => onWalletConnected(provider, signer)}
      dappName='EthosConnect Example App'
      dappIcon={<ExampleIcon />}
      connectMessage='Your connect message goes here!'
    >
      {/* Connected: {connected ? 'true' : 'false'}
      <br />
      Connecting: {connecting ? 'true' : 'false'} */}

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {
          !signer ? (
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
                <code>{address}</code>
                <div className="flex flex-row place-content-center text-base font-medium text-ethos-primary space-x-1">
                  <span>Wallet balance: <code>{walletBalance}</code></span>
                  <RefreshIcon
                    className="h-5 w-5  text-blue-500 cursor-pointer"
                    aria-hidden="true"
                    onClick={() => refreshWalletBalance(address)}
                  />
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
                  onClick={onLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )
        }
      </div>
    </EthosWrapper>
  )
}

export default Home
