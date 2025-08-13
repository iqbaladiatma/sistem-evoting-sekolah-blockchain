# Sistem E-Voting Sekolah Berbasis Blockchain

Proyek ini adalah sebuah prototipe fungsional (Proof of Concept) untuk sistem pemungutan suara elektronik (e-voting) yang aman, transparan, dan terdesentralisasi menggunakan teknologi blockchain Ethereum.

## Fitur Utama
- **Manajemen Admin:** Admin utama dapat menunjuk admin lain.
- **Manajemen Kandidat:** Admin dapat menambahkan kandidat yang akan dipilih.
- **Manajemen Pemilih:** Admin dapat memberikan hak suara kepada alamat dompet tertentu.
- **Proses Voting:** Pemilih yang sah dapat memberikan satu suara untuk satu kandidat.
- **Transparansi:** Semua proses (penambahan kandidat, pemberian suara) tercatat di blockchain dan dapat diverifikasi.

## Tumpukan Teknologi (Tech Stack)

### Backend (Smart Contract)
- **Bahasa:** Solidity
- **Framework:** Hardhat
- **Jaringan Lokal:** Hardhat Network

### Frontend (Client)
- **Library:** React.js
- **Jembatan Blockchain:** Ethers.js
- **Wallet:** MetaMask

## Cara Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js (v18 atau lebih baru)
- Git
- MetaMask (Ekstensi Browser)

### Langkah-langkah Backend
1. Clone repositori ini: `git clone https://github.com/iqbaladiatma/sistem-evoting-sekolah-blockchain.git`
2. Masuk ke folder backend: `cd sistem-evoting-sekolah-blockchain/blockchain`
3. Install semua dependencies: `npm install`
4. Jalankan node blockchain lokal di satu terminal: `npx hardhat node`
5. Buka terminal kedua, deploy smart contract: `npx hardhat run scripts/deploy.js --network localhost`
6. Catat alamat kontrak yang muncul di terminal.

### Langkah-langkah Frontend
1. Masuk ke folder frontend: `cd ../evoting-client`
2. Install semua dependencies: `npm install`
3. (PENTING) Buat file `.env` di dalam folder `evoting-client` dan isi dengan: `REACT_APP_CONTRACT_ADDRESS=ALAMAT_KONTRAK_ANDA_DARI_LANGKAH_6`
4. Jalankan aplikasi: `npm start`
5. Buka browser Anda di `http://localhost:3000`, hubungkan MetaMask yang sudah di-setting ke jaringan Hardhat Local.
