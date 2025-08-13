// Import library ethers dari hardhat
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=== MEMULAI DEPLOYMENT ===");
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Get balance and format it properly
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    // Deploy the contract
    console.log("Deploying Voting contract...");
    const VotingFactory = await ethers.getContractFactory("Voting");
    const votingContract = await VotingFactory.deploy();

    // Wait for deployment
    console.log("Waiting for deployment confirmation...");
    await votingContract.waitForDeployment();

    // Get contract address
    const contractAddress = await votingContract.getAddress();
    
    // Get network info
    const network = await deployer.provider.getNetwork();
    
    console.log("=== DEPLOYMENT BERHASIL ===");
    console.log("Contract Address:", contractAddress);
    console.log("Deployer (Admin):", deployer.address);
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId.toString());
    console.log("=========================");
    
    // Verify contract is working
    try {
      const admin = await votingContract.admin();
      console.log(" Contract verification: Admin address =", admin);
      
      // Verify admin matches deployer
      if (admin.toLowerCase() === deployer.address.toLowerCase()) {
        console.log(" Admin verification: PASSED");
      } else {
        console.log(" Admin verification: FAILED");
      }
    } catch (error) {
      console.log(" Contract verification failed:", error.message);
    }

    // Save deployment info to file
    const deploymentInfo = {
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      networkName: network.name,
      chainId: network.chainId.toString(),
      deploymentTime: new Date().toISOString(),
      blockNumber: await deployer.provider.getBlockNumber()
    };

    // Create deployment info file
    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }
    
    const fileName = `deployment-${network.name}-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(deploymentPath, fileName), 
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log(" Deployment info saved to:", fileName);
    
    // Update contractInfo.js if deploying to localhost
    if (network.name === "localhost" || network.chainId === 31337n) {
      await updateContractInfo(contractAddress);
    }
    
    return {
      contract: votingContract,
      address: contractAddress,
      deployer: deployer.address
    };

  } catch (error) {
    console.error(" DEPLOYMENT GAGAL:");
    console.error(error.message);
    
    // Provide helpful error messages
    if (error.message.includes("could not detect network")) {
      console.log("\n SOLUSI:");
      console.log("1. Untuk localhost: Jalankan 'npx hardhat node' di terminal terpisah");
      console.log("2. Untuk testnet: Pastikan .env sudah dikonfigurasi dengan benar");
      console.log("3. Cek koneksi internet untuk testnet deployment");
    }
    
    throw error;
  }
}

// Function to update contractInfo.js for localhost deployment
async function updateContractInfo(contractAddress) {
  try {
    const contractInfoPath = path.join(__dirname, "../../evoting-client/src/contractInfo.js");
    
    if (fs.existsSync(contractInfoPath)) {
      let content = fs.readFileSync(contractInfoPath, 'utf8');
      
      // Replace the contract address
      content = content.replace(
        /export const contractAddress = ".*";/,
        `export const contractAddress = "${contractAddress}";`
      );
      
      fs.writeFileSync(contractInfoPath, content);
      console.log(" contractInfo.js updated with new address");
    }
  } catch (error) {
    console.log("  Could not update contractInfo.js:", error.message);
  }
}

// Pola standar untuk menjalankan fungsi main dan menangani jika ada error.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});