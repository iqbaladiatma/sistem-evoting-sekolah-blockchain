// Script untuk test koneksi ke contract yang sudah di-deploy
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 TESTING CONNECTION TO DEPLOYED CONTRACT");
  console.log("==========================================");
  
  try {
    // Get contract address from contractInfo.js
    const contractAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
    
    console.log("📍 Testing contract at:", contractAddress);
    
    // Connect to localhost
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    console.log("🌐 Connected to localhost:8545");
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("🔗 Network:", network.name, "Chain ID:", network.chainId.toString());
    
    // Check if contract exists
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ CONTRACT NOT FOUND at this address!");
      console.log("Contract might not be deployed or address is wrong.");
      return;
    }
    
    console.log("✅ Contract found! Code length:", code.length);
    
    // Try to connect to contract
    const VotingFactory = await ethers.getContractFactory("Voting");
    const contract = VotingFactory.attach(contractAddress);
    
    // Test admin function
    console.log("\n🔐 Testing admin function...");
    const admin = await contract.admin();
    console.log("✅ Admin address:", admin);
    
    // Test candidates count
    console.log("\n👥 Testing candidates count...");
    const candidatesCount = await contract.candidatesCount();
    console.log("✅ Candidates count:", candidatesCount.toString());
    
    // Get deployer account for comparison
    const [deployer] = await ethers.getSigners();
    console.log("\n📋 COMPARISON:");
    console.log("Contract admin:", admin);
    console.log("Deployer address:", deployer.address);
    console.log("Match:", admin.toLowerCase() === deployer.address.toLowerCase() ? "✅ YES" : "❌ NO");
    
    console.log("\n🎉 CONTRACT CONNECTION TEST PASSED!");
    console.log("The contract is working correctly on localhost.");
    
  } catch (error) {
    console.error("❌ CONNECTION TEST FAILED:");
    console.error("Error:", error.message);
    
    if (error.message.includes("could not detect network")) {
      console.log("\n💡 SOLUTION:");
      console.log("Make sure Hardhat node is running:");
      console.log("npx hardhat node");
    } else if (error.message.includes("call revert")) {
      console.log("\n💡 POSSIBLE ISSUE:");
      console.log("Contract might be deployed but not working correctly.");
    }
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = main;
