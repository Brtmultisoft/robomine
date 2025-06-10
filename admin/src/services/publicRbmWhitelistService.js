// Public RBM WhiteList Service - No Admin Authentication Required
import { getContract, readContract, prepareContractCall, sendTransaction } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { client, bscChain } from '../lib/thirdweb';

// Contract Configuration
const CONTRACT_ADDRESS = '0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3';

// Simplified ABI for public functions only
const PUBLIC_CONTRACT_ABI = [
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
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
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

class PublicRBMWhitelistService {
  constructor() {
    this.client = client;
    this.chain = bscChain;
    this.contractAddress = CONTRACT_ADDRESS;
    this.contractABI = PUBLIC_CONTRACT_ABI;
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

  // Public Read Functions
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

  async getBalance(userAddress) {
    try {
      const balance = await readContract({
        contract: this.contract,
        method: 'balanceOf',
        params: [userAddress],
      });
      return (Number(balance) / 1e18).toString(); // Convert from wei to ether
    } catch (error) {
      console.error('Error checking balance:', error);
      throw error;
    }
  }

  // Public Write Functions
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

  // Get supported wallets for public use
  getSupportedWallets() {
    return [
      createWallet('io.metamask'),
      createWallet('com.coinbase.wallet'),
      createWallet('me.rainbow'),
      createWallet('com.trustwallet.app'),
      createWallet('io.zerion.wallet'),
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

  // Validate Ethereum address
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Get user status (combined function for efficiency)
  async getUserStatus(userAddress) {
    try {
      if (!this.isValidAddress(userAddress)) {
        throw new Error('Invalid address format');
      }

      const [isRegistered, allowance, balance] = await Promise.all([
        this.checkIfRegistered(userAddress),
        this.checkAllowance(userAddress),
        this.getBalance(userAddress)
      ]);

      return {
        address: userAddress,
        isRegistered,
        allowance: parseFloat(allowance),
        balance: parseFloat(balance),
        canTransfer: parseFloat(allowance) > 0,
        formattedAddress: this.formatAddress(userAddress),
        bscscanLink: this.getBSCScanLink(userAddress)
      };
    } catch (error) {
      console.error('Error getting user status:', error);
      throw error;
    }
  }

  // Check if address is contract owner (for display purposes)
  async isContractOwner(userAddress) {
    try {
      // This would need to be implemented based on contract's owner function
      // For now, return false as this is public service
      return false;
    } catch (error) {
      console.error('Error checking contract owner:', error);
      return false;
    }
  }

  // Get contract information
  getContractInfo() {
    return {
      address: this.contractAddress,
      chain: 'BSC',
      chainId: 56,
      network: 'Binance Smart Chain',
      explorer: 'https://bscscan.com',
      contractLink: this.getBSCScanLink(this.contractAddress, 'address')
    };
  }
}

export default new PublicRBMWhitelistService();
