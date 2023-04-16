import React, {useMemo} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import './index.css';

require('@solana/wallet-adapter-react-ui/styles.css');

export const Wallet = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  const { publicKey } = useWallet();

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new UnsafeBurnerWalletAdapter()
      ],
      [network]
  );

  return (
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                  <flex className = "wallet-button-flex">
                      <WalletMultiButton />
                  </flex>
                    <App />
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wallet />
  </React.StrictMode>,
)
