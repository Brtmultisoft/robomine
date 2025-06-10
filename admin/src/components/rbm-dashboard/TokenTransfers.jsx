import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  Skeleton,
  Stack
} from '@mui/material';
import { Send } from '@mui/icons-material';

const TokenTransfers = ({
  transferAddress,
  setTransferAddress,
  isOwner,
  isTransactionPending,
  handleSingleTransfer,
  handleMultiTransfer,
  loading = false
}) => {

  if (loading) {
    return (
      <Box>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width="60%" height={20} />
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="text" width="80%" height={16} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width="90%" height={16} />
                <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transfer Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Execute single or multi transfers (Owner only)
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Single Transfer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Transfer tokens from a specific address
            </Typography>
            <TextField
              fullWidth
              label="User Address"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              placeholder="0x..."
              sx={{ mb: 3 }}
            />
            <Tooltip
              title={!isOwner ? "🚫 You are not the contract owner! Only the contract owner can perform transfers." : "Transfer tokens from a specific address"}
              arrow
              placement="top"
            >
              <span style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSingleTransfer}
                  disabled={!isOwner || isTransactionPending}
                  startIcon={isTransactionPending ? <CircularProgress size={20} /> : <Send />}
                >
                  {isTransactionPending ? 'Processing...' : 'Single Transfer'}
                </Button>
              </span>
            </Tooltip>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Multi Transfer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Transfer tokens from all registered users
            </Typography>
            <Tooltip
              title={!isOwner ? "🚫 You are not the contract owner! Only the contract owner can perform transfers." : "Transfer tokens from all registered users"}
              arrow
              placement="top"
            >
              <span style={{ width: '100%' }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleMultiTransfer}
                  disabled={!isOwner || isTransactionPending}
                  startIcon={isTransactionPending ? <CircularProgress size={20} /> : <Send />}
                  color="secondary"
                >
                  {isTransactionPending ? 'Processing...' : 'Multi Transfer'}
                </Button>
              </span>
            </Tooltip>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TokenTransfers;
