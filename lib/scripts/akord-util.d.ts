import Akord from "@akord/akord-js";
declare const vaultJson: any;
declare const mockHash: (string: any) => string;
declare const AkordFactory: ({ email, password }: {
    email: any;
    password: any;
}) => Promise<Akord>;
declare const getFileFromPath: (filePath: string) => any;
declare const getNodesForDir: (dirPath: string, arrayOfFiles?: any, originalPath?: string) => any;
export { vaultJson, getNodesForDir, getFileFromPath, AkordFactory, mockHash };
