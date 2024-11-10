// upload_contract.js
const Arweave = require("arweave");
const fs = require("fs");

// Initialize Arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function deployContract() {
  try {
    // Load your wallet file
    const wallet = JSON.parse(fs.readFileSync("arweave_key.json", "utf-8"));

    // Read the contract file
    const contractSource = fs.readFileSync("wordle_contract.lua", "utf-8");

    // Check wallet balance
    const address = await arweave.wallets.jwkToAddress(wallet);
    const balance = await arweave.wallets.getBalance(address);
    console.log("Wallet Balance:", arweave.ar.winstonToAr(balance), "AR");

    if (parseFloat(arweave.ar.winstonToAr(balance)) < 0.1) {
      console.error(
        "Insufficient funds to deploy the contract. Minimum balance of ~0.1 AR required."
      );
      return;
    }

    // Create a transaction to deploy the contract
    const tx = await arweave.createTransaction(
      { data: contractSource },
      wallet
    );

    // Add tags to identify this as a smart contract
    tx.addTag("Content-Type", "application/x-lua");
    tx.addTag("App-Name", "WordleGame");
    tx.addTag("App-Version", "0.0.1");

    // Sign and send the transaction
    await arweave.transactions.sign(tx, wallet);
    const response = await arweave.transactions.post(tx);

    if (response.status === 200) {
      console.log("Contract deployed! Transaction ID:", tx.id);

      // Verify the transaction status after a delay
      setTimeout(async () => {
        const confirmed = await arweave.transactions.getStatus(tx.id);
        if (confirmed.status === 200) {
          console.log("Contract successfully confirmed on Arweave!");
        } else {
          console.log(
            "Contract posted but not yet confirmed. Please check later."
          );
        }
      }, 30000); // Wait 30 seconds before checking status
    } else {
      console.error("Error deploying contract:", response);
    }
  } catch (error) {
    console.error("An error occurred during deployment:", error);
  }
}

deployContract().catch(console.error);
