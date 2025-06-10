import React from 'react';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Pagination,
  Skeleton
} from '@mui/material';
import { TableSkeleton } from './SkeletonLoaders';
import {
  People,
  Refresh,
  Search,
  Clear,
  ContentCopy,
  OpenInNew
} from '@mui/icons-material';

const RegisteredUsers = ({
  stats,
  statsLoading,
  refreshStats,
  searchTerm,
  setSearchTerm,
  clearSearch,
  filteredUsers,
  paginationData,
  currentPage,
  setCurrentPage,
  copyToClipboard
}) => {
  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ bgcolor: 'info.main' }}>
          <People />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Registered Users
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View all whitelisted addresses ({stats.totalRegistered} total)
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshStats}
          disabled={statsLoading}
          size="small"
        >
          {statsLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Stack>

      {/* Search Bar */}
      <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search addresses... (e.g., 0x123... or 123)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        {searchTerm && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Found {filteredUsers.length} address{filteredUsers.length !== 1 ? 'es' : ''} matching "{searchTerm}"
          </Typography>
        )}
      </Card>

      {statsLoading ? (
        <TableSkeleton rows={8} />
      ) : stats.registeredUsers.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'grey.300' }}>
            <People sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Registered Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No addresses have been whitelisted yet.
          </Typography>
        </Paper>
      ) : filteredUsers.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'warning.main' }}>
            <Search sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Results Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No addresses match your search term "{searchTerm}".
          </Typography>
          <Button
            variant="outlined"
            onClick={clearSearch}
            sx={{ mt: 2 }}
            startIcon={<Clear />}
          >
            Clear Search
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Wallet Address</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginationData.currentUsers.map((address, index) => (
                  <TableRow
                    key={address}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:nth-of-type(odd)': { bgcolor: 'action.selected' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {paginationData.indexOfFirstUser + index + 1}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
                          {address.slice(2, 4).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {address}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Copy Address">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(address)}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' }
                            }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View on BSCScan">
                          <IconButton
                            size="small"
                            onClick={() => window.open(`https://bscscan.com/address/${address}`, '_blank')}
                            sx={{
                              bgcolor: 'secondary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'secondary.dark' }
                            }}
                          >
                            <OpenInNew fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {paginationData.totalPages > 1 && (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {paginationData.indexOfFirstUser + 1}-{Math.min(paginationData.indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} {searchTerm ? 'filtered' : 'total'} users
              </Typography>
              <Pagination
                count={paginationData.totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Stack>
          )}

          {/* Results Summary */}
          {filteredUsers.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {searchTerm ? (
                  <>
                    Showing {filteredUsers.length} of {stats.totalRegistered} addresses matching "{searchTerm}"
                  </>
                ) : (
                  <>
                    Total registered addresses: {stats.totalRegistered}
                  </>
                )}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RegisteredUsers;
