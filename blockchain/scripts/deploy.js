// Import library ethers dari hardhat
const { ethers } = require("hardhat");

async function main() {
  console.log("Mempersiapkan deployment...");

  // Perintah ini akan mencari contract bernama "Voting" di folder contracts,
  // mengkompilasinya (jika belum), dan mengirimkannya ke blockchain.
  const votingContract = await ethers.deployContract("Voting");

  // Kita tunggu hingga proses deployment benar-benar selesai dan tercatat di blockchain.
  await votingContract.waitForDeployment();

  // Cetak pesan sukses ke terminal beserta alamat contract yang baru di-deploy.
  // Alamat ini SANGAT PENTING untuk frontend kita nanti.
  console.log(
    `Smart Contract "Voting.sol" berhasil di-deploy ke alamat: ${votingContract.target}`
  );
}

// Pola standar untuk menjalankan fungsi main dan menangani jika ada error.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});