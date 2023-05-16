import { useEffect } from 'react';
import { JsonRpcProvider, Connection } from '@mysten/sui.js';

const GetOnchainEarnings = () => {
    const connect = new Connection({ fullnode: 'https://sui.ethoswallet.xyz/sui'})
    const provider = new JsonRpcProvider(connect);

    useEffect(() => {
      const getEarnings = async () => {
        const sui8192Earnings = await provider.queryTransactionBlocks({
          filter: {
            MoveFunction: {
              package: "0x72f9c76421170b5a797432ba9e1b3b2e2b7cf6faa26eb955396c773af2479e1e",
              module: "game_8192",
              function: "create"
            }
          },
          options: {
            showBalanceChanges: true,
            showObjectChanges: true,
            showEffects: true,
            showEvents: true,
            showInput: true,
          }
        });

        const squadEarnings = await provider.queryTransactionBlocks({
          filter: {
            MoveFunction: {
              package: "0xf1e7b4093872df432b2adb50533a1fa6f9e4b20856217657242fe7d9d4ac42e8",
              module: "ethos_squad",
              function: "mint_to_sender"
            }
          },
          options: {
            showBalanceChanges: true,
            showObjectChanges: true,
            showEffects: true,
            showEvents: true,
            showInput: true,
          }
        });

        console.log('8192 earnings: ', sui8192Earnings);
        console.log('squad earnings: ', squadEarnings);
      }

      getEarnings();
    }, [])
        

    return (
        <div className='flex flex-col gap-6'>
           <h1>test.</h1>
        </div>
    )
}

export default GetOnchainEarnings;