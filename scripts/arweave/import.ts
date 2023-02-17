
import { Akord } from "@akord/akord-js";
import { getTxMetadata } from "@akord/akord-js/lib/arweave";
import 'dotenv/config'
import { getTransactionsByAddress } from "./transactions";

const importFilesToVault = async (akord: Akord, vaultName: string) => {
  const address = process.env.ARWEAVE_ADDRESS;
  console.log("🛫 importing files from Arweave for address: " + address);
  console.log(" 🔐 ", "Creating Vault (name):", vaultName);
  const { vaultId } = await akord.vault.create(vaultName);
  console.log("     Vault ID:", vaultId);
  const fileIds = await getTransactionsByAddress(process.env.ARWEAVE_ADDRESS);
  let i = 0;
  console.log("Found " + fileIds.length + " arweave transactions...");
  const failedTxs = [];
  for (const fileTxId of fileIds) {
    console.log(" 📜 ", "Creating Stack for transaction: " + fileTxId);
    try {
      const fileMetadata = await getTxMetadata(fileTxId);
      if (fileMetadata?.data?.type && fileMetadata?.data?.size > 0) {
        const { stackId } = await akord.stack.import(vaultId, fileTxId);
        console.log("     Stack ID:", stackId);
        i = i + 1;
      } else {
        console.log("Transaction " + fileTxId + " does not contain any data. Skipping...");
      }
    } catch (error) {
      console.log("Oops, failed creating new stack for file transaction with id: " + fileTxId + ". Skipping...");
      failedTxs.push(fileTxId);
    }
  }
  console.log(i + " files were imported successfully to an Akord Vault.");
  if (failedTxs.length > 0) {
    console.log("Here's the list of transaction ids that import failed:");
    console.log(failedTxs);
  }
}

(async () => {
  if (process.env.AKORD_WALLET_EMAIL && process.env.AKORD_WALLET_PASSWORD && process.env.ARWEAVE_ADDRESS) {
    console.log("Akord wallet email:", process.env.AKORD_WALLET_EMAIL);
    console.log("Arweave address:", process.env.ARWEAVE_ADDRESS);
    const { akord } = await Akord.auth.signIn(process.env.AKORD_WALLET_EMAIL, process.env.AKORD_WALLET_PASSWORD);
    await importFilesToVault(akord, "Arweave import");
  } else {
    console.error("The .env config file is required with AKORD_WALLET_EMAIL, AKORD_WALLET_PASSWORD & ARWEAVE_ADDRESS variables");
  }
})();