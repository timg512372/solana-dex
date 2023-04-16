import { useState, Fragment, useCallback, useEffect } from "react";
import { Transition, Menu, Dialog } from '@headlessui/react'
import classNames from 'classnames';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import SwapBox from "./SwapBox";

import "./App.css";
import image from './assets/solanaText.png';

function App() {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      let balance = await connection.getBalance(publicKey);
      setBalance(balance);
    })();
  }, [publicKey]);

  let titleCSS;
  if (publicKey) {
    titleCSS = "temp-animation"
  } else {
    titleCSS = "temp-animation temp-center"
  }

  return (
    <div className={titleCSS}>
      <div className = "title-header">
        <h1 className="app-title">Investing in the Future of</h1>
        <img src={image} width = "50%" />
      </div>
      {publicKey && (<div className="content-container">
        <SwapBox />
      </div>)}
    </div>
  );
}

export default App;
