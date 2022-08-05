import type { NextPage } from 'next'
import { EthosWrapper, SignInButton, ethos } from 'ethos-wallet-beta';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [signer, setSigner] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const ethosConfiguration = {
    // walletAppUrl: 'http://localhost:3000',
    appId: 'ethos-example',
  }

  const onWalletConnected = (provider: any, signer: any) => {
    setSigner(signer);
    console.log('provider :>> ', provider);
    console.log('signer :>> ', signer);
  }

  useEffect(() => {
    setLoading(false)
  }, []);

  return (
    <>
      <EthosWrapper
        ethosConfiguration={ethosConfiguration}
        onWalletConnected={({ provider, signer }) => onWalletConnected(provider, signer)}
      >
        {
          loading ? (
            <p>Loading...</p>
          ) : (
            <SignInButton
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Connect
            </SignInButton>
          )
        }
        {/* <SignInButton
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Connect
        </SignInButton> */}
      </EthosWrapper>
    </>
  )
}

export default Home
