import React from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  Skeleton,
  Typography
} from '@mui/material';

// Enhanced skeleton with wave animation
export const EnhancedSkeleton = ({ variant, width, height, sx, ...props }) => (
  <Skeleton
    variant={variant}
    width={width}
    height={height}
    sx={{
      transform: 'scale(1)',
      borderRadius: variant === 'rectangular' ? 1 : undefined,
      '&::after': {
        animationDuration: '1.8s',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
      },
      ...sx
    }}
    {...props}
  />
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5 }) => (
  <Card variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
    {/* Header */}
    <Box sx={{ bgcolor: 'action.hover', p: 2 }}>
      <Stack direction="row" spacing={2}>
        <EnhancedSkeleton variant="text" width={30} height={24} />
        <EnhancedSkeleton variant="text" width="50%" height={24} />
        <EnhancedSkeleton variant="text" width={100} height={24} />
      </Stack>
    </Box>
    
    {/* Rows */}
    <Stack spacing={0}>
      {[...Array(rows)].map((_, index) => (
        <Box 
          key={index} 
          sx={{ 
            p: 2, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: index % 2 === 0 ? 'background.paper' : 'action.hover'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <EnhancedSkeleton variant="text" width={20} height={20} />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <EnhancedSkeleton variant="circular" width={32} height={32} />
              <EnhancedSkeleton variant="text" width="70%" height={20} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <EnhancedSkeleton variant="circular" width={32} height={32} />
              <EnhancedSkeleton variant="circular" width={32} height={32} />
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
    
    {/* Pagination */}
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <EnhancedSkeleton variant="text" width={200} height={20} />
        <Stack direction="row" spacing={1}>
          {[...Array(5)].map((_, i) => (
            <EnhancedSkeleton key={i} variant="circular" width={32} height={32} />
          ))}
        </Stack>
      </Stack>
    </Box>
  </Card>
);

// Form skeleton loader
export const FormSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={6}>
      <Card variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <EnhancedSkeleton variant="text" width={150} height={24} />
          <EnhancedSkeleton variant="text" width="80%" height={16} />
          <EnhancedSkeleton variant="rectangular" height={56} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <EnhancedSkeleton variant="rectangular" width={140} height={32} />
            <EnhancedSkeleton variant="rectangular" width={130} height={32} />
            <EnhancedSkeleton variant="rectangular" width={120} height={32} />
          </Stack>
          <EnhancedSkeleton variant="rectangular" height={36} />
        </Stack>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card variant="outlined" sx={{ p: 3, minHeight: 200 }}>
        <Stack spacing={2}>
          <EnhancedSkeleton variant="text" width={120} height={24} />
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <EnhancedSkeleton variant="text" width="80%" height={16} sx={{ mx: 'auto' }} />
          </Box>
        </Stack>
      </Card>
    </Grid>
  </Grid>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <Card sx={{ p: 4, textAlign: 'center' }}>
    <Stack spacing={2} alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <EnhancedSkeleton variant="circular" width={40} height={40} />
        <EnhancedSkeleton variant="text" width={120} height={24} />
      </Stack>
      <EnhancedSkeleton variant="text" width={80} height={60} />
      <EnhancedSkeleton variant="text" width="70%" height={16} />
    </Stack>
  </Card>
);

// Tab skeleton loader
export const TabsSkeleton = () => (
  <>
    <Box sx={{
      borderBottom: 1,
      borderColor: 'divider',
      background: 'linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
      p: 2
    }}>
      <Stack direction="row" spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
            <EnhancedSkeleton variant="circular" width={24} height={24} />
            <EnhancedSkeleton variant="text" width={120} height={20} />
          </Box>
        ))}
      </Stack>
    </Box>
    <Box sx={{ p: 4 }}>
      <Stack spacing={3}>
        <EnhancedSkeleton variant="text" width={250} height={32} />
        <EnhancedSkeleton variant="text" width="70%" height={20} />
        <FormSkeleton />
      </Stack>
    </Box>
  </>
);

export default {
  EnhancedSkeleton,
  TableSkeleton,
  FormSkeleton,
  StatsCardSkeleton,
  TabsSkeleton
};
