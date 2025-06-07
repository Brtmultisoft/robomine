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
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { Profile2User, Refresh2, SearchNormal, Copy, Link } from 'iconsax-react';
import rbmWhitelistService from '../../../services/rbmWhitelistService';

const RegisteredUsers = () => {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadUsersData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm) {
      const filtered = usersData.filter(user => 
        user.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(usersData);
    }
  }, [searchTerm, usersData]);

  const loadUsersData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const registeredAddresses = await rbmWhitelistService.getAllRegistered();
      
      // Get detailed info for each user
      const usersWithDetails = await Promise.all(
        registeredAddresses.map(async (address, index) => {
          try {
            const [balance, allowance] = await Promise.all([
              rbmWhitelistService.checkBalance(address),
              rbmWhitelistService.checkAllowance(address)
            ]);
            
            const balanceNum = parseFloat(balance);
            const allowanceNum = parseFloat(allowance);
            const canTransfer = allowanceNum >= balanceNum && balanceNum > 0;
            
            return {
              id: index + 1,
              address,
              balance: balanceNum,
              allowance: allowanceNum,
              canTransfer,
              extractable: canTransfer ? balanceNum : 0
            };
          } catch (err) {
            return {
              id: index + 1,
              address,
              balance: 0,
              allowance: 0,
              canTransfer: false,
              extractable: 0,
              error: err.message
            };
          }
        })
      );
      
      setUsersData(usersWithDetails);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError('Failed to load users data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openBSCScan = (address) => {
    window.open(rbmWhitelistService.getBSCScanLink(address), '_blank');
  };

  const getTotalStats = () => {
    const totalUsers = usersData.length;
    const transferableUsers = usersData.filter(user => user.canTransfer).length;
    const totalExtractable = usersData.reduce((sum, user) => sum + user.extractable, 0);
    
    return { totalUsers, transferableUsers, totalExtractable };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const stats = getTotalStats();

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Registered Users
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View all users registered in the RBM WhiteList contract
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Registered
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Profile2User size={32} color="#1976d2" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Transferable
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.transferableUsers}
                  </Typography>
                </Box>
                <Profile2User size={32} color="#2e7d32" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Extractable
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.totalExtractable.toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    RBM Tokens
                  </Typography>
                </Box>
                <Profile2User size={32} color="#ed6c02" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={loadUsersData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Refresh2 />}
              >
                Refresh
              </Button>
            </Box>
          </Box>
          
          {lastUpdated && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Last updated: {lastUpdated}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registered Users ({filteredUsers.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Balance (RBM)</TableCell>
                  <TableCell align="right">Allowance (RBM)</TableCell>
                  <TableCell align="center">Transferable</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary" py={4}>
                        {searchTerm ? 'No users found matching your search' : 'No registered users found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
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
                          label={user.canTransfer ? 'Yes' : 'No'} 
                          color={user.canTransfer ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Button
                            size="small"
                            onClick={() => copyToClipboard(user.address)}
                            startIcon={<Copy size={16} />}
                          >
                            Copy
                          </Button>
                          <Button
                            size="small"
                            onClick={() => openBSCScan(user.address)}
                            startIcon={<Link size={16} />}
                          >
                            BSCScan
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisteredUsers;
