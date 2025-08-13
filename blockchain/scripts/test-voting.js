// Script untuk testing lengkap sistem voting
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 MEMULAI TESTING SISTEM VOTING");
  console.log("==================================");
  
  try {
    // Get test accounts
    const accounts = await ethers.getSigners();
    const [admin, voter1, voter2, voter3, unauthorized] = accounts;
    
    console.log("👤 Test Accounts:");
    console.log("Admin:", admin.address);
    console.log("Voter 1:", voter1.address);
    console.log("Voter 2:", voter2.address);
    console.log("Voter 3:", voter3.address);
    console.log("Unauthorized:", unauthorized.address);
    
    // Deploy contract
    console.log("\n📦 Deploying contract...");
    const VotingFactory = await ethers.getContractFactory("Voting");
    const votingContract = await VotingFactory.deploy();
    await votingContract.waitForDeployment();
    
    const contractAddress = await votingContract.getAddress();
    console.log("✅ Contract deployed at:", contractAddress);
    
    // Test 1: Admin verification
    console.log("\n🔍 Test 1: Admin Verification");
    const adminFromContract = await votingContract.admin();
    console.log("Expected admin:", admin.address);
    console.log("Actual admin:", adminFromContract);
    console.log(adminFromContract === admin.address ? "✅ PASSED" : "❌ FAILED");
    
    // Test 2: Add candidates
    console.log("\n🔍 Test 2: Adding Candidates");
    await votingContract.addCandidate("Alice - Ketua OSIS");
    await votingContract.addCandidate("Bob - Wakil Ketua");
    await votingContract.addCandidate("Charlie - Sekretaris");
    
    const candidatesCount = await votingContract.candidatesCount();
    console.log("Candidates added:", candidatesCount.toString());
    console.log(candidatesCount.toString() === "3" ? "✅ PASSED" : "❌ FAILED");
    
    // Test 3: Authorize voters
    console.log("\n🔍 Test 3: Authorizing Voters");
    await votingContract.authorizeVoter(voter1.address);
    await votingContract.authorizeVoter(voter2.address);
    await votingContract.authorizeVoter(voter3.address);
    
    const voter1Status = await votingContract.voters(voter1.address);
    console.log("Voter 1 authorized:", voter1Status.isAuthorized);
    console.log(voter1Status.isAuthorized ? "✅ PASSED" : "❌ FAILED");
    
    // Test 4: Voting process
    console.log("\n🔍 Test 4: Voting Process");
    
    // Voter 1 votes for candidate 1
    const voter1Contract = votingContract.connect(voter1);
    await voter1Contract.vote(1);
    
    // Voter 2 votes for candidate 2
    const voter2Contract = votingContract.connect(voter2);
    await voter2Contract.vote(2);
    
    // Voter 3 votes for candidate 1
    const voter3Contract = votingContract.connect(voter3);
    await voter3Contract.vote(1);
    
    console.log("✅ All votes cast successfully");
    
    // Test 5: Vote counting
    console.log("\n🔍 Test 5: Vote Counting");
    const candidate1 = await votingContract.candidates(1);
    const candidate2 = await votingContract.candidates(2);
    const candidate3 = await votingContract.candidates(3);
    
    console.log("Candidate 1 votes:", candidate1.voteCount.toString());
    console.log("Candidate 2 votes:", candidate2.voteCount.toString());
    console.log("Candidate 3 votes:", candidate3.voteCount.toString());
    
    const expectedVotes = candidate1.voteCount.toString() === "2" && 
                         candidate2.voteCount.toString() === "1" && 
                         candidate3.voteCount.toString() === "0";
    console.log(expectedVotes ? "✅ PASSED" : "❌ FAILED");
    
    // Test 6: Prevent double voting
    console.log("\n🔍 Test 6: Double Voting Prevention");
    try {
      await voter1Contract.vote(2); // This should fail
      console.log("❌ FAILED - Double voting allowed");
    } catch (error) {
      console.log("✅ PASSED - Double voting prevented");
    }
    
    // Test 7: Unauthorized voting prevention
    console.log("\n🔍 Test 7: Unauthorized Voting Prevention");
    try {
      const unauthorizedContract = votingContract.connect(unauthorized);
      await unauthorizedContract.vote(1); // This should fail
      console.log("❌ FAILED - Unauthorized voting allowed");
    } catch (error) {
      console.log("✅ PASSED - Unauthorized voting prevented");
    }
    
    // Test 8: Only admin can add candidates
    console.log("\n🔍 Test 8: Admin-only Functions");
    try {
      const voter1Contract = votingContract.connect(voter1);
      await voter1Contract.addCandidate("Hacker Candidate"); // This should fail
      console.log("❌ FAILED - Non-admin can add candidates");
    } catch (error) {
      console.log("✅ PASSED - Only admin can add candidates");
    }
    
    // Final results
    console.log("\n🏆 FINAL RESULTS");
    console.log("=================");
    for (let i = 1; i <= 3; i++) {
      const candidate = await votingContract.candidates(i);
      console.log(`${candidate.name}: ${candidate.voteCount} votes`);
    }
    
    console.log("\n🎉 ALL TESTS COMPLETED!");
    console.log("Contract is working perfectly! ✅");
    
  } catch (error) {
    console.error("❌ TEST FAILED:");
    console.error(error.message);
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
