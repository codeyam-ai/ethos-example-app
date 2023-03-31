import type { NextPage } from "next";
import { SignInButton, ethos } from "ethos-connect";
import { useCallback, useEffect, useState } from "react";
import { Disconnect, Fund, Mint, WalletActions } from "../components";
import { EthosWallet, EthosWalletAccount } from "../lib/EthosWallet";

const Home: NextPage = () => {
  const { status, wallet } = ethos.useWallet();
  const [test, setTest] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sendMessageToExtension = (message: any) => {
    console.log("Sending message to extension:", message);
    window.parent.postMessage(message, "*");
  };

  const iframeMessageListener = (event: MessageEvent) => {
    // Check the origin of the message to ensure it's coming from your extension
    // if (event.origin !== 'chrome-extension://YOUR_EXTENSION_ID') return;
    console.log("message received");

    setTest(true);
    const data = event.data;

    console.log('🌈🌈🌈🌈 data :>> ', data);

    const ethosAccount = new EthosWalletAccount()
    ethosAccount.address = data;

    const ethosWallet = new EthosWallet();
    ethosWallet.accounts = [ethosAccount];
    console.log('WALLETT >>', ethosWallet);
    console.log('ethosAccount >>>', ethosAccount);

    (window as any).ethosWallet = ethosWallet;

    const callback = ({ register }: { register: any }) => {
      console.log('callbaek!!', register, ethosWallet)
      try {
        const result = register(ethosWallet);
        console.log('results', result);
      } catch (e: any) {
        console.log(e.message);
      }
    }

    window.dispatchEvent(
      new CustomEvent("wallet-standard:register-wallet", {
        bubbles: false,
        cancelable: false,
        detail: callback,
      })
    );

    // Handle the message based on its type
    switch (data.type) {
      case 'ETHOS_TEST':
        console.log('Received message from extension:', data);
        // Perform desired actions
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  useEffect(() => {
    console.log("Adding message listener");
    window.addEventListener("message", iframeMessageListener);

    console.log("Sending message to parent");
    const message = {
      type: "TEST_FROM_IFRAME",
      data: "Hello from iframe!",
    };
    window.parent.postMessage(message, "*");

    sendMessageToExtension({
      type: "IFRAME_READY",
      data: "Iframe is ready to receive messages!",
    });

    return () => {
      console.log("Removing message listener");
      window.removeEventListener("message", iframeMessageListener);
    };
  }, []);


  const WalletStandardAppReadyListener = ({ detail: { register } }: any) => {
    console.log('WalletStandardAppReadyListener REGISTERED, LISTENING')
    try {
      register(wallet);  
    } catch (e) {
      console.log('ERROR: wallet-standard:app-ready', e);
      // window.ReactNativeWebView.postMessage(e.message);
    }
  }

  useEffect(() => {
    window.addEventListener('message', iframeMessageListener);
    setLoaded(true);
    console.log("loaded!!!");

    console.log('adding wallet standard listener');
    window.addEventListener('wallet-standard:app-ready', WalletStandardAppReadyListener);

    return () => {
      window.removeEventListener('message', iframeMessageListener);
      window.removeEventListener('wallet-standard:app-ready', WalletStandardAppReadyListener);
    };
  }, []);

  return (
    <div className="flex justify-between items-start">
      <div>TEST: {test ? 'true' : 'false'}</div>
      <div>LOADED: {loaded ? 'true' : 'false'}</div>
      <div className="p-12 flex-1">Status: {status}</div>

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
        {!wallet ? (
          <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Connect
          </SignInButton>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Connected to wallet
              </h2>
              <code>{wallet.address}</code>
              <div className="place-content-center text-base font-medium text-ethos-primary space-x-1">
                <div>
                  Wallet balance: <code>{wallet.contents?.suiBalance.toString()}</code>{" "}
                  Mist
                </div>
                <div className="text-xs text-gray-500">
                  (1 sui is 10^9 Mist)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              First, fund this wallet from the Sui faucet:
              <Fund />
              then
              <Mint />
              or
              <WalletActions />
              or
              <Disconnect />
            </div>
          </div>
        )}
      </div>

      <div className="p-12 flex-1 flex justify-end">
        <ethos.components.AddressWidget
          excludeButtons={[
            ethos.enums.AddressWidgetButtons.WalletExplorer
          ]}
        />
      </div>
    </div>
  );
};

export default Home;
