import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { MoneyRecive, Wallet3, UserRemove } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';
import SimpleWalletConnect from '../../../components/SimpleWalletConnect';

const SingleTransfer = () => {
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const connectWallet = async () => {
    try {
      const address = await rbmWhitelistService.connectWallet();
      setWalletAddress(address);
      setWalletConnected(true);

      // Check if connected wallet is owner
      const contractOwner = await rbmWhitelistService.getOwner();
      setIsOwner(address.toLowerCase() === contractOwner.toLowerCase());

      setError('');
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const checkUserInfo = async () => {
    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setChecking(true);
      setError('');

      const [isRegistered, balance, allowance] = await Promise.all([
        rbmWhitelistService.checkIfRegistered(userAddress),
        rbmWhitelistService.checkBalance(userAddress),
        rbmWhitelistService.checkAllowance(userAddress)
      ]);

      setUserInfo({
        isRegistered,
        balance: parseFloat(balance),
        allowance: parseFloat(allowance),
        canTransfer: isRegistered && parseFloat(allowance) >= parseFloat(balance) && parseFloat(balance) > 0
      });
    } catch (err) {
      setError('Failed to check user info: ' + err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleTransfer = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isOwner) {
      setError('Only contract owner can execute transfers');
      return;
    }

    if (!userInfo || !userInfo.canTransfer) {
      setError('Transfer conditions not met');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await rbmWhitelistService.transferSingle(userAddress);
      setTxHash(result.hash);
      setSuccess(`Transfer successful! Transferred ${userInfo.balance} RBM tokens from ${rbmWhitelistService.formatAddress(userAddress)}`);

      // Refresh user info
      await checkUserInfo();
    } catch (err) {
      setError('Transfer failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTxOnBSCScan = () => {
    if (txHash) {
      window.open(rbmWhitelistService.getBSCScanLink(txHash, 'tx'), '_blank');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Single Transfer
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Transfer tokens from a specific registered user
        </Typography>
      </Box>

      {/* Error/Success Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
          {txHash && (
            <Button
              size="small"
              onClick={openTxOnBSCScan}
              sx={{ ml: 2 }}
            >
              View on BSCScan
            </Button>
          )}
        </Alert>
      )}

      {/* Wallet Connection */}
      <SimpleWalletConnect />

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Address
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <TextField
                fullWidth
                label="Enter User Address"
                placeholder="0x..."
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                sx={{ mb: 3 }}
                helperText="Enter the Ethereum address of the user to transfer from"
              />
              
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={checkUserInfo}
                  disabled={checking || !userAddress}
                  startIcon={checking ? <CircularProgress size={20} /> : <UserRemove />}
                  fullWidth
                >
                  {checking ? 'Checking...' : 'Check User Info'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {!userInfo ? (
                <Typography variant="body2" color="textSecondary">
                  Enter a user address and click "Check User Info" to see details
                </Typography>
              ) : (
                <Box>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">Registration Status:</Typography>
                      <Chip 
                        label={userInfo.isRegistered ? 'Registered' : 'Not Registered'} 
                        color={userInfo.isRegistered ? 'success' : 'error'} 
                        size="small" 
                      />
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">Token Balance:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {userInfo.balance.toFixed(4)} RBM
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">Allowance:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {userInfo.allowance.toFixed(4)} RBM
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2">Can Transfer:</Typography>
                      <Chip 
                        label={userInfo.canTransfer ? 'Yes' : 'No'} 
                        color={userInfo.canTransfer ? 'success' : 'error'} 
                        size="small" 
                      />
                    </Box>
                  </Paper>

                  {userInfo.canTransfer && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      This user has {userInfo.balance.toFixed(4)} RBM tokens available for transfer.
                    </Alert>
                  )}

                  {!userInfo.canTransfer && userInfo.isRegistered && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {userInfo.balance === 0 
                        ? 'User has no tokens to transfer'
                        : userInfo.allowance < userInfo.balance
                        ? 'Insufficient allowance for transfer'
                        : 'Transfer conditions not met'
                      }
                    </Alert>
                  )}

                  {!userInfo.isRegistered && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      User is not registered in the whitelist
                    </Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Transfer Action */}
        {userInfo && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transfer Action
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleTransfer}
                    disabled={loading || !userInfo.canTransfer || !walletConnected || !isOwner}
                    startIcon={loading ? <CircularProgress size={20} /> : <MoneyRecive />}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? 'Processing...' : `Transfer ${userInfo.balance.toFixed(4)} RBM`}
                  </Button>
                </Box>

                <Box textAlign="center" sx={{ mt: 2 }}>
                  {!walletConnected && (
                    <Typography variant="body2" color="textSecondary">
                      Connect wallet to enable transfers
                    </Typography>
                  )}
                  {walletConnected && !isOwner && (
                    <Typography variant="body2" color="error">
                      Only contract owner can execute transfers
                    </Typography>
                  )}
                  {walletConnected && isOwner && !userInfo.canTransfer && (
                    <Typography variant="body2" color="textSecondary">
                      Transfer conditions not met for this user
                    </Typography>
                  )}
                  {walletConnected && isOwner && userInfo.canTransfer && (
                    <Typography variant="body2" color="success.main">
                      Ready to transfer - All conditions met ✅
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SingleTransfer;
