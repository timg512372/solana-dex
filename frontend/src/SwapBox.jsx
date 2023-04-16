import { useState, Fragment } from "react";
import { Transition, Menu, Dialog } from "@headlessui/react";
import Modal from 'react-modal'
import "./SwapBox.css"
import classNames from 'classnames';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

import TokenDropdown from "./TokenDropdown";
import TokenSet from "./TokenSet";

Modal.setAppElement('#root');
/**
 * triggerSwap: ([token1, token2, token1qty])
 */
const SwapBox = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [openSwapDialog, setSwapOpenDialog] = useState(false);
  const [openDepositDialog, setDepositOpenDialog] = useState(false);
  const [openWithdrawDialog, setWithdrawOpenDialog] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const depositAPIURL = "/http://localhost:4000/swap/deposit"

  const handleFromTokenChange = (value) => {
    setFromToken(value);
  };

  const handleToTokenChange = (value) => {
    setToToken(value);
  };

  const fromTokenOptions = [
    { value: "SOL", label: "SOL" },
  ];

  async function sendSol(amount) {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: "4Si9336CP4jyEuDsM5aB2jnTnyAbxyN25mvy8xbvxbbR",
        lamports: amount,
      })
    );
    await sendTransaction(transaction, connection);
  }

  return (
    <>
      <div className="token-swap-container">
        <span className="token-swap_label">Amount to Swap</span>
        <TokenDropdown options={true} value={fromToken} setValue={handleFromTokenChange} />
        <span className="token-swap_label">SolStash™ Composition</span>
        <TokenSet options={fromTokenOptions} value={toToken} setValue={handleToTokenChange} />
        <div className="button-container">
          <button
            className="token-swap-button hover:bg-green-700 rounded-lg text-white py-2 px-8"
            onClick={() => {
              setSwapOpenDialog(true);
            }}
          >
            Invest
          </button>
        </div>
      </div>

      <div className="token-swap-container">
        <span className="token-swap_label">Amount to Withdraw</span>
        <TokenDropdown options={false} value={toToken} setValue={handleToTokenChange} />
        <span className="token-swap_label">SolStash™ Composition</span>
        <TokenSet options={fromTokenOptions} value={fromToken} setValue={handleFromTokenChange} />
        <div className="button-container">
          <button
            className="token-swap-button hover:bg-green-700 rounded-lg text-white py-2 px-8"
            onClick={() => {
              setWithdrawOpenDialog(true);
            }}
          >
            Withdraw
          </button>
        </div>
      </div>

      <Transition appear show={openSwapDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setSwapOpenDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Transaction Details
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estimated Changes
                    </p>
                    <p className="text-sm text-green-500">
                      Receive: 0.01 SOL, 0.01 USDC, 0.01 SRM
                    </p>
                    <p className="text-sm text-red-500">
                      Send: {+fromToken} SOL
                    </p>
                    <br></br>
                    <p className="text-sm text-gray-500">
                      Network Fee: $0.00012
                    </p>
                  </div>

                  <div className="mt-4 modal-button-container">
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        // let response = await sendSol(+fromToken * LAMPORTS_PER_SOL)
                        // console.log(response)
                        setSwapOpenDialog(false);
                        setDepositOpenDialog(true);
                      }}
                    >
                      Swap
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setSwapOpenDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openDepositDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setDepositOpenDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Deposit Tokens
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estimated Changes
                    </p>
                    <p className="text-sm text-green-500">
                      Deposit: 0.01 SOL, 0.01 USDC, 0.01 SRM
                    </p>
                    <br></br>
                    <p className="text-sm text-gray-500">
                      Network Fee: $0.00012
                    </p>
                  </div>

                  <div className="mt-4 modal-button-container">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        // let response = await axios.post(depositAPIURL, {
                        //   "address": publicKey,
                        //   "amount": +fromToken * LAMPORTS_PER_SOL,
                        // })
                        // console.log(response.data);
                        setDepositOpenDialog(false);
                      }}
                    >
                      Deposit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setDepositOpenDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openWithdrawDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setWithdrawOpenDialog(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Transaction Details
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Estimated Changes
                    </p>
                    <p className="text-sm text-green-500">
                      Receive: 1 SOL
                    </p>
                    <p className="text-sm text-red-500">
                      Send: {+toToken} STH
                    </p>
                    <br></br>
                    <p className="text-sm text-gray-500">
                      Network Fee: $0.00012
                    </p>
                  </div>

                  <div className="mt-4 modal-button-container">
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setWithdrawOpenDialog(false);
                      }}
                    >
                      Withdraw
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setWithdrawOpenDialog(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SwapBox;
