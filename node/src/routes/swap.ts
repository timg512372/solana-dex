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

const pools: any = {
  sol_usdc: new PublicKey("3KBZiL2g8C7tiJ32hTv5v3KM7aK9htpqTw4cTXz1HvPt"),
  usdc_usdt: new PublicKey("63cMwvN8eoaD39os9bKP8brmA7Xtov9VxahnPufWCSdg"),
  samo_usdc: new PublicKey("EgxU92G34jw6QDG9RuTX9StFg1PmHuDqkRKAE5kVEiZ4"),
  tmac_usdc: new PublicKey("H3xhLrSEyDFm6jjG42QezbvhSxF5YHW75VdGUnqeEg5y"),
};

const weighting: any = {
  sol_usdc: 0.75,
  usdc_usdt: 0.25 * 0.001,
  samo_usdc: 0.25 * 0.001,
  tmac_usdc: 0.25 * 0.001,
};

const reversed_pools = ["samo_usdc", "tmac_usdc"];

const router = express.Router();

router.post("/deposit", async function (req, res) {
  const { address, amount } = req.body;

  if (!address || !amount) {
    return res.status(500).json({
      error: "Missing required fields ",
    });
  }

  const whirlpool_devnet_id = new PublicKey(
    "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
  );

  const ctx = WhirlpoolContext.withProvider(provider, whirlpool_devnet_id);

  const whirlpoolClient = buildWhirlpoolClient(ctx);

  try {
    for (const pool of Object.keys(pools)) {
      const whirlpool = await whirlpoolClient.getPool(pools[pool], true);

      const whirlpoolData = await whirlpool.refreshData();
      const fetcher = ctx.fetcher;

      const inputTokenQuote = await swapQuoteByInputToken(
        whirlpool,
        reversed_pools.includes(pool)
          ? whirlpoolData.tokenMintB
          : whirlpoolData.tokenMintA,
        new u64(amount * weighting[pool]),
        Percentage.fromFraction(1, 1000), // 0.1%
        ctx.program.programId,
        fetcher,
        true
      );

      // Send out the transaction
      const txId = await (
        await whirlpool.swap(inputTokenQuote)
      ).buildAndExecute();
      console.log(pool, txId);
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  return res.status(200).json("Success");
});

router.post("/withdraw", async function (req, res) {
  const { address, amount } = req.body;

  if (!address || !amount) {
    return res.status(500).json({
      error: "Missing required fields ",
    });
  }

  const whirlpool_devnet_id = new PublicKey(
    "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"
  );

  const ctx = WhirlpoolContext.withProvider(provider, whirlpool_devnet_id);

  const whirlpoolClient = buildWhirlpoolClient(ctx);

  try {
    for (const pool of Object.keys(pools)) {
      const whirlpool = await whirlpoolClient.getPool(pools[pool], true);

      const whirlpoolData = await whirlpool.refreshData();
      const fetcher = ctx.fetcher;

      const inputTokenQuote = await swapQuoteByInputToken(
        whirlpool,
        reversed_pools.includes(pool)
          ? whirlpoolData.tokenMintB
          : whirlpoolData.tokenMintA,
        new u64(amount * weighting[pool]),
        Percentage.fromFraction(1, 1000), // 0.1%
        ctx.program.programId,
        fetcher,
        true
      );

      // Send out the transaction
      const txId = await (
        await whirlpool.swap(inputTokenQuote)
      ).buildAndExecute();
      console.log(pool, txId);
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  return res.status(200).json("Success");
});

module.exports = router;
