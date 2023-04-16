import { useState, Fragment } from "react";
import { Transition, Menu, Dialog } from "@headlessui/react";
import Modal from 'react-modal'
import "./SwapBox.css"
import classNames from 'classnames';

import TokenDropdown from "./TokenDropdown";

Modal.setAppElement('#root');
/**
 * triggerSwap: ([token1, token2, token1qty])
 */
const SwapBox = () => {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [openSwapDialog, setSwapOpenDialog] = useState(false);
  const [openDepositDialog, setDepositOpenDialog] = useState(false);

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
          <TokenDropdown options={fromTokenOptions} value={fromToken} setValue={handleFromTokenChange} />



          <button
            className="token-swap-button bg-green hover:bg-green-700 rounded-lg text-white py-2 px-8"
            onClick={() => {
              setSwapOpenDialog(true);
            }}
          >
            Swap
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
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setSwapOpenDialog(false);
                        setDepositOpenDialog(true);
                      }}
                    >
                      Swap
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                    Deposit Tokens
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
                      onClick={() => {
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
    </>
  );
};

export default SwapBox;
