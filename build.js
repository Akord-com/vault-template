// Your script to automate the vault setup

import fs from "fs";
import path from "path";
import { readFile } from "fs/promises";

const vaultJson = JSON.parse(
  await readFile(new URL("./vault.json", import.meta.url))
);
