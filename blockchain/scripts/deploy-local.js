// Script khusus untuk deployment ke localhost dengan setup otomatis
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 MEMULAI LOCAL DEPLOYMENT");
  console.log("================================");
  
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
    
    console.log("✅ Contract deployed at:", contractAddress);
    
    // Verify deployment
    const admin = await votingContract.admin();
    console.log("🔐 Admin address:", admin);
    
    // Add some test candidates
    console.log("\n👥 Adding test candidates...");
    await votingContract.addCandidate("Kandidat A - Visi Pendidikan");
    await votingContract.addCandidate("Kandidat B - Visi Teknologi");
    await votingContract.addCandidate("Kandidat C - Visi Lingkungan");
    
    console.log("✅ Test candidates added!");
    
    // Get some test accounts for voters
    const accounts = await ethers.getSigners();
    console.log("\n🗳️  Authorizing test voters...");
    
    // Authorize first 3 accounts as voters (excluding deployer)
    for (let i = 1; i <= 3 && i < accounts.length; i++) {
      await votingContract.authorizeVoter(accounts[i].address);
      console.log(`✅ Authorized voter ${i}: ${accounts[i].address}`);
    }
    
    console.log("\n🎉 LOCAL DEPLOYMENT COMPLETE!");
    console.log("================================");
    console.log("📋 SUMMARY:");
    console.log("Contract Address:", contractAddress);
    console.log("Admin (You):", deployer.address);
    console.log("Candidates: 3 test candidates added");
    console.log("Authorized Voters: 3 accounts");
    console.log("\n💡 Next steps:");
    console.log("1. Update contractInfo.js with new address");
    console.log("2. Start your React app: cd ../evoting-client && npm start");
    console.log("3. Connect MetaMask to localhost:8545");
    
    return {
      contractAddress,
      adminAddress: deployer.address,
      testVoters: accounts.slice(1, 4).map(acc => acc.address)
    };
    
  } catch (error) {
    console.error("❌ DEPLOYMENT FAILED:");
    console.error(error.message);
    
    if (error.message.includes("could not detect network")) {
      console.log("\n💡 SOLUTION:");
      console.log("Run this command in a separate terminal first:");
      console.log("npx hardhat node");
      console.log("\nThen run this script again.");
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = main;
