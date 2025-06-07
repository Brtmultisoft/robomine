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
  LinearProgress
} from '@mui/material';
import { MoneyRecive, Refresh2, TrendUp } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';

const TotalExtractable = () => {
  const [loading, setLoading] = useState(true);
  const [extractableData, setExtractableData] = useState(null);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadExtractableData();
  }, []);

  const loadExtractableData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [totalExtractable, totalRegistered] = await Promise.all([
        rbmWhitelistService.getTotalExtractableTokens(),
        rbmWhitelistService.getTotalRegistered()
      ]);
      
      setExtractableData({
        totalExtractable: parseFloat(totalExtractable),
        totalRegistered: parseInt(totalRegistered),
        averagePerUser: totalRegistered > 0 ? parseFloat(totalExtractable) / parseInt(totalRegistered) : 0
      });
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError('Failed to load extractable data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getExtractableStatus = (amount) => {
    if (amount === 0) return { severity: 'warning', message: 'No tokens available for extraction' };
    if (amount < 100) return { severity: 'info', message: 'Low extractable amount' };
    if (amount < 1000) return { severity: 'success', message: 'Moderate extractable amount' };
    return { severity: 'success', message: 'High extractable amount' };
  };

  if (loading) {
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
          Total Extractable Tokens
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View the total amount of RBM tokens available for extraction from all registered users
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Statistics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Extractable Token Summary
                </Typography>
                <Button
                  variant="outlined"
                  onClick={loadExtractableData}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Refresh2 />}
                >
                  Refresh
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {extractableData && (
                <Box>
                  <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                    <MoneyRecive size={48} color="#1976d2" />
                    <Typography variant="h2" color="primary.main" sx={{ my: 2 }}>
                      {extractableData.totalExtractable.toFixed(6)}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      RBM Tokens Available for Extraction
                    </Typography>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {extractableData.totalRegistered}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Registered Users
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {extractableData.averagePerUser.toFixed(4)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Average per User
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Alert 
                    severity={getExtractableStatus(extractableData.totalExtractable).severity}
                    sx={{ mt: 3 }}
                  >
                    {getExtractableStatus(extractableData.totalExtractable).message}
                  </Alert>

                  {lastUpdated && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                      Last updated: {lastUpdated}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  href="/rbm-whitelist/transfers/multi"
                  startIcon={<MoneyRecive />}
                  disabled={!extractableData || extractableData.totalExtractable === 0}
                >
                  Execute Multi Transfer
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  href="/rbm-whitelist/queries/registered-users"
                  startIcon={<TrendUp />}
                >
                  View Registered Users
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  href="/rbm-whitelist/dashboard"
                  startIcon={<TrendUp />}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Information Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Total Extractable Tokens
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                The total extractable tokens represent the sum of all RBM tokens that can be transferred from registered users 
                who have provided sufficient allowance to the contract. This calculation considers both the user's token balance 
                and their approved allowance.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Calculation Criteria:</strong>
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" paragraph>
                  User must be registered in the whitelist
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  User must have a positive token balance
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  User's allowance must be greater than or equal to their balance
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Only the extractable amount (minimum of balance and allowance) is counted
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> This value updates in real-time based on user balances and allowances. 
                  The actual extractable amount may change between viewing and executing transfers due to blockchain activity.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TotalExtractable;
