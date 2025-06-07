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
import { UserRemove, SearchNormal, UserAdd } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';

const CheckRegistration = () => {
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [error, setError] = useState('');

  const checkRegistration = async () => {
    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const isRegistered = await rbmWhitelistService.checkIfRegistered(userAddress);
      
      setRegistrationData({
        address: userAddress,
        isRegistered,
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      setError('Failed to check registration: ' + err.message);
      setRegistrationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkRegistration();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Check Registration
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Check if a user address is registered in the whitelist
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
                helperText="Enter the Ethereum address to check registration status"
              />
              
              <Button
                variant="contained"
                onClick={checkRegistration}
                disabled={loading || !userAddress}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchNormal />}
                fullWidth
                size="large"
              >
                {loading ? 'Checking...' : 'Check Registration'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {!registrationData ? (
                <Box textAlign="center" py={4}>
                  <UserRemove size={64} color="#ccc" />
                  <Typography variant="body1" color="textSecondary" mt={2}>
                    Enter a user address and click "Check Registration" to see results
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Paper sx={{ p: 3, mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      User Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 3 }}>
                      {registrationData.address}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Registration Status
                      </Typography>
                      <Chip 
                        label={registrationData.isRegistered ? 'Registered' : 'Not Registered'} 
                        color={registrationData.isRegistered ? 'success' : 'error'} 
                        icon={registrationData.isRegistered ? <UserRemove size={16} /> : <UserAdd size={16} />}
                      />
                    </Box>
                    
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Checked At
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {registrationData.timestamp}
                    </Typography>
                  </Paper>

                  <Alert 
                    severity={registrationData.isRegistered ? "success" : "warning"}
                    sx={{ mb: 2 }}
                  >
                    {registrationData.isRegistered 
                      ? "This address is registered in the RBM WhiteList and can participate in token transfers"
                      : "This address is not registered in the RBM WhiteList"
                    }
                  </Alert>

                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(registrationData.address)}
                      size="small"
                    >
                      Copy Address
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => window.open(rbmWhitelistService.getBSCScanLink(registrationData.address), '_blank')}
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
                About Registration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                The RBM WhiteList contract maintains a registry of approved addresses that can participate in token operations. 
                Only registered addresses are eligible for token transfers and other contract interactions.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Registration Requirements:</strong>
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  Users must call the <code>whitlistAddress</code> function to register themselves
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Only the user themselves can register their own address (caller must be the same as the address being registered)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Once registered, the address is permanently added to the whitelist
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Registered addresses can have their tokens transferred by the contract owner
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Registration is a one-time process and cannot be undone. 
                  Make sure you understand the implications before registering an address.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckRegistration;
