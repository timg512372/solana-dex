import { useState, Fragment, useCallback, useEffect } from "react";
import { Transition, Menu, Dialog } from '@headlessui/react'
import classNames from 'classnames';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import SwapBox from "./SwapBox";

import confetti from 'canvas-confetti';
import { useQueuedState, useTimeout, useInterval } from "./utils/hooks";
import random from 'lodash/random';

import "./App.css";
import image from './assets/solanaText.png';

const confettiOptions = {
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  particleCount: 80
};
const decayRate = 0.8;

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

  const [isOpen, pageOpen] = useState(false);
  useEffect(() => {
    const onPageLoad = () => {
      pageOpen(true);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  // confetti code
  const interval = useInterval();
  const timeout = useTimeout();

  const [hasPlayedConfetti, setHasPlayedConfetti] = useState(false);
  const [showReplay, setShowReplay] = useQueuedState(false);

  const playConfetti = useCallback(() => {
    let particleCount = confettiOptions.particleCount;
    const stop = interval(() => {
      confetti({
        ...confettiOptions,
        particleCount,
        origin: {
          x: random(0.1, 0.4, true),
          y: Math.random() - 0.2
        }
      });

      confetti({
        ...confettiOptions,
        particleCount,
        origin: {
          x: random(0.6, 0.9, true),
          y: Math.random() - 0.2
        }
      });

      particleCount *= decayRate;
    }, 300);

    timeout(stop, 2500);
    setShowReplay(false, true, 2500);
  }, [interval, timeout, setShowReplay]);

  useEffect(() => {
    if (!publicKey && isOpen && !hasPlayedConfetti) {
      // Show confetti
      playConfetti();
      setHasPlayedConfetti(true);
    }
    // eslint-disable-next-line
  }, [isOpen]);

  let titleCSS;
  if (publicKey) {
    titleCSS = "temp-animation small-title"
  } else {
    titleCSS = "temp-animation big-title drop-in"
  }

  return (
    <div className={titleCSS}>
      <div className="title-header">
        <h1>Investing in the Future of</h1>
        <img src={image} />
      </div>
      {publicKey && (<div className="content-container">
        <SwapBox />
      </div>)}
    </div>
  );
}

export default App;
