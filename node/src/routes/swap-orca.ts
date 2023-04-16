require("dotenv").config();
import express from "express";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { u64 } from "@solana/spl-token";
import { AddressUtil, Percentage, ZERO } from "@orca-so/common-sdk";

import {
  buildWhirlpoolClient,
  PDAUtil,
  PriceMath,
  swapQuoteByInputToken,
  swapQuoteWithParams,
  SwapUtils,
  TICK_ARRAY_SIZE,
  WhirlpoolContext,
} from "@orca-so/whirlpools-sdk";

const connection = new anchor.web3.Connection(
  "https://api.devnet.solana.com/",
  { commitment: "max" }
);

const wallet = anchor.Wallet.local();
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "max",
  preflightCommitment: "max",
  skipPreflight: false,
});

const router = express.Router();

router.post("/deposit", async function (req, res) {
  const { address, amount } = req.body;

  if (!address || !amount) {
    return res.status(500).json({
      error: "Missing required fields ",
    });
  }

  const sol_usdc_id = new PublicKey(
    "3KBZiL2g8C7tiJ32hTv5v3KM7aK9htpqTw4cTXz1HvPt"
  );
  // const sol_id = new PublicKey("9NgniQavdJb867DEZDhcXYozQednUNUNVbNNzfLk72Pi");
  // const usdc_id = new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k");
  // const whirlpool_config = new PublicKey(
  //   "FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR"
  // );
  const ctx = WhirlpoolContext.withProvider(provider, sol_usdc_id);

  // const whirlpoolPda = PDAUtil.getWhirlpool(
  //   sol_usdc_id,
  //   whirlpool_config,
  //   sol_id,
  //   usdc_id,
  //   64
  // );
  const whirlpoolClient = buildWhirlpoolClient(ctx);
  const whirlpool = await whirlpoolClient.getPool(sol_usdc_id, true);
  // use getData or refreshData, depending on whether you think your data is stale.
  const whirlpoolData = await whirlpool.refreshData();
  console.log(whirlpoolData);
  const fetcher = ctx.fetcher;

  const ticks = await SwapUtils.getTickArrays(
    whirlpoolData.tickCurrentIndex,
    whirlpoolData.tickSpacing,
    true,
    ctx.program.programId,
    whirlpool.getAddress(),
    fetcher,
    true
  );
  console.log(ticks);

  const inputTokenQuote = await swapQuoteByInputToken(
    whirlpool,
    whirlpoolData.tokenMintA,
    new u64(10000),
    Percentage.fromFraction(1, 1000), // 0.1%
    ctx.program.programId,
    fetcher,
    true
  );

  // Send out the transaction
  const txId = await (await whirlpool.swap(inputTokenQuote)).buildAndExecute();
  console.log(txId);

  return res.status(200).json("Hello");
});

module.exports = router;
