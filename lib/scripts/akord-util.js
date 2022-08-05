"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockHash = exports.AkordFactory = exports.getFileFromPath = exports.getNodesForDir = exports.vaultJson = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const akord_js_1 = __importDefault(require("@akord/akord-js"));
const crypto_1 = require("@akord/crypto");
const api_authenticator_1 = __importDefault(require("./api-authenticator"));
const vaultJson = JSON.parse(fs_1.default.readFileSync("./vault.json").toString());
exports.vaultJson = vaultJson;
// for mocking up the interface, remove after all is working
const crypto_2 = __importDefault(require("crypto"));
const mockHash = (string) => {
    return crypto_2.default.createHash("md5").update(string).digest("hex").slice(0, 4);
};
exports.mockHash = mockHash;
const AkordFactory = async ({ email, password }) => {
    const apiAuthenticator = new api_authenticator_1.default();
    const jwtToken = await apiAuthenticator.getJWTToken(email, password);
    const userAttributes = await apiAuthenticator.getUserAttributes(email, password);
    const wallet = await crypto_1.AkordWallet.importFromEncBackupPhrase(password, userAttributes["custom:encBackupPhrase"]);
    return new akord_js_1.default({}, wallet, jwtToken);
};
exports.AkordFactory = AkordFactory;
const getFileFromPath = function (filePath) {
    let file = {};
    if (!fs_1.default.existsSync(filePath)) {
        console.error("Could not find a file in your filesystem: " + filePath);
        process.exit(0);
    }
    const stats = fs_1.default.statSync(filePath);
    file.size = stats.size;
    file.data = fs_1.default.readFileSync(filePath);
    file.name = path_1.default.basename(filePath);
    return file;
};
exports.getFileFromPath = getFileFromPath;
// genereates an array of akord nodes types from a directory
const getNodesForDir = function (dirPath, arrayOfFiles, originalPath) {
    var files = fs_1.default.readdirSync(dirPath);
    // remember the first entry point
    if (!arrayOfFiles)
        originalPath = dirPath;
    // node:root
    arrayOfFiles = arrayOfFiles || [
        {
            node: "root",
            path: dirPath,
        },
    ];
    files.forEach(function (file) {
        if (fs_1.default.statSync(dirPath + "/" + file).isDirectory()) {
            // node:folder
            // get parent
            var parentId = dirPath.slice(originalPath.length);
            if (parentId == "")
                parentId = null;
            else
                parentId = parentId.split("/").slice(-1)[0];
            arrayOfFiles.push({
                node: "folder",
                name: file,
                parentId,
            });
            arrayOfFiles = getNodesForDir(dirPath + "/" + file, arrayOfFiles, originalPath);
        }
        else {
            // node:stack
            var folder = dirPath.slice(originalPath.length);
            if (folder == "")
                folder = null;
            else
                folder = folder.split("/").slice(-1)[0];
            arrayOfFiles.push({
                node: "stack",
                name: file,
                file: path_1.default.resolve([dirPath, "/", file].join("")),
                folder: folder,
            });
        }
    });
    return arrayOfFiles;
};
exports.getNodesForDir = getNodesForDir;
