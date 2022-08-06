import fs from "fs";
import path from "path";
import Akord from "@akord/akord-js";
import { AkordWallet } from "@akord/crypto";
import ApiAuthenticator from "./api-authenticator";


// for mocking up the interface, remove after all is working
import crypto from "crypto";
const mockHash = (string) => {
  return crypto.createHash("md5").update(string).digest("hex").slice(0, 4);
};

const limitString = (filename: string, length?: number) => {
  if (filename == null) return null;
  if (!length) length = 10;
  if (filename.length > length)
    return filename.slice(0, length / 2) + ".." + filename.slice(length / 2 * -1);
  else
    return filename;
};

const AkordFactory = async ({ email, password }) => {
  const apiAuthenticator = new ApiAuthenticator();
  const jwtToken = await apiAuthenticator.getJWTToken(email, password);
  const userAttributes = await apiAuthenticator.getUserAttributes(
    email,
    password
  );
  const wallet = await AkordWallet.importFromEncBackupPhrase(
    password,
    userAttributes["custom:encBackupPhrase"]
  );
  return new Akord({}, wallet, jwtToken);
};

const getFileFromPath = function (filePath: string) {
  let file = <any>{};
  if (!fs.existsSync(filePath)) {
    console.error("Could not find a file in your filesystem: " + filePath);
    process.exit(0);
  }
  const stats = fs.statSync(filePath);
  file.size = stats.size;
  file.data = fs.readFileSync(filePath);
  file.name = path.basename(filePath);
  return file;
}

// genereates an array of akord nodes types from a directory
const getNodesForDir = function (dirPath: string, arrayOfFiles?: any, originalPath?: string) {
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
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      // node:folder
      // get parent
      var parentId = dirPath.slice(originalPath.length);
      if (parentId == "") parentId = null;
      else parentId = parentId.split("/").slice(-1)[0];
      arrayOfFiles.push({
        node: "folder",
        name: file,
        parentId,
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
      });
    }
  });

  return arrayOfFiles;
};

export { AkordFactory, getNodesForDir, getFileFromPath, mockHash, limitString };
