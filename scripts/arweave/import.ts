
import { Akord } from "@akord/akord-js";
import _yargs from "yargs";
import 'dotenv/config'
import { getTransactionsByAddress } from "./transactions";

const importFilesToVault = async (akord: Akord, vaultName: string) => {
  const address = process.env.ARWEAVE_ADDRESS;
  console.log("🛫 importing files from Arweave for address: " + address);
  console.log(" 🔐 ", "Creating Vault (name):", vaultName);
  const { vaultId } = await akord.vault.create(vaultName);
  console.log("     Vault ID:", vaultId);
  const fileIds = await getTransactionsByAddress(process.env.ARWEAVE_ADDRESS);
  for (const fileTxId of fileIds) {
    const name = "Arweave-" + fileTxId;
    console.log(" 📜 ", "Creating Stack (name, fileId)", name, fileTxId);
    try {
      const { stackId } = await akord.stack.import(
        vaultId,
        fileTxId,
        name);
      console.log("     Stack ID:", stackId);
    } catch (error) {
      console.log("Oops, failed creating new stack for file transaction with id: " + fileTxId + ". Skipping...");
    }
  }
  console.log("success  importing files from Arweave for address: " + address);
}

(async () => {
  if (process.env.AKORD_WALLET_EMAIL && process.env.AKORD_WALLET_PASSWORD && process.env.ARWEAVE_ADDRESS) {
    console.log("Akord wallet email:", process.env.AKORD_WALLET_EMAIL);
    console.log("Arweave address:", process.env.ARWEAVE_ADDRESS);
    const { akord } = await Akord.auth.signIn(process.env.AKORD_WALLET_EMAIL, process.env.AKORD_WALLET_PASSWORD);
    await importFilesToVault(akord, "My new vault");
  } else {
    console.error("The .env config file is required with AKORD_WALLET_EMAIL, AKORD_WALLET_PASSWORD & ARWEAVE_ADDRESS variables");
  }
})();