import React from 'react';
import { Grid, Stack, Avatar, Typography, Button, Chip, Skeleton, CircularProgress, Box } from '@mui/material';
import { Group, TrendingUp, Verified, Security, Analytics, Refresh } from '@mui/icons-material';
import { StatusCard } from './StyledComponents';

const StatisticsCards = ({
  stats,
  statsLoading,
  loading,
  isOwner,
  refreshStats,
  contractError,
  isContractReady
}) => {
  return (
    <Grid container spacing={4} sx={{ mb: 6, position: 'relative' }}>
      {/* Auto-refresh indicator */}
      {statsLoading && !loading && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: 10,
            zIndex: 10,
            bgcolor: 'primary.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={12} color="inherit" />
          Auto-refreshing...
        </Box>
      )}

      <Grid item xs={12} md={3}>
        <StatusCard>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Group />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Total Registered
            </Typography>
          </Stack>
          {statsLoading || loading ? (
            <Skeleton
              variant="text"
              width={80}
              height={60}
              sx={{
                mx: 'auto',
                mb: 1,
                borderRadius: 1,
                transform: 'scale(1)',
                '&::after': {
                  animationDuration: '1.5s'
                }
              }}
            />
          ) : (
            <Typography variant="h2" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.totalRegistered}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Whitelisted addresses
          </Typography>
        </StatusCard>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <StatusCard>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <TrendingUp />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Total Extractable
            </Typography>
          </Stack>
          {statsLoading || loading ? (
            <Skeleton
              variant="text"
              width={100}
              height={60}
              sx={{
                mx: 'auto',
                mb: 1,
                borderRadius: 1,
                transform: 'scale(1)',
                '&::after': {
                  animationDuration: '1.5s'
                }
              }}
            />
          ) : (
            <Typography variant="h2" color="secondary.main" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.totalExtractable}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            RBM tokens available
          </Typography>
        </StatusCard>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <StatusCard>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: isOwner ? 'success.main' : 'grey.500' }}>
              {isOwner ? <Verified /> : <Security />}
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Your Status
            </Typography>
          </Stack>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={120}
              height={32}
              sx={{
                mx: 'auto',
                mb: 1,
                borderRadius: 2,
                transform: 'scale(1)',
                '&::after': {
                  animationDuration: '1.5s'
                }
              }}
            />
          ) : (
            <Chip
              label={isOwner ? '👑 Owner' : '👤 User'}
              color={isOwner ? 'success' : 'default'}
              size="large"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                py: 1,
                px: 2,
                mb: 1
              }}
            />
          )}
          <Typography variant="body2" color="text.secondary">
            {isOwner ? 'Full access to all features' : 'Read-only access'}
          </Typography>
        </StatusCard>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <StatusCard>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <Analytics />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              Actions
            </Typography>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            onClick={refreshStats}
            disabled={statsLoading || loading || !isContractReady}
            startIcon={statsLoading ? <CircularProgress size={20} /> : <Refresh />}
            sx={{ mb: 1 }}
            color={contractError ? 'error' : 'primary'}
          >
            {statsLoading ? 'Refreshing...' : contractError ? 'Contract Error' : 'Refresh Stats'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Update contract data
          </Typography>
        </StatusCard>
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;
