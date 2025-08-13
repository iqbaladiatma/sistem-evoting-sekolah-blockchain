# 🗳️ Blockchain E-Voting System - Smart Contract

Sistem voting berbasis blockchain yang aman dan transparan untuk pemilihan sekolah.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Smart Contract
```bash
npx hardhat compile
```

### 3. Test Contract (Recommended)
```bash
# Run comprehensive tests
npx hardhat run scripts/test-voting.js

# Or run built-in Hardhat tests
npx hardhat test
```

## 🏠 Local Development

### Option 1: Deploy to Local Hardhat Network
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy with test data
npx hardhat run scripts/deploy-local.js --network localhost
```

### Option 2: Quick Deploy (Hardhat Network)
```bash
# Deploy to temporary Hardhat network
npx hardhat run scripts/deploy.js
```

## 🌐 Deploy to Real Networks

### Setup Environment
1. Copy environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Deploy to Sepolia Testnet (FREE)
```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-network.js --network sepolia
```

### Deploy to Polygon (Low Cost)
```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy-network.js --network polygon
```

### Deploy to Ethereum Mainnet (High Cost)
```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy-network.js --network mainnet
```

## 📁 Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `deploy.js` | Basic deployment script | `npx hardhat run scripts/deploy.js` |
| `deploy-local.js` | Local deployment with test data | `npx hardhat run scripts/deploy-local.js --network localhost` |
| `deploy-network.js` | Production deployment | `npx hardhat run scripts/deploy-network.js --network <network>` |
| `test-voting.js` | Comprehensive testing | `npx hardhat run scripts/test-voting.js` |

## 🔧 Contract Functions

### Admin Functions (Only Contract Deployer)
- `addCandidate(string _name)` - Add new candidate
- `authorizeVoter(address _voterAddress)` - Give voting rights

### Public Functions
- `vote(uint _candidateId)` - Cast vote (authorized voters only)
- `candidates(uint _id)` - Get candidate info
- `voters(address _voter)` - Get voter status
- `admin()` - Get admin address
- `candidatesCount()` - Get total candidates

## 🛡️ Security Features

- ✅ **Admin-only functions**: Only deployer can add candidates/authorize voters
- ✅ **One vote per address**: Prevents double voting
- ✅ **Authorization required**: Only authorized addresses can vote
- ✅ **Immutable votes**: Votes cannot be changed once cast
- ✅ **Transparent results**: All votes are publicly verifiable

## 📊 Testing

The system includes comprehensive tests covering:
- Admin verification
- Candidate management
- Voter authorization
- Voting process
- Double voting prevention
- Unauthorized access prevention

Run tests with:
```bash
npx hardhat run scripts/test-voting.js
```

## 🔍 Verification

After deployment to public networks, verify your contract:
```bash
npx hardhat verify --network <network> <contract_address>
```

## 📝 Deployment Logs

All deployments are automatically logged to `deployments/` directory with:
- Contract address
- Deployer address
- Network information
- Gas usage
- Timestamp

## 🆘 Troubleshooting

### "Could not detect network" Error
**Solution**: Start Hardhat node first:
```bash
npx hardhat node
```

### "Insufficient funds" Error
**Solution**: 
- For Sepolia: Get free ETH from https://sepoliafaucet.com/
- For Mainnet/Polygon: Add ETH/MATIC to your wallet

### "INFURA_PROJECT_ID not set" Error
**Solution**: 
1. Get free API key from https://infura.io
2. Add to `.env` file

### Contract Verification Failed
**Solution**: 
1. Get Etherscan API key from https://etherscan.io/apis
2. Add to `.env` file as `ETHERSCAN_API_KEY`

## 🔗 Network Configuration

Supported networks:
- **localhost**: Local Hardhat network (development)
- **sepolia**: Ethereum Sepolia testnet (free testing)
- **polygon**: Polygon mainnet (low cost production)
- **mumbai**: Polygon Mumbai testnet (free testing)
- **mainnet**: Ethereum mainnet (high cost production)

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure all dependencies are installed
3. Verify your network configuration
4. Check your wallet balance for gas fees

## 🎯 Next Steps

After successful deployment:
1. Update frontend `contractInfo.js` with new contract address
2. Add candidates using admin functions
3. Authorize voters
4. Test the complete voting flow
