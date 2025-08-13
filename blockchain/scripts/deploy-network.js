// Script untuk deployment ke berbagai network (Sepolia, Polygon, dll)
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const networkName = hre.network.name;
  console.log(`🌐 DEPLOYING TO ${networkName.toUpperCase()}`);
  console.log("================================");
  
  try {
    // Validate network configuration
    if (networkName !== "localhost" && networkName !== "hardhat") {
      console.log("🔍 Checking network configuration...");
      
      // Check if .env exists
      const envPath = path.join(__dirname, "../.env");
      if (!fs.existsSync(envPath)) {
        throw new Error("❌ .env file not found! Please copy .env.example to .env and configure it.");
      }
      
      // Check required environment variables
      if (!process.env.INFURA_PROJECT_ID) {
        throw new Error("❌ INFURA_PROJECT_ID not set in .env file!");
      }
      
      if (!process.env.PRIVATE_KEY) {
        throw new Error("❌ PRIVATE_KEY not set in .env file!");
      }
      
      console.log("✅ Network configuration valid");
    }
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer address:", deployer.address);
    
    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log("💰 Balance:", balanceInEth, "ETH");
    
    // Warn if balance is low
    if (parseFloat(balanceInEth) < 0.01) {
      console.log("⚠️  WARNING: Low balance! Make sure you have enough ETH for gas fees.");
      
      if (networkName === "sepolia") {
        console.log("💡 Get free Sepolia ETH from: https://sepoliafaucet.com/");
      }
    }
    
    // Get network info
    const network = await deployer.provider.getNetwork();
    console.log("🔗 Network:", network.name);
    console.log("🆔 Chain ID:", network.chainId.toString());
    
    // Estimate gas price
    const gasPrice = await deployer.provider.getFeeData();
    console.log("⛽ Gas price:", ethers.formatUnits(gasPrice.gasPrice || 0, "gwei"), "gwei");
    
    // Deploy contract
    console.log("\n📦 Deploying Voting contract...");
    const VotingFactory = await ethers.getContractFactory("Voting");
    
    // Estimate deployment cost
    const deploymentData = VotingFactory.interface.encodeDeploy([]);
    const estimatedGas = await deployer.estimateGas({
      data: deploymentData
    });
    
    const estimatedCost = estimatedGas * (gasPrice.gasPrice || 0n);
    console.log("📊 Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");
    
    // Deploy with gas optimization
    const votingContract = await VotingFactory.deploy({
      gasLimit: estimatedGas + (estimatedGas / 10n) // Add 10% buffer
    });
    
    console.log("⏳ Waiting for deployment confirmation...");
    await votingContract.waitForDeployment();
    
    const contractAddress = await votingContract.getAddress();
    console.log("✅ Contract deployed at:", contractAddress);
    
    // Verify deployment
    console.log("🔍 Verifying deployment...");
    const admin = await votingContract.admin();
    console.log("🔐 Admin address:", admin);
    
    if (admin.toLowerCase() === deployer.address.toLowerCase()) {
      console.log("✅ Admin verification: PASSED");
    } else {
      console.log("❌ Admin verification: FAILED");
    }
    
    // Save deployment information
    const deploymentInfo = {
      contractAddress: contractAddress,
      deployerAddress: deployer.address,
      networkName: network.name,
      chainId: network.chainId.toString(),
      deploymentTime: new Date().toISOString(),
      blockNumber: await deployer.provider.getBlockNumber(),
      gasUsed: estimatedGas.toString(),
      gasPrice: gasPrice.gasPrice?.toString() || "0",
      deploymentCost: ethers.formatEther(estimatedCost)
    };
    
    // Create deployments directory
    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }
    
    // Save deployment info
    const fileName = `deployment-${network.name}-${Date.now()}.json`;
    const filePath = path.join(deploymentPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("📄 Deployment info saved to:", fileName);
    
    // Update contractInfo.js for frontend
    await updateContractInfo(contractAddress, network.name);
    
    // Show next steps
    console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("==========================");
    console.log("📋 DEPLOYMENT SUMMARY:");
    console.log("Contract Address:", contractAddress);
    console.log("Network:", network.name);
    console.log("Admin:", deployer.address);
    console.log("Deployment Cost:", ethers.formatEther(estimatedCost), "ETH");
    
    console.log("\n📝 NEXT STEPS:");
    console.log("1. Update your frontend with the new contract address");
    console.log("2. Add candidates using the admin functions");
    console.log("3. Authorize voters");
    console.log("4. Test the voting functionality");
    
    if (networkName !== "localhost" && networkName !== "hardhat") {
      console.log("\n🔍 VERIFICATION:");
      console.log(`View on explorer: https://${networkName === 'mainnet' ? '' : networkName + '.'}etherscan.io/address/${contractAddress}`);
      
      if (process.env.ETHERSCAN_API_KEY) {
        console.log("\n⚡ To verify contract source code, run:");
        console.log(`npx hardhat verify --network ${networkName} ${contractAddress}`);
      }
    }
    
    return deploymentInfo;
    
  } catch (error) {
    console.error("❌ DEPLOYMENT FAILED:");
    console.error(error.message);
    
    // Provide helpful error messages
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 SOLUTION: Add more ETH to your wallet");
      if (networkName === "sepolia") {
        console.log("Get free Sepolia ETH: https://sepoliafaucet.com/");
      }
    } else if (error.message.includes("could not detect network")) {
      console.log("\n💡 SOLUTION: Check your network configuration in hardhat.config.js");
    } else if (error.message.includes("INFURA_PROJECT_ID")) {
      console.log("\n💡 SOLUTION: Get free Infura API key from https://infura.io");
    }
    
    process.exit(1);
  }
}

// Update contractInfo.js with new deployment
async function updateContractInfo(contractAddress, networkName) {
  try {
    const contractInfoPath = path.join(__dirname, "../../evoting-client/src/contractInfo.js");
    
    if (fs.existsSync(contractInfoPath)) {
      let content = fs.readFileSync(contractInfoPath, 'utf8');
      
      // Add comment about the network
      const networkComment = `// DEPLOYED TO ${networkName.toUpperCase()} - ${new Date().toISOString()}`;
      
      // Replace contract address and add network info
      content = content.replace(
        /\/\/ .*\nexport const contractAddress = ".*";/,
        `${networkComment}\nexport const contractAddress = "${contractAddress}";`
      );
      
      // If no previous comment, just replace the address
      if (!content.includes(networkComment)) {
        content = content.replace(
          /export const contractAddress = ".*";/,
          `${networkComment}\nexport const contractAddress = "${contractAddress}";`
        );
      }
      
      fs.writeFileSync(contractInfoPath, content);
      console.log("✅ contractInfo.js updated with new deployment info");
    }
  } catch (error) {
    console.log("⚠️  Could not update contractInfo.js:", error.message);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = main;
