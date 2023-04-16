import React, { useState, useEffect, Fragment } from "react";
import { Transition, Menu, Dialog, Listbox } from "@headlessui/react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import "./TokenDropdown.css";


const ENABLE_CLAMPING = false;

const TokenDropdown = ({ options, value: enteredValue, setValue: setEnteredValue, buttonName, buttonAction }) => {

  const [isFocused, setFocus] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ balance, setBalance ] = useState(0);
  const [stashBalance, setStashBalance] = useState(0);

  useEffect(() => {
    (async  () => {
      let balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    })();
  }, [publicKey]);

  const solInUSD = ((+enteredValue || 0) * 24.48).toFixed(2);
  const sthInUSD = ((+enteredValue || 0) * 24.48).toFixed(2);

  const isSTH = !options;
  const token = isSTH ? "STH" : "SOL";

  const programId = new PublicKey("5s99BZLgkTKj2HWZcx8mnBPRzv7Tu42aJZHmahpAzQ1v")
  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  );


  useEffect(() => {
    (async () => {
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
      );
      let balance = await getAccount(connection, tokenAccount);
      balance = Number(balance.amount) / 1e9;
      console.log(balance)
      setStashBalance(balance);
    })();
  }, [mint, publicKey]);

  return (
    <div className={`token-dropdown ${isFocused ? "token-dropdown-focused" : ""}`}>
      <div className="token-dropdown_curr">
        <div className="token-dropdown_button">
          <img
            className="token-menu-icon"
            src={`/tokens/${token}.png`}
            alt={`${token} icon`}
          />
          <span>{token}</span>
        </div>
        <div className="token-dropdown_stack_bottom">Max {isSTH ? stashBalance.toFixed(2) : balance.toFixed(2)}</div>
      </div>

      <input
        className="token-dropdown_amount"
        type="text"
        placeholder="0.00"
        value={enteredValue}
        onChange={(e) => {
          if (e.target.value > balance + 1e-4 && ENABLE_CLAMPING) {
            setEnteredValue(balance.toFixed(4));
          } else {
            setEnteredValue(e.target.value)}
        }
        }
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <div className="token-dropdown_est token-dropdown_stack_bottom">
        ≈ ${isSTH ? sthInUSD : solInUSD} USD
      </div>

      <button className="token-send" onClick={buttonAction}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z" clipRule="evenodd" />
        </svg>
        {buttonName}
      </button>
    </div>
  );
};

export default TokenDropdown;
