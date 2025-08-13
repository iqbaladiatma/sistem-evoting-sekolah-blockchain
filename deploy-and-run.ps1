# Script untuk deploy smart contract dan menjalankan aplikasi e-voting
# Pastikan Anda sudah menginstall Node.js dan npm

Write-Host "=== SISTEM E-VOTING SEKOLAH BLOCKCHAIN ===" -ForegroundColor Green
Write-Host ""

# Check if Hardhat local network is running
Write-Host "1. Memeriksa jaringan Hardhat..." -ForegroundColor Yellow
$hardhatProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*hardhat*node*" }

if (-not $hardhatProcess) {
    Write-Host "   Jaringan Hardhat belum berjalan. Memulai jaringan lokal..." -ForegroundColor Cyan
    Write-Host "   Buka terminal baru dan jalankan: cd blockchain && npx hardhat node" -ForegroundColor White
    Write-Host "   Tekan Enter setelah jaringan Hardhat berjalan..."
    Read-Host
}

# Deploy smart contract
Write-Host "2. Deploy smart contract..." -ForegroundColor Yellow
Set-Location "blockchain"

# Install dependencies jika belum
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing blockchain dependencies..." -ForegroundColor Cyan
    npm install
}

# Compile contract
Write-Host "   Compiling smart contract..." -ForegroundColor Cyan
npx hardhat compile

# Deploy contract
Write-Host "   Deploying contract to local network..." -ForegroundColor Cyan
$deployOutput = npx hardhat run scripts/deploy.js --network localhost 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Contract deployed successfully!" -ForegroundColor Green
    Write-Host $deployOutput
} else {
    Write-Host "   ❌ Contract deployment failed!" -ForegroundColor Red
    Write-Host $deployOutput
    Write-Host "   Pastikan jaringan Hardhat berjalan di terminal lain dengan: npx hardhat node"
    exit 1
}

# Setup React app
Write-Host "3. Setup React application..." -ForegroundColor Yellow
Set-Location "../evoting-client"

# Install dependencies jika belum
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing React dependencies..." -ForegroundColor Cyan
    npm install
}

# Start React app
Write-Host "4. Menjalankan aplikasi React..." -ForegroundColor Yellow
Write-Host "   Aplikasi akan terbuka di http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Pastikan MetaMask terhubung ke jaringan Hardhat (localhost:8545)" -ForegroundColor White
Write-Host ""
Write-Host "=== PETUNJUK PENGGUNAAN ===" -ForegroundColor Green
Write-Host "1. Buka MetaMask dan tambahkan jaringan Hardhat:" -ForegroundColor White
Write-Host "   - Network Name: Hardhat Local" -ForegroundColor Gray
Write-Host "   - RPC URL: http://127.0.0.1:8545" -ForegroundColor Gray
Write-Host "   - Chain ID: 31337" -ForegroundColor Gray
Write-Host "   - Currency Symbol: ETH" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Import akun dari Hardhat ke MetaMask menggunakan private key" -ForegroundColor White
Write-Host "3. Akun pertama (Account #0) adalah admin yang bisa menambah kandidat" -ForegroundColor White
Write-Host "4. Akun lain perlu diberi hak suara oleh admin" -ForegroundColor White
Write-Host ""

npm start
