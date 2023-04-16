import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Aggregator } from "../target/types/aggregator";
import { assert, expect } from "chai";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { BN } from "bn.js";

describe("aggregator", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Aggregator as Program<Aggregator>;

  const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  );

  it("Is initialized!", async () => {
    const tx = await program.methods.initializeTokenMint().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Deposits", async () => {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      provider.wallet.publicKey
    );

    const tx = await program.methods
      .mint(new BN((10 * 10) ^ 6))
      .accounts({
        tokenAccount: tokenAccount,
      })
      .rpc();

    const userAta = await getAccount(provider.connection, tokenAccount);
    expect(Number(userAta.amount)).to.equal((10 * 10) ^ 6);
  });

  it("Deposits", async () => {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      provider.wallet.publicKey
    );

    const tx = await program.methods
      .mint(new BN((10 * 10) ^ 6))
      .accounts({
        tokenAccount: tokenAccount,
      })
      .rpc();

    const userAta = await getAccount(provider.connection, tokenAccount);
    expect(Number(userAta.amount)).to.equal((10 * 10) ^ 6);
  });

  it("Withdraws", async () => {
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      provider.wallet.publicKey
    );

    const tx2 = await program.methods
      .withdraw(new BN((10 * 10) ^ 6))
      .accounts({ tokenAccount: tokenAccount })
      .rpc();

    let userAta = await getAccount(provider.connection, tokenAccount);
    expect(Number(userAta.amount)).to.equal(0);
  });
});
