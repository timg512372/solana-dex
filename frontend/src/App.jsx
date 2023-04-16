import { useState, Fragment, useCallback, useEffect } from "react";
import { Transition, Menu, Dialog } from '@headlessui/react'
import classNames from 'classnames';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import SwapBox from "./SwapBox";

import "./App.css";

function App() {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ balance, setBalance ] = useState(0);

  useEffect(() => {
    (async  () => {
      let balance = await connection.getBalance(publicKey);
      setBalance(balance);
    })();
  }, [publicKey]);

  return (
    <div className="App">
      <div>
        <h1 className="app-title">Investing in the Future of<br></br>Solana</h1>
        {publicKey && (<div className="content-container">
          <SwapBox />
        </div>)}
      </div>
    </div>
  );
}

export default App;
