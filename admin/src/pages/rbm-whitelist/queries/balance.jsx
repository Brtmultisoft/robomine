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
  Divider
} from '@mui/material';
import { Wallet3, SearchNormal, MoneyRecive } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';

const CheckBalance = () => {
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState('');

  const checkBalance = async () => {
    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const balance = await rbmWhitelistService.checkBalance(userAddress);
      
      setBalanceData({
        address: userAddress,
        balance: parseFloat(balance),
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      setError('Failed to check balance: ' + err.message);
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkBalance();
    }
  };

  const getBalanceStatus = (balance) => {
    if (balance === 0) return { severity: 'warning', message: 'No tokens available' };
    if (balance < 1) return { severity: 'info', message: 'Low token balance' };
    if (balance < 100) return { severity: 'success', message: 'Moderate token balance' };
    return { severity: 'success', message: 'High token balance' };
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Check Balance
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Check the RBM token balance for a specific user address
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
                onKeyPress={handleKeyPress}
                sx={{ mb: 3 }}
                helperText="Enter the Ethereum address to check RBM token balance"
              />
              
              <Button
                variant="contained"
                onClick={checkBalance}
                disabled={loading || !userAddress}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchNormal />}
                fullWidth
                size="large"
              >
                {loading ? 'Checking...' : 'Check Balance'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Token Balance
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {!balanceData ? (
                <Box textAlign="center" py={4}>
                  <MoneyRecive size={64} color="#ccc" />
                  <Typography variant="body1" color="textSecondary" mt={2}>
                    Enter a user address and click "Check Balance" to see results
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Paper sx={{ p: 3, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      User Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                      {balanceData.address}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      RBM Token Balance
                    </Typography>
                    <Box display="flex" alignItems="baseline" gap={1} mb={2}>
                      <Typography variant="h3" color="primary.main">
                        {balanceData.balance.toFixed(6)}
                      </Typography>
                      <Typography variant="h6" color="textSecondary">
                        RBM
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Checked At
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {balanceData.timestamp}
                    </Typography>
                  </Paper>

                  <Alert 
                    severity={getBalanceStatus(balanceData.balance).severity}
                    sx={{ mb: 2 }}
                  >
                    {getBalanceStatus(balanceData.balance).message}
                    {balanceData.balance > 0 && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        This user has {balanceData.balance.toFixed(6)} RBM tokens available
                      </Typography>
                    )}
                  </Alert>

                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(balanceData.address)}
                      size="small"
                    >
                      Copy Address
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(rbmWhitelistService.getBSCScanLink(balanceData.address), '_blank')}
                      size="small"
                    >
                      View on BSCScan
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Token Balance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                The token balance represents the amount of RBM tokens that a user currently holds in their wallet. 
                This balance can be transferred by the RBM WhiteList contract if the user has provided sufficient allowance.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Important Notes:</strong>
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  Balance is displayed in RBM tokens with 6 decimal places for precision
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Users must have both a balance and sufficient allowance for transfers to work
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Zero balance means no tokens are available for transfer from this address
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Balance can change due to transfers, trades, or other token operations
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> To enable transfers, users need to approve the contract to spend their tokens 
                  using the token's approve function. Check the allowance to see if transfers are possible.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckBalance;
