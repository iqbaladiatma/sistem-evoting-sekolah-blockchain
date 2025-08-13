// Script deploy sederhana untuk localhost testing
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 DEPLOY KE LOCALHOST");
  console.log("====================");
  
  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

    // Deploy contract
    console.log("\n📦 Deploying Voting contract...");
    const VotingFactory = await ethers.getContractFactory("Voting");
    const votingContract = await VotingFactory.deploy();
    
    await votingContract.waitForDeployment();
    const contractAddress = await votingContract.getAddress();
    
    console.log("✅ Contract deployed!");
    console.log("📍 Address:", contractAddress);
    
    // Verify contract works
    const admin = await votingContract.admin();
    console.log("🔐 Admin:", admin);
    
    // Update contractInfo.js automatically
    updateContractInfo(contractAddress);
    
    console.log("\n🎉 DEPLOYMENT SELESAI!");
    console.log("======================");
    console.log("📋 RINGKASAN:");
    console.log("Contract Address:", contractAddress);
    console.log("Admin (Anda):", deployer.address);
    console.log("Network: localhost");
    
    console.log("\n📝 LANGKAH SELANJUTNYA:");
    console.log("1. Pastikan MetaMask terhubung ke localhost:8545");
    console.log("2. Import account dari Hardhat ke MetaMask");
    console.log("3. Refresh aplikasi React Anda");
    console.log("4. Mulai testing!");
    
    return contractAddress;
    
  } catch (error) {
    console.error("❌ DEPLOYMENT GAGAL:");
    console.error(error.message);
    
    if (error.message.includes("could not detect network")) {
      console.log("\n💡 SOLUSI:");
      console.log("Jalankan command ini di terminal terpisah:");
      console.log("npx hardhat node");
      console.log("\nKemudian jalankan script ini lagi.");
    }
    
    process.exit(1);
  }
}

// Update contractInfo.js dengan alamat contract baru
function updateContractInfo(contractAddress) {
  try {
    const contractInfoPath = path.join(__dirname, "../../evoting-client/src/contractInfo.js");
    
    if (fs.existsSync(contractInfoPath)) {
      let content = fs.readFileSync(contractInfoPath, 'utf8');
      
      // Replace contract address
      content = content.replace(
        /export const contractAddress = ".*";/,
        `export const contractAddress = "${contractAddress}";`
      );
      
      fs.writeFileSync(contractInfoPath, content);
      console.log("✅ contractInfo.js updated!");
    }
  } catch (error) {
    console.log("⚠️  Could not update contractInfo.js:", error.message);
    console.log("Please manually update the address to:", contractAddress);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = main;
