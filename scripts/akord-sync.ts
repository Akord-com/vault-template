
import fs from "fs";
import path from "path";
import { limitString } from "./akord-util.js";
import { Akord } from "@akord/akord-js";
import { NodeJs } from "@akord/akord-js/lib/types/file";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
const yargs = _yargs(hideBin(process.argv));
import 'dotenv/config'

var vaultJson = null;

// maps an array of akord nodes types to each file, recusively, in dirPath
// arrayOfFiles, carries the list through the recursion
// originalPath, remembers where we started
// argv, if we want to pick some flag from command line
const getNodesForDir = function (dirPath: string, arrayOfFiles: any, originalPath: string, argv?: any) {
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
    // skip hidden files, should make this into a cmd flag??
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
        // we have a file, now what kind? stack or note?
        if (file.slice(-5).toLowerCase() == ".note") {
          // note
          var folder = dirPath.slice(originalPath.length);
          if (folder == "") folder = null;
          else folder = folder.split("/").slice(-1)[0];
          arrayOfFiles.push({
            node: "note",
            name: file,
            file: path.resolve([dirPath, "/", file].join("")),
            folder: folder,
            dirPath,
          });
        } else {
          // stack
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
        console.log(" 🔐 ", "Creating Vault (name):", vaultJson.name);
        var vault = await akord.vault.create(
          vaultJson.name,
          vaultJson.termsOfAccess
        );
        vaultId = vault.vaultId;
        console.log("     Vault ID:", vaultId);
        break;
      case "folder":
        console.log(" 📂 ", "Creating Folder (name/parent):", limitString(node.name), node.parent);
        var folder = await akord.folder.create(
          vaultId,
          node.name,
          parentIdMap[node.parent]
        );
        parentIdMap[node.name] = folder.folderId;
        console.log("     Folder ID:", folder.folderId);
        break;
      case "stack":
        console.log(" 📜 ", "Creating Stack (name, folder, file)", limitString(node.name), limitString(node.folder), limitString(node.file));
        const file_to_upload = NodeJs.File.fromPath(node.file);
        var stack = await akord.stack.create(
          vaultId,
          file_to_upload,
          node.name,
          parentIdMap[node.folder]
        );
        console.log("     Stack ID:", stack.stackId);
        break;
      case "note":
        console.log(" 📝 ", "Creating Note (name, folder, file)", limitString(node.name), limitString(node.folder), limitString(node.file));
        const note_to_upload = NodeJs.File.fromPath(node.file);
        var note = await akord.note.create(
          vaultId,
          await note_to_upload.text(),
          node.name,
          parentIdMap[node.folder]
        );
        console.log("     Note ID:", note.noteId);
        console.log("     Parent ID:", parentIdMap[node.folder]);
        break;
    }
    console.log();
  }
};

(async () => {
  const argv = await yargs
    .usage("Usage: $0 <command> [options]")
    .command("new", "Push the <folder> to a new vault")
    .example(
      "$0 new -v ./vault.json -d ./vault",
      "push dir to a new vault"
    )
    .alias("d", "directory")
    .alias("v", "vault")
    .demandOption(["d", "v"]).argv

  // argv["verbose"] = true

  // read the vault.json
  // dynamically load the vault.json from the tmp build folder
  vaultJson = JSON.parse(fs.readFileSync(argv.vault.toString()).toString());

  if (process.env.AKORD_WALLET_EMAIL && process.env.AKORD_WALLET_PASSWORD) {
    console.log("Akord wallet email:", process.env.AKORD_WALLET_EMAIL);
    const { akord } = await Akord.auth.signIn(process.env.AKORD_WALLET_EMAIL, process.env.AKORD_WALLET_PASSWORD);
    await pushDirToVault(argv.directory, akord, argv);
  }
  else {
    console.error("The .env config file is required with AKORD_WALLET_EMAIL and AKORD_WALLET_PASSWORD variables");
  }
})();

