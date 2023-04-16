import { useState, Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import Modal from 'react-modal';
import "./SwapBox.css"
import classNames from 'classnames';

import TokenDropdown from "./TokenDropdown";

/**
 * triggerSwap: ([token1, token2, token1qty])
 */
const SwapBox = () => {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [openDialog, setOpenDialog] = useState(false);

  const handleFromTokenChange = (value) => {
    setFromToken(value);
  };

  const handleToTokenChange = (value) => {
    setToToken(value);
  };

  const fromTokenOptions = [
    { value: "SOL", label: "SOL" },
    { value: "USDC", label: "USDC" },
    { value: "SRM", label: "SRM" },
  ];

  const toTokenOptions = [
    { value: "SOL", label: "SOL" },
    { value: "USDC", label: "USDC" },
    { value: "SRM", label: "SRM" },
  ];

  return (
    <>
      <div className="token-swap-container">
        <div className="token-swap bg-dark-blue text-white rounded-lg p-8">
          <div className="token-swap-selection mb-8">
            <TokenDropdown options={fromTokenOptions} value={fromToken} setValue={handleFromTokenChange} />
            <div className="token-swap-selection-box">
              <Menu as="div" className="token-select-container">
                {({ open }) => (
                  <>
                    <Menu.Button className="token-select">
                      <img
                        className="token-icon"
                        src={`/tokens/${toToken}.png`}
                        alt={`${toToken} icon`}
                      />
                      {toToken}
                    </Menu.Button>
                    <Menu.Items
                      className={classNames(
                        "token-menu",
                        open ? "block" : "hidden"
                      )}
                    >
                      {toTokenOptions.map((option) => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <button
                              className={classNames(
                                "block w-full text-left px-4 py-2 rounded-md",
                                {
                                  "bg-gray-100": active,
                                }
                              )}
                              onClick={() => handleToTokenChange(option.value)}
                            >
                              <img
                                className="token-menu-icon"
                                src={`/tokens/${option.value}.png`}
                                alt={`${option.value} icon`}
                              />
                              {option.label}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </>
                )}
              </Menu>
              <div className="token-amount-container">
                <input
                  className="token-amount"
                  type="text"
                  placeholder="0.00"
                />
                <span className="token-label">{toToken}</span>
              </div>
            </div>
          </div>
          <div className="token-swap-price mb-4">
            <span className="token-price-label">Price</span>
            <span className="token-price-value">
              ${fromToken} 1 = ${toToken} 42.1234
            </span>
          </div>
          <button
            className="token-swap-button bg-green hover:bg-green-700 rounded-lg text-white py-2 px-8"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Swap
          </button>
        </div>
      </div>

      {/* tommy start */}
      {/* <Modal
        isOpen={openDialog}
        onRequestClose={setOpenDialog(false)}
        className="modal"
        overlayClassName="overlay"
        closeTimeoutMS={200}
      >
        <div className="modal-header">
          <h3>Title Title Title</h3>
          <button className="close-btn" onClick={setOpenDialog(false)}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">hello hello hello hello</div>
      </Modal> */}
      {/* tommy end */}
    </>
  );
};

export default SwapBox;
