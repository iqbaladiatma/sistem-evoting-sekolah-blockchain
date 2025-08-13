// GANTI DENGAN ALAMAT KONTRAK DARI LANGKAH 2
export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ABI LENGKAP UNTUK VOTING CONTRACT
export const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      }
    ],
    name: "CandidateAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address"
      }
    ],
    name: "VoterAuthorized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address"
      }
    ],
    name: "VotedEvent",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string"
      }
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterAddress",
        type: "address"
      }
    ],
    name: "authorizeVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "candidatesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256"
      }
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "voters",
    outputs: [
      {
        internalType: "bool",
        name: "isAuthorized",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "hasVoted",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "votedFor",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
