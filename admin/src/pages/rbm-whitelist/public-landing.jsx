import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  TextField,
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import publicRbmWhitelistService from '../../services/publicRbmWhitelistService';
import {
  ContentCopy,
  OpenInNew,
  Send,
  AccountBalanceWallet,
  People,
  Analytics,
  Settings,
  Refresh
} from '@mui/icons-material';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(4)
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatusCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50]
}));

const RBMWhitelistLanding = () => {
  // const address = useAddress(); // Temporarily disabled
  const [address, setAddress] = useState(''); // Mock address for now
  const [activeTab, setActiveTab] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [queryAddress, setQueryAddress] = useState('');
  const [userStatus, setUserStatus] = useState({
    isRegistered: false,
    allowance: '0',
    balance: '0',
    canTransfer: false
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Transfer states
  const [transferDialog, setTransferDialog] = useState(false);
  const [transferType, setTransferType] = useState('single');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [multiTransferList, setMultiTransferList] = useState([{ address: '', amount: '' }]);

  // Query results
  const [queryResults, setQueryResults] = useState({
    allowance: null,
    registration: null,
    balance: null,
    totalExtractable: null
  });

  // Users list
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalAllowance: '0',
    totalBalance: '0',
    activeTransfers: 0
  });

  // Check user status when address changes
  useEffect(() => {
    if (address) {
      setUserAddress(address);
      checkUserStatus(address);
    }
  }, [address]);

  const checkUserStatus = async (addr) => {
    if (!addr || !publicRbmWhitelistService.isValidAddress(addr)) {
      showSnackbar('Invalid address format', 'error');
      return;
    }

    setLoading(true);
    try {
      const status = await publicRbmWhitelistService.getUserStatus(addr);
      setUserStatus({
        isRegistered: status.isRegistered,
        allowance: status.allowance.toString(),
        balance: status.balance.toString(),
        canTransfer: status.canTransfer
      });
    } catch (error) {
      console.error('Error checking user status:', error);
      showSnackbar('Error checking user status: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWhitelist = async () => {
    if (!address) {
      showSnackbar('Please connect your wallet first', 'warning');
      return;
    }

    setLoading(true);
    try {
      await publicRbmWhitelistService.whitelistAddress(address);
      showSnackbar('Address whitelisted successfully!', 'success');
      // Refresh status
      setTimeout(() => checkUserStatus(address), 3000);
    } catch (error) {
      console.error('Whitelist error:', error);
      showSnackbar(`Whitelist failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAddress = async () => {
    if (!userAddress.trim()) {
      showSnackbar('Please enter a valid address', 'warning');
      return;
    }
    await checkUserStatus(userAddress.trim());
  };

  // Query functions
  const handleQueryAddress = async (type) => {
    if (!queryAddress.trim()) {
      showSnackbar('Please enter a valid address', 'warning');
      return;
    }

    setLoading(true);
    try {
      let result;
      switch (type) {
        case 'allowance':
          result = await publicRbmWhitelistService.checkAllowance(queryAddress);
          setQueryResults(prev => ({ ...prev, allowance: result }));
          break;
        case 'registration':
          result = await publicRbmWhitelistService.checkIfRegistered(queryAddress);
          setQueryResults(prev => ({ ...prev, registration: result }));
          break;
        case 'balance':
          result = await publicRbmWhitelistService.getBalance(queryAddress);
          setQueryResults(prev => ({ ...prev, balance: result }));
          break;
        default:
          break;
      }
      showSnackbar(`Query completed successfully`, 'success');
    } catch (error) {
      showSnackbar(`Query failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Transfer functions
  const handleTransfer = async () => {
    if (!address) {
      showSnackbar('Please connect your wallet first', 'warning');
      return;
    }

    if (transferType === 'single') {
      if (!transferTo.trim() || !transferAmount.trim()) {
        showSnackbar('Please fill all transfer fields', 'warning');
        return;
      }
    } else {
      const validTransfers = multiTransferList.filter(t => t.address.trim() && t.amount.trim());
      if (validTransfers.length === 0) {
        showSnackbar('Please add at least one valid transfer', 'warning');
        return;
      }
    }

    setLoading(true);
    try {
      // Mock transfer - In real implementation, this would call contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSnackbar('Transfer completed successfully!', 'success');
      setTransferDialog(false);
      // Refresh user status
      if (address) checkUserStatus(address);
    } catch (error) {
      showSnackbar(`Transfer failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load users list
  const loadUsersList = async () => {
    setUsersLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockUsers = Array.from({ length: 10 }, (_, i) => ({
        address: `0x${Math.random().toString(16).substring(2, 42)}`,
        isRegistered: Math.random() > 0.3,
        allowance: (Math.random() * 1000).toFixed(4),
        balance: (Math.random() * 500).toFixed(4),
        canTransfer: Math.random() > 0.4
      }));
      setUsersList(mockUsers);
    } catch (error) {
      showSnackbar('Failed to load users list', 'error');
    } finally {
      setUsersLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      // Mock API call - replace with actual API
      // setStats({
      //   totalRegistered: Math.floor(Math.random() * 10000),
      //   totalAllowance: (Math.random() * 1000000).toFixed(2),
      //   totalBalance: (Math.random() * 500000).toFixed(2),
      //   activeTransfers: Math.floor(Math.random() * 100)
      // });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    // loadStats();
    loadUsersList();
  }, []);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard!', 'success');
  };

  const addMultiTransfer = () => {
    setMultiTransferList([...multiTransferList, { address: '', amount: '' }]);
  };

  const removeMultiTransfer = (index) => {
    setMultiTransferList(multiTransferList.filter((_, i) => i !== index));
  };

  const updateMultiTransfer = (index, field, value) => {
    const updated = [...multiTransferList];
    updated[index][field] = value;
    setMultiTransferList(updated);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            RBM Whitelist Portal
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Secure your spot in the RBM ecosystem
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Join the exclusive RBM whitelist to access premium features and benefits. 
            Connect your wallet and get whitelisted in just a few clicks.
          </Typography>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Wallet Connection Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Connect Your Wallet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Connect your wallet to access all RBM whitelist features
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  // Mock wallet connection for demo
                  const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
                  setAddress(mockAddress);
                  showSnackbar('Wallet connected successfully!', 'success');
                }}
                sx={{ mb: 2 }}
              >
                {address ? 'Wallet Connected' : 'Connect Wallet (Demo)'}
              </Button>
              {address && (
                <Box sx={{ mt: 3 }}>
                  <Chip
                    label={`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`}
                    color="success"
                    variant="outlined"
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(address)}
                    >
                      Copy Address
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenInNew />}
                      onClick={() => window.open(publicRbmWhitelistService.getBSCScanLink(address), '_blank')}
                    >
                      View on BSCScan
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Main Features Tabs */}
        <Card sx={{ mb: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Dashboard" icon={<Analytics />} />
              <Tab label="Queries" icon={<AccountBalanceWallet />} />
              <Tab label="Transfers" icon={<Send />} />
              <Tab label="Users" icon={<People />} />
              <Tab label="Settings" icon={<Settings />} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {/* Dashboard Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom textAlign="center">
                  RBM Whitelist Dashboard
                </Typography>

                {/* Quick Status Check */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                          Check Address Status
                        </Typography>
                        <TextField
                          fullWidth
                          label="Wallet Address"
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                          placeholder="0x..."
                          sx={{ mb: 3 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleCheckAddress}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
                        >
                          Check Status
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                          Whitelist Registration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Register your connected wallet to the whitelist
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleWhitelist}
                          disabled={loading || !address || userStatus.isRegistered}
                          startIcon={loading ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
                        >
                          {userStatus.isRegistered ? 'Already Whitelisted' : 'Whitelist My Address'}
                        </Button>
                        {!address && (
                          <Alert severity="info" sx={{ mt: 2 }}>
                            Connect your wallet to register
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Status Display */}
                {userAddress && (
                  <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12}>
                      <Typography variant="h5" gutterBottom textAlign="center">
                        Address Status Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatusCard>
                        <Typography variant="h6" gutterBottom>
                          Registration
                        </Typography>
                        <Chip
                          label={userStatus.isRegistered ? 'Registered' : 'Not Registered'}
                          color={userStatus.isRegistered ? 'success' : 'error'}
                          size="large"
                        />
                      </StatusCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatusCard>
                        <Typography variant="h6" gutterBottom>
                          Allowance
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {parseFloat(userStatus.allowance).toFixed(4)} RBM
                        </Typography>
                      </StatusCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatusCard>
                        <Typography variant="h6" gutterBottom>
                          Balance
                        </Typography>
                        <Typography variant="h4" color="secondary">
                          {parseFloat(userStatus.balance).toFixed(4)} RBM
                        </Typography>
                      </StatusCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <StatusCard>
                        <Typography variant="h6" gutterBottom>
                          Transfer Status
                        </Typography>
                        <Chip
                          label={userStatus.canTransfer ? 'Can Transfer' : 'Cannot Transfer'}
                          color={userStatus.canTransfer ? 'success' : 'warning'}
                          size="large"
                        />
                      </StatusCard>
                    </Grid>
                  </Grid>
                )}

                {/* Statistics */}
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom textAlign="center">
                      Global Statistics
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StatusCard>
                      <Typography variant="h6" gutterBottom>
                        Total Registered
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {stats.totalRegistered.toLocaleString()}
                      </Typography>
                    </StatusCard>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StatusCard>
                      <Typography variant="h6" gutterBottom>
                        Total Allowance
                      </Typography>
                      <Typography variant="h4" color="secondary">
                        {parseFloat(stats.totalAllowance).toLocaleString()} RBM
                      </Typography>
                    </StatusCard>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StatusCard>
                      <Typography variant="h6" gutterBottom>
                        Total Balance
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {parseFloat(stats.totalBalance).toLocaleString()} RBM
                      </Typography>
                    </StatusCard>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StatusCard>
                      <Typography variant="h6" gutterBottom>
                        Active Transfers
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {stats.activeTransfers}
                      </Typography>
                    </StatusCard>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Queries Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h4" gutterBottom textAlign="center">
                  Query Tools
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                  Check allowances, balances, registration status and extractable tokens
                </Typography>

                {/* Query Input */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                          Enter Address to Query
                        </Typography>
                        <TextField
                          fullWidth
                          label="Wallet Address"
                          value={queryAddress}
                          onChange={(e) => setQueryAddress(e.target.value)}
                          placeholder="0x..."
                          sx={{ mb: 3 }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleQueryAddress('allowance')}
                              disabled={loading}
                            >
                              Check Allowance
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleQueryAddress('registration')}
                              disabled={loading}
                            >
                              Check Registration
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => handleQueryAddress('balance')}
                              disabled={loading}
                            >
                              Check Balance
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button
                              variant="outlined"
                              fullWidth
                              onClick={() => setQueryResults(prev => ({ ...prev, totalExtractable: (Math.random() * 10000).toFixed(2) }))}
                            >
                              Total Extractable
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Query Results */}
                <Grid container spacing={4}>
                  {queryResults.allowance !== null && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom color="primary">
                            Allowance Result
                          </Typography>
                          <Typography variant="h4" gutterBottom>
                            {parseFloat(queryResults.allowance).toFixed(4)} RBM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {publicRbmWhitelistService.formatAddress(queryAddress)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {queryResults.registration !== null && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom color="primary">
                            Registration Result
                          </Typography>
                          <Chip
                            label={queryResults.registration ? 'Registered' : 'Not Registered'}
                            color={queryResults.registration ? 'success' : 'error'}
                            size="large"
                            sx={{ mb: 2 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Address: {publicRbmWhitelistService.formatAddress(queryAddress)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {queryResults.balance !== null && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom color="primary">
                            Balance Result
                          </Typography>
                          <Typography variant="h4" gutterBottom>
                            {parseFloat(queryResults.balance).toFixed(4)} RBM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Address: {publicRbmWhitelistService.formatAddress(queryAddress)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {queryResults.totalExtractable !== null && (
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom color="primary">
                            Total Extractable
                          </Typography>
                          <Typography variant="h4" gutterBottom>
                            {parseFloat(queryResults.totalExtractable).toLocaleString()} RBM
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Across all registered users
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Transfers Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h4" gutterBottom textAlign="center">
                  Transfer Management
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                  Transfer RBM tokens to single or multiple recipients
                </Typography>

                {/* Transfer Options */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom color="primary">
                          Single Transfer
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Transfer RBM tokens to a single recipient address
                        </Typography>
                        <Alert severity={userStatus.canTransfer ? 'success' : 'warning'} sx={{ mb: 2 }}>
                          {userStatus.canTransfer ? 'Transfer Available' : 'Transfer Not Available - Check allowance'}
                        </Alert>
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!userStatus.canTransfer || !address}
                          onClick={() => {
                            setTransferType('single');
                            setTransferDialog(true);
                          }}
                          startIcon={<Send />}
                        >
                          Single Transfer
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom color="primary">
                          Multi Transfer
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                          Transfer RBM tokens to multiple recipients in one transaction
                        </Typography>
                        <Alert severity={userStatus.canTransfer ? 'success' : 'warning'} sx={{ mb: 2 }}>
                          {userStatus.canTransfer ? 'Multi-Transfer Available' : 'Multi-Transfer Not Available'}
                        </Alert>
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!userStatus.canTransfer || !address}
                          onClick={() => {
                            setTransferType('multi');
                            setTransferDialog(true);
                          }}
                          startIcon={<Send />}
                        >
                          Multi Transfer
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Transfer Status */}
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom textAlign="center">
                          Transfer Requirements
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" gutterBottom color="primary">
                                Wallet Connected
                              </Typography>
                              <Chip
                                label={address ? 'Connected' : 'Not Connected'}
                                color={address ? 'success' : 'error'}
                                size="large"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" gutterBottom color="primary">
                                Whitelist Status
                              </Typography>
                              <Chip
                                label={userStatus.isRegistered ? 'Registered' : 'Not Registered'}
                                color={userStatus.isRegistered ? 'success' : 'error'}
                                size="large"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" gutterBottom color="primary">
                                Transfer Allowance
                              </Typography>
                              <Typography variant="h6">
                                {parseFloat(userStatus.allowance).toFixed(4)} RBM
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Users Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h4" gutterBottom textAlign="center">
                  Registered Users
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                  Browse all registered users and their whitelist information
                </Typography>

                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Total Users: {usersList.length}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={loadUsersList}
                    disabled={usersLoading}
                    startIcon={usersLoading ? <CircularProgress size={20} /> : <Refresh />}
                  >
                    Refresh
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell align="center">Registered</TableCell>
                        <TableCell align="right">Allowance</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="center">Can Transfer</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : (
                        usersList.map((user, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ fontFamily: 'monospace' }}>
                              {publicRbmWhitelistService.formatAddress(user.address)}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={user.isRegistered ? 'Yes' : 'No'}
                                color={user.isRegistered ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {parseFloat(user.allowance).toFixed(4)} RBM
                            </TableCell>
                            <TableCell align="right">
                              {parseFloat(user.balance).toFixed(4)} RBM
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={user.canTransfer ? 'Yes' : 'No'}
                                color={user.canTransfer ? 'success' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" gap={1} justifyContent="center">
                                <Tooltip title="Copy Address">
                                  <IconButton
                                    size="small"
                                    onClick={() => copyToClipboard(user.address)}
                                  >
                                    <ContentCopy fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View on BSCScan">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(publicRbmWhitelistService.getBSCScanLink(user.address), '_blank')}
                                  >
                                    <OpenInNew fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Settings Tab */}
            {activeTab === 4 && (
              <Box>
                <Typography variant="h4" gutterBottom textAlign="center">
                  Contract Settings & Information
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                  View contract information and network details
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                          Contract Information
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Contract Address
                          </Typography>
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2, wordBreak: 'break-all' }}>
                            {publicRbmWhitelistService.getContractInfo().address}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Network
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {publicRbmWhitelistService.getContractInfo().network}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Chain ID
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 3 }}>
                            {publicRbmWhitelistService.getContractInfo().chainId}
                          </Typography>

                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<OpenInNew />}
                            onClick={() => window.open(publicRbmWhitelistService.getContractInfo().contractLink, '_blank')}
                          >
                            View Contract on BSCScan
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                          Supported Features
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                          {[
                            'Check Registration Status',
                            'Check Token Allowance',
                            'Check Token Balance',
                            'Whitelist Address Registration',
                            'Single Token Transfer',
                            'Multi Token Transfer',
                            'View Total Extractable',
                            'Browse Registered Users'
                          ].map((feature, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Chip label="✓" color="success" size="small" sx={{ mr: 2, minWidth: 'auto' }} />
                              <Typography variant="body2">{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>

        {/* Transfer Dialog */}
        <Dialog open={transferDialog} onClose={() => setTransferDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {transferType === 'single' ? 'Single Transfer' : 'Multi Transfer'}
          </DialogTitle>
          <DialogContent>
            {transferType === 'single' ? (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Recipient Address"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="0x..."
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Amount (RBM)"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  type="number"
                  placeholder="0.0"
                />
              </Box>
            ) : (
              <Box sx={{ pt: 2 }}>
                {multiTransferList.map((transfer, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Transfer #{index + 1}</Typography>
                      {multiTransferList.length > 1 && (
                        <Button
                          color="error"
                          size="small"
                          onClick={() => removeMultiTransfer(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                    <TextField
                      fullWidth
                      label="Recipient Address"
                      value={transfer.address}
                      onChange={(e) => updateMultiTransfer(index, 'address', e.target.value)}
                      placeholder="0x..."
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Amount (RBM)"
                      value={transfer.amount}
                      onChange={(e) => updateMultiTransfer(index, 'amount', e.target.value)}
                      type="number"
                      placeholder="0.0"
                    />
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={addMultiTransfer}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Add Another Transfer
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleTransfer}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Execute Transfer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RBMWhitelistLanding;
