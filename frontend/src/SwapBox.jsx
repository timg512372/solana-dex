import { useState, Fragment } from "react";
import { Transition, Menu, Dialog } from "@headlessui/react";
import Modal from 'react-modal'
import "./SwapBox.css"
import classNames from 'classnames';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import TokenDropdown from "./TokenDropdown";
import * as anchor from "@project-serum/anchor";

const data = [{ v: 0, date: "1/22" }, { v: 0.5, date: "2/22" }, { v: 3, date: "3/22" }, { v: 5, date: "4/22" }, { v: 8, date: "5/22" }, { v: 7, date: "6/22" }, { v: 10, date: "7/22" }, { v: 20, date: "8/22" }, { v: 13, date: "9/22" }, { v: 15, date: "10/22" }, { v: 18, date: "11/22" }, { v: 25, date: "12/22" }, { v: 24, date: "1/23" }, { v: 30, date: "2/23" }, { v: 35, date: "3/23" }]


Modal.setAppElement('#root');

const StashEntry = ({ name, portion, color }) => (
  <div className="stash-entry">
    <span className="stash-entry-bar" style={{ backgroundColor: color }}></span>
    <span className="stash-entry-name">{name}</span>
    <span className="stash-entry-pos">{portion}</span>
  </div>
);

/**
 * triggerSwap: ([token1, token2, token1qty])
 */
