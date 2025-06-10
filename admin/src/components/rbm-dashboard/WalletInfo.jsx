import React from 'react';
import { Grid, Stack, Avatar, Box, Typography, Skeleton } from '@mui/material';
import { Verified, ContentCopy, OpenInNew } from '@mui/icons-material';
import { GlassCard, AnimatedButton } from './StyledComponents';

const WalletInfo = ({ account, copyToClipboard }) => {
  return (
    <Grid container spacing={4} sx={{ mb: 6 }}>
      <Grid item xs={12}>
        <GlassCard sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Verified />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Wallet Connected
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {account.address.slice(0, 8)}...{account.address.slice(-8)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-end' }}>
                <AnimatedButton
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(account.address)}
                >
                  Copy Address
                </AnimatedButton>
                <AnimatedButton
                  variant="outlined"
                  size="small"
                  startIcon={<OpenInNew />}
                  onClick={() => window.open(`https://bscscan.com/address/${account.address}`, '_blank')}
                >
                  View on BSCScan
                </AnimatedButton>
              </Stack>
            </Grid>
          </Grid>
        </GlassCard>
      </Grid>
    </Grid>
  );
};

export default WalletInfo;
