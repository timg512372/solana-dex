import React, { useState, useEffect, Fragment } from "react";
import { Transition, Menu, Dialog, Listbox } from "@headlessui/react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import "./TokenDropdown.css";

const TokenDropdown = ({ options, value, setValue }) => {
  //conv rate: 24.48

  const [enteredValue, setEnteredValue] = useState("");

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
    <div className="token-dropdown">
      <div className="token-dropdown_stack">
        <input
          className="token-dropdown_amount"
          type="text"
          placeholder="0.00"
          value={enteredValue}
          onChange={(e) => setEnteredValue(e.target.value)}
        />
        <span className="token-dropdown_stack_bottom">≈ {inUSD} USD</span>
      </div>
      <div className="token-dropdown_stack">
        <div className="token-dropdown_button">
          <img
            className="token-menu-icon"
            src={`/tokens/${value}.png`}
            alt={`${value} icon`}
          />
          <span>{value}</span>
        </div>
        <span className="token-dropdown_stack_bottom">Up To XXX SOL</span>
      </div>
    </div>
  );
};

export default TokenDropdown;
