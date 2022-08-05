
import fs from "fs";
import path from "path";
import { vaultJson, AkordFactory, mockHash, getFileFromPath } from "./akord-util.js";
import Akord from "@akord/akord-js";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));
import 'dotenv/config'

// genereates an array of akord nodes types from a directory
const getNodesForDir = function (dirPath:string, arrayOfFiles:any, originalPath:string, argv?:any) {
  var files = fs.readdirSync(dirPath);

  // remember the first entry point
  if (!arrayOfFiles) originalPath = dirPath;

  // node:root
  arrayOfFiles = arrayOfFiles || [
    {
      node: "root",
      path: dirPath,
    },
  ];

  files.forEach(function (file) {
    // skip hidden files
    if (file.slice(0, 1) != ".") {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        // node:folder
        // get parent
        var parent = dirPath.slice(originalPath.length);
        if (parent == "") parent = null;
        else parent = parent.split("/").slice(-1)[0];
        arrayOfFiles.push({
          node: "folder",
          name: file,
          parent,
          dirPath,
        });
        arrayOfFiles = getNodesForDir(
          dirPath + "/" + file,
          arrayOfFiles,
          originalPath
        );
      } else {
        // node:stack
        var folder = dirPath.slice(originalPath.length);
        if (folder == "") folder = null;
        else folder = folder.split("/").slice(-1)[0];
        arrayOfFiles.push({
          node: "stack",
          name: file,
          file: path.resolve([dirPath, "/", file].join("")),
          folder: folder,
          dirPath,
        });
      }
    }
  });

  return arrayOfFiles;
};

const pushDirToVault = async (directory: any, akord: Akord, argv?: any) => {
  console.log("🛫 akord-sync initating with args", argv);
  // a node is generated for each folder and file in the directory.
  // the nodes are arranged as a DAG, representing the folder
  var nodes = getNodesForDir(directory, null, null, argv);
  if (argv.verbose) console.log(nodes);
  else console.log(nodes.length, "nodes to push");
  // we are going to remember the folderIds generated by protocol for easy lookup
  var parentIdMap = {};
  // now we flatten the DAG and sort it by dependencies.
  var vaultId = null;
  for (const node of nodes) {
    switch (node.node) {
      case "root":
        console.log("🗳", " - Creating Vault (name):", vaultJson.name);
        var vault = await akord.vaultCreate(
          vaultJson.name,
          vaultJson.termsOfAccess
        );
        vaultId = vault.vaultId;
        console.log("Vault ID:", vaultId);
        break;
      case "folder":
        console.log("🗂", " - Creating Folder (name/parent):", node.name, node.parent);
        var folder = await akord.folderCreate(
          vaultId,
          node.name,
          parentIdMap[node.parent]
        );
        parentIdMap[node.name] = folder.folderId;
        console.log("Folder ID:", folder.folderId);
        break;
      case "stack": {
        console.log("📄", " - Creating Stack (name, folder, file)", node.name, node.folder, "..."+node.file.slice(-16));
        const file = await getFileFromPath(node.file);
        var stack = await akord.stackCreate(
          vaultId,
          file,
          node.name,
          parentIdMap[node.folder]
        );
        console.log("Stack ID:", stack.stackId);
        break;
      }
    }
  };
  if (argv.verbose) console.log(parentIdMap);
};

(async () => {
  const argv = await yargs
    .count("verbose")
    .usage("Usage: $0 <command> [options]")
    .command("new", "Push the <folder> to a new vault")
    .example(
      "$0 new -d ./vault",
      "push the files/folders in the directory to a new vault"
    )
    .alias("d", "directory")
    .alias("v", "verbose")
    .demandOption(["d"]).argv;

  if (process.env.AKORD_WALLET_EMAIL && process.env.AKORD_WALLET_PASSWORD) {
    console.log("Akord wallet email:", process.env.AKORD_WALLET_EMAIL);
    var akord = await AkordFactory({
      email:process.env.AKORD_WALLET_EMAIL, 
      password:process.env.AKORD_WALLET_PASSWORD
    });
    await pushDirToVault(argv.directory, akord, argv);} 
  else {
    console.error("The .env config file is required with AKORD_WALLET_EMAIL and AKORD_WALLET_PASSWORD variables");
  }
})();

