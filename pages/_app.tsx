import { EthosConnectProvider } from "ethos-connect";
import ExampleIcon from "../icons/ExampleIcon";

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NETWORK } from "../lib/constants";

function MyApp({ Component, pageProps }: AppProps) {
  const ethosConfiguration = {
    // When testing, use our staging link. When in production you may comment this line out.
    // walletAppUrl: 'https://sui-wallet-staging.onrender.com',
    apiKey: "ethos-example-app",
    preferredWallets: ['Ethos Wallet'],
    network: NETWORK
  };

  return (
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="EthosConnect Example App"
      dappIcon={<ExampleIcon />}
      connectMessage="Your connect message goes here!"
    >
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}

export default MyApp;
