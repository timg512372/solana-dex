import { useState, Fragment } from "react";
import { Transition, Menu, Dialog, Listbox } from "@headlessui/react";
import "./TokenDropdown.css";

const TokenDropdown = ({ options, value, setValue }) => {
  return (
    <div className="token-dropdown">
      <Listbox value={value} onChange={setValue}>
        <Listbox.Button>
          <img
            className="token-menu-icon"
            src={`/tokens/${value}.png`}
            alt={`${value} icon`}
          /> {value}
        </Listbox.Button>
        <Listbox.Options>
          {options.map((token) => (
            <Listbox.Option
              key={token.value}
              value={token.value}
            >
              <img
                className="token-menu-icon"
                src={`/tokens/${token.value}.png`}
                alt={`${token.value} icon`}
              />
              {token.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>

      <div className="token-amount-container">
        <input
          className="token-dropdown_amount"
          type="text"
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

export default TokenDropdown;
