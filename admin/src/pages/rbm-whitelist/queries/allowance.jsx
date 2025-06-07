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
import { Wallet3, SearchNormal } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';

const CheckAllowance = () => {
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [allowanceData, setAllowanceData] = useState(null);
  const [error, setError] = useState('');

  const checkAllowance = async () => {
    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const allowance = await rbmWhitelistService.checkAllowance(userAddress);
      
      setAllowanceData({
        address: userAddress,
        allowance: parseFloat(allowance),
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      setError('Failed to check allowance: ' + err.message);
      setAllowanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkAllowance();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Check Allowance
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Check the token allowance for a specific user address
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
                helperText="Enter the Ethereum address to check allowance for"
              />
              
              <Button
                variant="contained"
                onClick={checkAllowance}
                disabled={loading || !userAddress}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchNormal />}
                fullWidth
                size="large"
              >
                {loading ? 'Checking...' : 'Check Allowance'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allowance Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {!allowanceData ? (
                <Box textAlign="center" py={4}>
                  <Wallet3 size={64} color="#ccc" />
                  <Typography variant="body1" color="textSecondary" mt={2}>
                    Enter a user address and click "Check Allowance" to see results
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Paper sx={{ p: 3, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      User Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                      {allowanceData.address}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Token Allowance
                    </Typography>
                    <Typography variant="h4" color="primary.main" gutterBottom>
                      {allowanceData.allowance.toFixed(6)} RBM
                    </Typography>
                    
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Checked At
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {allowanceData.timestamp}
                    </Typography>
                  </Paper>

                  <Alert 
                    severity={allowanceData.allowance > 0 ? "success" : "warning"}
                    sx={{ mb: 2 }}
                  >
                    {allowanceData.allowance > 0 
                      ? `User has approved ${allowanceData.allowance.toFixed(6)} RBM tokens for the contract`
                      : "User has not approved any tokens for the contract"
                    }
                  </Alert>

                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(allowanceData.address)}
                      size="small"
                    >
                      Copy Address
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(rbmWhitelistService.getBSCScanLink(allowanceData.address), '_blank')}
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
                About Token Allowance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                Token allowance is the amount of tokens that a user has approved the RBM WhiteList contract to spend on their behalf. 
                This is a security feature that allows users to control how many tokens the contract can access.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Key Points:</strong>
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  Users must approve tokens before they can be transferred by the contract
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  The allowance must be greater than or equal to the user's balance for transfers to work
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Users can increase or decrease their allowance at any time
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Zero allowance means the contract cannot transfer any tokens from that user
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckAllowance;
