import { createThirdwebClient, defineChain } from 'thirdweb';
import {
  createWallet,
  inAppWallet,
  walletConnect
} from 'thirdweb/wallets';

// Create the client with your clientId
export const client = createThirdwebClient({
  clientId: process.env.REACT_APP_THIRDWEB_CLIENT_ID || 'test-client-id'
});

// Define BSC chain
export const bscChain = defineChain({
  id: 56,
  name: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpc: 'https://bsc-dataseed1.binance.org',
  blockExplorers: [
    {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  ],
});

// Define supported wallets - this will show 500+ wallets
export const wallets = [
  // Popular wallets first
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('com.trustwallet.app'),
  createWallet('io.zerion.wallet'),
  createWallet('app.phantom'),
  createWallet('com.okex.wallet'),
  createWallet('org.mathwallet'),
  createWallet('com.safepal'),
  createWallet('com.tokenpocket'),
  createWallet('im.token'),
  createWallet('com.bitkeep'),

  // WalletConnect for 500+ wallets
  walletConnect(),

  // In-app wallet for email/social login
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook', 'phone'],
    },
  }),
];
