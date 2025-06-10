import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
  Skeleton
} from '@mui/material';
import { Analytics } from '@mui/icons-material';

const ContractQueries = ({
  queryAddress,
  setQueryAddress,
  queryLoading,
  queryResults,
  handleQuery,
  clearQueryResults,
  loading = false
}) => {

  if (loading) {
    return (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={200} height={28} />
            <Skeleton variant="text" width="70%" height={20} />
          </Box>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Skeleton variant="rectangular" width={140} height={32} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={130} height={32} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 1 }} />
                </Stack>
                <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3, minHeight: 200 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width={120} height={24} />
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Skeleton variant="text" width="80%" height={16} sx={{ mx: 'auto' }} />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: 'info.main' }}>
          <Analytics />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Contract Queries
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Query contract data for any address (Read-only operations)
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Address Query
            </Typography>
            <TextField
              fullWidth
              label="Address to Query"
              value={queryAddress}
              onChange={(e) => setQueryAddress(e.target.value)}
              placeholder="0x8ABBbb4fa1385602133F2b5F4c2201f018726db3"
              sx={{ mb: 3 }}
              helperText="Enter a valid Ethereum address (0x...)"
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleQuery('registration')}
                disabled={queryLoading}
                startIcon={queryLoading ? <CircularProgress size={16} /> : null}
              >
                Check Registration
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleQuery('allowance')}
                disabled={queryLoading}
                startIcon={queryLoading ? <CircularProgress size={16} /> : null}
              >
                Check Allowance
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleQuery('balance')}
                disabled={queryLoading}
                startIcon={queryLoading ? <CircularProgress size={16} /> : null}
              >
                Check Balance
              </Button>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={clearQueryResults}
              fullWidth
              disabled={queryLoading}
            >
              Clear Results
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 3, minHeight: 200 }}>
            <Typography variant="h6" gutterBottom>
              Query Results
            </Typography>

            {queryLoading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 100 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Querying contract...
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                </Stack>
              </Box>
            )}

            {!queryLoading && (
              <>
                {queryResults.isRegistered !== null && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Registration Status:
                    </Typography>
                    <Chip
                      label={queryResults.isRegistered ? '✅ Registered' : '❌ Not Registered'}
                      color={queryResults.isRegistered ? 'success' : 'error'}
                      size="medium"
                    />
                  </Box>
                )}

                {queryResults.allowance !== null && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Allowance:
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {queryResults.allowance} RBM
                    </Typography>
                  </Box>
                )}

                {queryResults.balance !== null && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Balance:
                    </Typography>
                    <Typography variant="h6" color="secondary.main">
                      {queryResults.balance} RBM
                    </Typography>
                  </Box>
                )}

                {queryResults.isRegistered === null &&
                 queryResults.allowance === null &&
                 queryResults.balance === null && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Enter an address and click a query button to see results
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractQueries;
