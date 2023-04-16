import React, { useState, useEffect, Fragment } from "react";
import { Transition, Menu, Dialog, Listbox } from "@headlessui/react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import "./TokenDropdown.css";

const TokenDropdown = ({ options, value, setValue }) => {
  //conv rate: 24.48

  const [enteredValue, setEnteredValue] = useState("");
  const [isFocused, setFocus] = useState(false);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ balance, setBalance ] = useState(0);

  useEffect(() => {
    (async  () => {
      let balance = await connection.getBalance(publicKey);
      setBalance(balance);
    })();
  }, [publicKey]);

  const inUSD = (+enteredValue * 24.48).toFixed(2);

  return (
    <div className={`token-dropdown ${isFocused ? "token-dropdown-focused" : ""}`}>
      <input
        className="token-dropdown_amount"
        type="text"
        placeholder="0.00"
        value={enteredValue}
        onChange={(e) => setEnteredValue(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <div className="token-dropdown_button">
        <img
          className="token-menu-icon"
          src={`/tokens/${value}.png`}
          alt={`${value} icon`}
        />
        <span>{value}</span>
      </div>

      
      <span className="token-dropdown_stack_bottom token-dropdown_left">{enteredValue && `≈ ${inUSD} USD`}</span>

      <span className="token-dropdown_stack_bottom token-dropdown_right">Up To {balance} SOL</span>
    </div>
  );
};

export default TokenDropdown;
