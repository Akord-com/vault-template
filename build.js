// Your script to automate the vault setup
//
// demonstrated below:
// 1 - load the default vault.json file, make some edits, save to build foler
// 2 - prepare the vault by downloading some photos
// 3 - finish by dumping vault.json
// 4 - ready for deploy

const fs = require("fs");
const { faker } = require("@faker-js/faker");
const download = require("download");
var vaultJson = require("./vault.json");

// write you vault json back to disk
const VAULT_JSON = "./vault.json";
const writeVaultJson = async (vaultJson) => {
  let data = JSON.stringify(vaultJson, null, 2);
  await fs.writeFile(VAULT_JSON, data, (err) => {
    if (err) throw err;
    console.log("Data written to file");
  });
};

// actual start of our build script
(async () => {
  // do something with your vault settings
  var randomName = [faker.name.firstName(), ", the ", faker.animal.cat()]
    .join("")
    .toLowerCase();
  randomName = randomName.slice(0, 1).toUpperCase() + randomName.slice(1);
  vaultJson.name = randomName;
  vaultJson.termsOfAccess = "Enjoy this demo vault!";

  // write back your vault.json
  await writeVaultJson(vaultJson);

  // copy, render files and documents in your vault
  // for this demo, we'll download random photos from Unsplash
  for (var x = 0; x < 3; x++) {
    console.log("Downloading file...");
    fs.writeFileSync(
      `./vault/photos/photo-${Date.now()}.jpg`,
      await download("https://source.unsplash.com/random?avila+beach")
    );
  }

  // finished
  console.log("vault.json settings", vaultJson);
})();
