import { useState, Fragment } from "react";
import { Transition, Menu, Dialog } from "@headlessui/react";
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
      <Transition appear show={openDialog} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenDialog(false)}>
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
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={setOpenDialog(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* tommy end */}
    </>
  );
};

export default SwapBox;
