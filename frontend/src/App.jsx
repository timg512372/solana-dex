import { useState, Fragment } from "react";
import { Transition, Menu, Dialog } from '@headlessui/react'
import classNames from 'classnames';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import SwapBox from "./SwapBox";

import "./App.css";

export const SendSOLToRandomAddress  = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
      if (!publicKey) throw new WalletNotConnectedError();

      // 890880 lamports as of 2022-09-01
      const lamports = await connection.getMinimumBalanceForRentExemption(0);

      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: Keypair.generate().publicKey,
              lamports,
          })
      );

      const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, { minContextSlot });

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
  }, [publicKey, sendTransaction, connection]);
}

function App() {

  return (
    <div className="App">
      <div>
        <h1>Investing in the Future of<br></br>Solana</h1>
      <div className="content-container">
          <SwapBox />
        </div>
      </div>
    </div>
  );
}

export default App;