const SwapBox = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [openSwapDialog, setSwapOpenDialog] = useState(false);
  const [openDepositDialog, setDepositOpenDialog] = useState(false);
  const [openWithdrawDialog, setWithdrawOpenDialog] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [swapInProgress, setSwapInProgress] = useState(false);
  const [withdrawInProgress, setWithdrawInProgress] = useState(false);
  const [selectStash, setSelectStash] = useState(1);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const depositAPIURL = "http://localhost:4000/swap/deposit"
  const withdrawAPIURL = "http://localhost:4000/swap/withdraw"

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
    let response = await sendTransaction(transaction, connection);
    return response
  }

  const programId = new PublicKey("5s99BZLgkTKj2HWZcx8mnBPRzv7Tu42aJZHmahpAzQ1v")
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  );

  async function withdrawSTH(amount) {
    const tokenAccount = await token.getAssociatedTokenAddress(
      mint,
      publicKey,
    );
    const transaction = new Transaction().add(
      token.createBurnInstruction(
        tokenAccount,
        mint,
        publicKey,
        amount
      ))
    let response = await sendTransaction(transaction, connection);
    return response
  }


  return (
    <>
      <div className="main-page-container">
        <div className="solstash-container">
          <span className="token-swap_title">Choose a SolStash™</span>

          <div onClick={() => setSelectStash(1)} className={`solstash-box ${selectStash == 1 ? 'solstash-box--selected' : ''}`}>
            <StashEntry name="Radium" portion="25%" color="red" />
            <StashEntry name="Serum" portion="25%" color="green" />
            <StashEntry name="Bonafida" portion="25%" color="lightgreen" />
            <StashEntry name="Solend" portion="25%" color="brown" />
          </div>

          <div onClick={() => setSelectStash(2)} className={`solstash-box ${selectStash == 2 ? 'solstash-box--selected' : ''}`}>
            <StashEntry name="Radium" portion="20%" color="red" />
            <StashEntry name="Serum" portion="20%" color="lime" />
            <StashEntry name="Bonafida" portion="20%" color="lightgreen" />
            <StashEntry name="Solend" portion="20%" color="lightgray" />
            <StashEntry name="GMT" portion="4%" color="pink" />
            <StashEntry name="Audius" portion="4%" color="orange" />
            <StashEntry name="Star Atlas DAO" portion="4%" color="yellow" />
            <StashEntry name="Star Atlas" portion="4%" color="purple" />
            <StashEntry name="Aurory" portion="4%" color="red" />
          </div>
        </div>

        <div>
          <div className="swap-container">
            <div className="swap-box">
              <span className="token-swap_title">Amount to Swap</span>
              <TokenDropdown
                options={true}
                value={fromToken}
                setValue={handleFromTokenChange}
                buttonName="Swap"
                buttonAction={() => setSwapOpenDialog(true)} />
            </div>

            <div className="swap-box">
              <span className="token-swap_title">Amount to Withdraw</span>
              <TokenDropdown
                options={false}
                value={toToken}
                setValue={handleToTokenChange}
                buttonName="Withdraw"
                buttonAction={() => setWithdrawOpenDialog(true)} />
            </div>
          </div>
          <div className="graph-box">
            <span className="token-swap_title">Total Value Invested: $35M</span>
            <div className="token-swap-container">
              <AreaChart width={800} height={200} data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area type="monotone" dataKey="v" stroke="rgba(124, 58, 237)" fill="url(#colorUv)" strokeWidth={3} />
              </AreaChart>
              <div className="chart-datapoints">
                <span>Cur Cost per Token</span>
                <span>18.53 STH</span>

                <span>Avg Cost per Token</span>
                <span>14.54 STH</span>

                <span>Min Cost per SOL</span>
                <span>12.97 STH</span>

                <span>Peak Cost per SOL</span>
                <span>18.53 STH</span>

                <span>Volume</span>
                <span>28K</span>

                <span>Peak Cost per SOL</span>
                <span>18.53 STH</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* modal code */}
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
                      Receive: {+fromToken} STH
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
                        setSwapInProgress(true)
                        let response = await sendSol(+fromToken * LAMPORTS_PER_SOL)
                        console.log(response)
                        setTransactionHash(response)
                        response = await axios.post(depositAPIURL, {
                          "address": publicKey,
                          "amount": +fromToken * LAMPORTS_PER_SOL,
                        })
                        console.log(response.data);
                        setSwapOpenDialog(false);
                        setDepositOpenDialog(true);
                        setSwapInProgress(false)
                      }}
                      disabled={swapInProgress}
                    >
                      {!swapInProgress ? "Swap" : "Processing..."}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setSwapOpenDialog(false)}
                      hidden={swapInProgress}
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
                    Swap Successful!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      See Transaction Here:
                    </p>
                    <p className="text-sm text-green-500">
                      <a href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`} target="_blank" > Solana Explorer </a>
                    </p>
                  </div>

                  <div className="mt-4 modal-button-container">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setDepositOpenDialog(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openWithdrawDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
          setWithdrawOpenDialog(false)
          setWithdrawInProgress(false)
        }}>
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
                  {!withdrawInProgress ? (
                    <>
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
                          Receive: {+toToken} SOL
                        </p>
                        <p className="text-sm text-red-500">
                          Send: {+toToken} STH
                        </p>
                        <br></br>
                        <p className="text-sm text-gray-500">
                          Network Fee: $0.00012
                        </p>
                      </div>
                    </>) : (
                    <>
                      <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Withdraw Successful!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      See Transaction Here:
                    </p>
                    <p className="text-sm text-green-500">
                      <a href={`https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`} target="_blank" > Solana Explorer </a>
                    </p>
                  </div></>)}

                  <div className="mt-4 modal-button-container">
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={async () => {
                        setWithdrawInProgress(true);
                        let amount = Number(+toToken) * 1e9;
                        console.log("Amount: " + amount)
                        let response = await withdrawSTH(amount);
                        console.log(response)
                        setTransactionHash(response);
                        response = await axios.post(withdrawAPIURL, {
                          "address": publicKey,
                          "amount": amount,
                        })
                        console.log(response.data);
                        setWithdrawOpenDialog(false);
                      }}
                      disabled={withdrawInProgress}
                    >
                      {!withdrawInProgress ? "Withdraw" : "Processing..."}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setWithdrawOpenDialog(false)}
                      hidden={withdrawInProgress}
                    >
                      Close
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
