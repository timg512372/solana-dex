import React, { useState, useEffect, Fragment } from "react";
import { Transition, Menu, Dialog, Listbox } from "@headlessui/react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import "./TokenDropdown.css";

const TokenDropdown = ({ options, value: enteredValue, setValue: setEnteredValue }) => {
  //conv rate: 24.48

  const [isFocused, setFocus] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ balance, setBalance ] = useState(0);

  useEffect(() => {
    (async  () => {
      let balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    })();
  }, [publicKey]);

  const solInUSD = ((+enteredValue || 0) * 24.48).toFixed(2);
  const sthInUSD = ((+enteredValue || 0) * 82.50).toFixed(2);

  return (
    <>
    {options && (
      <div className={`token-dropdown ${isFocused ? "token-dropdown-focused" : ""}`}>
      <input
        className="token-dropdown_amount"
        type="text"
        placeholder="0.00"
        value={enteredValue}
        onChange={(e) => {
          if (e.target.value > balance) {
            setEnteredValue(balance);
          } else {
            setEnteredValue(e.target.value)}
        }
        }
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <div className="token-dropdown_button">
        <img
          className="token-menu-icon"
          src={`/tokens/SOL.png`}
          alt={`SOL icon`}
        />
        <span>SOL</span>
      </div>

      
      <span className="token-dropdown_stack_bottom token-dropdown_left">≈ ${solInUSD} USD</span>

      <span className="token-dropdown_stack_bottom token-dropdown_right">Up To {balance.toFixed(2)} SOL</span>
    </div>
    )}
    {!options && (
      <div className={`token-dropdown ${isFocused ? "token-dropdown-focused" : ""}`}>
      <input
        className="token-dropdown_amount"
        type="text"
        placeholder="0.00"
        value={enteredValue}
        onChange={(e) => {
          if (e.target.value > balance) {
            setEnteredValue(balance);
          } else {
            setEnteredValue(e.target.value)}
        }
        }
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <div className="token-dropdown_button">
        <img
          className="token-menu-icon"
          src={`/tokens/SOL.png`}
          alt={`SOL icon`}
        />
        <span>STH</span>
      </div>

      
      <span className="token-dropdown_stack_bottom token-dropdown_left">≈ ${sthInUSD} USD</span>

      <span className="token-dropdown_stack_bottom token-dropdown_right">Up To {balance.toFixed(2)} STH</span>
    </div>
    )}
    </>
  );
};

export default TokenDropdown;
