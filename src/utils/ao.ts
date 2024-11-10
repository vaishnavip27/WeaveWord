import { createDataItemSigner, connect, result, message } from '@permaweb/aoconnect';

const PROCESS_ID = "xFXWQAYOg-uoqvbHaIKiSmMkBJdBVW3aT8TTDnAADrc"

let aoInstance: any = null;
let signer: any = null;
let isInitialized = false;

async function getAOInstance() {
  try {
    if (!aoInstance || !signer) {
      signer = createDataItemSigner(window.arweaveWallet);
      aoInstance = connect(signer);
    }
    return { ao: aoInstance, signer };
  } catch (error) {
    console.error('Error getting AO instance:', error);
    throw error;
  }
}

export async function initializeAO(walletAddress: string): Promise<void> {
  try {
    if (isInitialized) {
      console.log('AO already initialized');
      return;
    }

    const { signer } = await getAOInstance();
    if (!walletAddress) {
      throw new Error('Wallet address is required for initialization.');
    }

    // Send the initialization message
    const messageOutput = await message({
      process: PROCESS_ID,
      signer,
      tags: [
        { name: 'Action', value: 'Initialize' },
        { name: 'Wallet', value: walletAddress },
      ],
      data: "Initialization message"
    });

    console.log('Initialization message sent:', messageOutput);

    // Get the result of the initialization
    const resultOutput = await result({
      message: messageOutput,
      process: PROCESS_ID,
    });

    console.log('Result output:', JSON.stringify(resultOutput, null, 2));

    if (resultOutput) {
      console.log('AO initialization successful');
      isInitialized = true;
    } else {
      throw new Error('AO initialization failed: ' + JSON.stringify(resultOutput));
    }
  } catch (error) {
    console.error('Error initializing AO:', error);
    throw error;
  }
}

