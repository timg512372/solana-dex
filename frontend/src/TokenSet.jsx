import React, { useState, useEffect, Fragment } from "react";
import { Transition, Menu, Listbox } from "@headlessui/react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import "./TokenSet.css";

const TokenSet = ({ options, value, setValue }) => {
    //conv rate: 24.48

    const [enteredValue, setEnteredValue] = useState("");

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        (async () => {
            let balance = await connection.getBalance(publicKey);
            setBalance(balance);
        })();
    }, [publicKey]);

    const inUSD = (+enteredValue * 24.48).toFixed(2);

    return (
        <div className="token-set">
            <div className="token-rows">
                <div className = "token-display">
                    <img className="token-menu-icon" src={`/tokens/SOL.png`} alt={`SOL icon`} />
                    <p className = "token-set-title">40%</p>
                </div>

                <div className = "token-display">
                    <img className="token-menu-icon" src={`/tokens/SRM.png`} alt={`SRM icon`}/>
                    <p className = "token-set-title">30%</p>
                </div>

                <div className = "token-display">
                    <img className="token-menu-icon" src={`/tokens/USDC.png`} alt={`USDC icon`}/>
                    <p className = "token-set-title">30%</p>
                </div>
            </div>
            <div className = "token-set-title">
                Total Cost ≈ $82.5 USD
            </div>
        </div>
    );
};

export default TokenSet;