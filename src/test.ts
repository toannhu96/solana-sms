import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

async function main() {
  try {
    const sender = Keypair.generate();

    const recipient = new PublicKey("ArTbfyWWNBLkDhU2ar8RBEPDHkEv6jVWJTwxjDnVYnMX");
    const amountInLamports = 1_000_000; // Example: Transfer 0.001 SOL (1,000,000 lamports)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: amountInLamports,
      }),
    );

    const { blockhash } = await connection.getLatestBlockhash(); // Get recent blockhash
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = sender.publicKey;

    // Sign the transaction with the sender's keypair
    transaction.sign(sender);

    // Serialize the transaction to a buffer
    const serializedTransaction = bs58.encode(transaction.serialize({ verifySignatures: false }));

    console.log(serializedTransaction);
  } catch (error) {
    console.error("Error transferring SOL:", error);
  }
}

main();
