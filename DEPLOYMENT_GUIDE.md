# 🚀 Panduan Deploy E-Voting ke Jaringan Ethereum

## 📋 Pilihan Jaringan

### 1. **Sepolia Testnet (GRATIS - Direkomendasikan)**
- ✅ **Gratis**: ETH test dari faucet
- ✅ **Stabil**: Jaringan testnet resmi Ethereum
- ✅ **Cocok untuk**: Testing dan demo

### 2. **Polygon (Murah - Direkomendasikan untuk Produksi)**
- ✅ **Gas fee murah**: ~$0.01 per transaksi
- ✅ **Cepat**: Konfirmasi dalam detik
- ✅ **Kompatibel**: 100% compatible dengan Ethereum

### 3. **Ethereum Mainnet (Mahal)**
- ❌ **Gas fee tinggi**: $10-50+ per transaksi
- ✅ **Keamanan tertinggi**
- ⚠️ **Hanya untuk produksi skala besar**

## 🛠️ Setup untuk Deploy ke Jaringan Sebenarnya

### Step 1: Install Dependencies
```bash
cd blockchain
npm install dotenv
```

### Step 2: Setup Environment Variables
1. Copy file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

2. Edit file `.env` dan isi:
```env
# Daftar gratis di https://infura.io
INFURA_PROJECT_ID=your_project_id_here

# Private key dari MetaMask (JANGAN SHARE!)
PRIVATE_KEY=your_private_key_here
```

### Step 3: Dapatkan ETH untuk Gas Fee

#### Untuk Sepolia Testnet (GRATIS):
1. Kunjungi: https://sepoliafaucet.com/
2. Masukkan alamat wallet Anda
3. Dapatkan ETH test gratis

#### Untuk Polygon:
1. Beli MATIC di exchange (Binance, Coinbase, dll)
2. Transfer ke wallet MetaMask Anda

### Step 4: Deploy Contract
```bash
# Deploy ke Sepolia Testnet (GRATIS)
npx hardhat run scripts/deploy.js --network sepolia

# Deploy ke Polygon (MURAH)
npx hardhat run scripts/deploy.js --network polygon

# Deploy ke Ethereum Mainnet (MAHAL)
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 5: Update Frontend
1. Copy alamat contract dari output deployment
2. Update `contractAddress` di file `evoting-client/src/contractInfo.js`
3. Pastikan MetaMask terhubung ke jaringan yang sama

## 🔧 Setup MetaMask untuk Jaringan Berbeda

### Sepolia Testnet:
- **Network Name**: Sepolia
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Chain ID**: 11155111
- **Currency**: ETH

### Polygon:
- **Network Name**: Polygon
- **RPC URL**: https://polygon-rpc.com/
- **Chain ID**: 137
- **Currency**: MATIC

### Ethereum Mainnet:
- **Network Name**: Ethereum Mainnet
- **RPC URL**: https://mainnet.infura.io/v3/YOUR_PROJECT_ID
- **Chain ID**: 1
- **Currency**: ETH

## 💰 Perkiraan Biaya

### Sepolia Testnet: **GRATIS**
- Deploy contract: 0 ETH (test)
- Add candidate: 0 ETH (test)
- Vote: 0 ETH (test)

### Polygon: **~$0.50 total**
- Deploy contract: ~$0.20
- Add candidate: ~$0.01 per kandidat
- Vote: ~$0.01 per suara

### Ethereum Mainnet: **$50-200+ total**
- Deploy contract: $20-100+
- Add candidate: $5-20+ per kandidat
- Vote: $5-20+ per suara

## ⚠️ Tips Keamanan

1. **JANGAN PERNAH** share private key Anda
2. **SELALU** test di testnet dulu sebelum mainnet
3. **BACKUP** private key di tempat yang aman
4. **GUNAKAN** wallet terpisah untuk development
5. **VERIFIKASI** alamat contract sebelum digunakan

## 🎯 Rekomendasi

**Untuk Testing/Demo**: Gunakan **Sepolia Testnet** (gratis)
**Untuk Produksi**: Gunakan **Polygon** (murah dan cepat)
**Untuk Enterprise**: Gunakan **Ethereum Mainnet** (paling secure)
