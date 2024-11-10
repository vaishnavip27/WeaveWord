// src/types/arconnect.d.ts
interface Window {
  arweaveWallet: {
    connect: (permissions: string[]) => Promise<void>;
    disconnect: () => Promise<void>;
    getActiveAddress: () => Promise<string>;
    getAllAddresses: () => Promise<string[]>;
    getWalletNames: () => Promise<{ [addr: string]: string }>;
    sign: (transaction: unknown) => Promise<unknown>;
    encrypt: (data: string, options: unknown) => Promise<unknown>;
    decrypt: (data: string, options: unknown) => Promise<unknown>;
    getPermissions: () => Promise<string[]>;
    getArweaveConfig: () => Promise<{
      host: string;
      port: number;
      protocol: string;
    }>;
  };
}
