import React from 'react';
import { Grid, Typography, Avatar, Box } from '@mui/material';
import { ConnectButton } from 'thirdweb/react';
import { AccountBalanceWallet } from '@mui/icons-material';
import { client, bscChain, wallets } from '../../lib/thirdweb';
import { GlassCard } from './StyledComponents';

const WalletConnection = () => {
  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      <Grid item xs={12}>
        <GlassCard sx={{ textAlign: 'center', p: 6 }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, bgcolor: 'primary.main' }}>
            <AccountBalanceWallet sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Connect Your Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Connect your wallet to access all RBM dashboard features including contract queries,
            whitelist management, and owner-only transfer functions.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <ConnectButton
              client={client}
              wallets={wallets}
              chain={bscChain}
              connectModal={{
                size: 'wide',
                title: 'Connect Wallet to RBM Dashboard',
                showThirdwebBranding: false,
              }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary">
            Supported networks: Binance Smart Chain (BSC)
          </Typography>
        </GlassCard>
      </Grid>
    </Grid>
  );
};

export default WalletConnection;
