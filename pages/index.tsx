import type { NextPage } from "next";
import { SignInButton, ethos } from "ethos-connect";
import { useCallback, useState } from "react";

const Home: NextPage = () => {
  const contractAddress = "0x0000000000000000000000000000000000000002";
  const [loading, setLoading] = useState(false);
  const { status, wallet } = ethos.useWallet();

  const fund = useCallback(async () => {
    if (!wallet) return;

    setLoading(true);
    await ethos.dripSui({ address: wallet.address });
    setLoading(false);
  }, [wallet]);

  const mint = useCallback(async () => {
    if (!wallet) return;

    try {
      const signableTransaction = {
        kind: "moveCall" as const,
        data: {
          packageObjectId: contractAddress,
          module: "devnet_nft",
          function: "mint",
          typeArguments: [],
          arguments: [
            "Example NFT Name",
            "This is a description",
            "https://ethoswallet.xyz/assets/images/ethos-email-logo.png",
          ],
          gasBudget: 10000,
        },
      };

      wallet.signAndExecuteTransaction(signableTransaction);
    } catch (error) {
      console.log(error);
    }
  }, [wallet]);

  return (
    <div className="relative">
      <div className="absolute top-12 left-12">Status: {status}</div>

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {!wallet ? (
          <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Connect
          </SignInButton>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Connected to wallet
              </h2>
              <code>{wallet.address}</code>
              <div className="place-content-center text-base font-medium text-ethos-primary space-x-1">
                <div>
                  Wallet balance: <code>{wallet.contents?.suiBalance}</code>{" "}
                  Mist
                </div>
                <div className="text-xs text-gray-500">
                  (1 sui is 10^9 Mist)
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
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
        )}
      </div>
    </div>
  );
};

export default Home;
