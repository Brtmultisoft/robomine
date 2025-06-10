import React from 'react';
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  Stack,
  Avatar,
  Skeleton
} from '@mui/material';
import { Token } from '@mui/icons-material';
import { GlassCard } from './StyledComponents';

const LoadingState = ({ message = 'Initializing contract...' }) => {
  return (
    <GlassCard sx={{ p: 6, textAlign: 'center', mb: 4 }}>
      <Stack spacing={3} alignItems="center">
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
          <Token sx={{ fontSize: 40 }} />
        </Avatar>
        
        <CircularProgress size={60} thickness={4} />
        
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Loading RBM Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>

        {/* Loading skeleton for stats */}
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            {[...Array(3)].map((_, index) => (
              <Card key={index} sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
              </Card>
            ))}
          </Stack>
        </Box>
      </Stack>
    </GlassCard>
  );
};

export default LoadingState;
