import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import {
  Wallet,
  SecuritySafe,
  MoneyAdd,
  Refresh2
} from 'iconsax-react';
import { adminApi } from '../../services/adminApi';
import { ethers } from 'ethers';

const SecureMinting = () => {
  const [mintingData, setMintingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintingInProgress, setMintingInProgress] = useState(false);
  const [mintingResults, setMintingResults] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [batchDetailsDialog, setBatchDetailsDialog] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState(null);
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(null);

  // Contract details
  const CONTRACT_ADDRESS = "0xDfDeDd944e6A98703314f79B3F67E07B8eEa4093";
  const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address[]","name":"_users","type":"address[]"},{"internalType":"uint256[]","name":"_amount","type":"uint256[]"}],"name":"RBMminting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserDetails","outputs":[{"internalType":"uint256","name":"amountReceived","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lastMintTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lastMintedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uniqueAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniqueCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"bool","name":"isExist","type":"bool"},{"internalType":"uint256","name":"amountReceived","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"}],"stateMutability":"view","type":"function"}];
  

  useEffect(() => {
    console.log('🎯 SecureMinting component mounted');
    console.log('🔗 AdminApi baseURL:', adminApi.defaults.baseURL);
    console.log('🌍 Environment check:', {
      VITE_APP_TEST: import.meta.env.VITE_APP_TEST,
      VITE_APP_TEST_API_URL: import.meta.env.VITE_APP_TEST_API_URL,
      VITE_APP_PROD_API_URL: import.meta.env.VITE_APP_PROD_API_URL
    });

    checkWalletConnection();
    // Test API connectivity first
    testApiConnection();
    fetchMintingData();
  }, []);

  const testApiConnection = async () => {
    try {
      console.log('🧪 Testing API connection...');
      console.log('🔗 Admin API Base URL:', adminApi.defaults.baseURL);

      // Test basic connectivity
      const response = await fetch(adminApi.defaults.baseURL.replace('/admin/', '/health'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('🏥 Health check response:', response.status);

    } catch (error) {
      console.error('❌ API connection test failed:', error);
    }
  };

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      showAlert('error', 'MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0]);
        showAlert('success', 'Wallet connected successfully!');
      }
    } catch (error) {
      showAlert('error', 'Failed to connect wallet: ' + error.message);
    }
  };

  const fetchMintingData = async () => {
    setLoading(true);
    try {
      console.log('🚀 Fetching minting data from:', adminApi.defaults.baseURL + 'minting/prepare-minting');
      const response = await adminApi.get('/minting/prepare-minting');
      console.log('✅ Minting data response:', response.data);
      console.log('🔍 Response structure:', {
        status: response.data.status,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : 'No data object',
        directKeys: Object.keys(response.data)
      });

      if (response.data.status) {
        // Try multiple possible data structures
        const mintingInfo = response.data.result || response.data.data || response.data;
        console.log('📊 Extracted minting info:', mintingInfo);
        setMintingData(mintingInfo);
        showAlert('success', `Minting data loaded: ${mintingInfo.totalUsers || 0} users, ${mintingInfo.batches?.length || 0} batches`);
      } else {
        showAlert('error', 'Server returned error status');
      }
    } catch (error) {
      console.error('❌ Minting data fetch error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      showAlert('error', 'Failed to fetch minting data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const executeMinting = async () => {
    if (!walletConnected) {
      showAlert('error', 'Please connect your wallet first');
      return;
    }

    if (!mintingData || !mintingData.batches || mintingData.batches.length === 0) {
      showAlert('error', 'No minting data available');
      return;
    }

    console.log('🚀 Starting minting process...');
    console.log('📊 Minting data:', mintingData);
    console.log('🔗 Contract address:', CONTRACT_ADDRESS);

    setMintingInProgress(true);
    setCurrentBatch(0);
    setTotalBatches(mintingData.batches.length);

    try {
      // Check if MetaMask is available
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      console.log('🔗 Connecting to MetaMask...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      console.log('✅ Connected to wallet:', signerAddress);

      // Check network
      const network = await provider.getNetwork();
      console.log('🌐 Network:', network.name, 'Chain ID:', network.chainId);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log('📄 Contract instance created');

      const results = [];
      let totalProcessed = 0;

      for (let i = 0; i < mintingData.batches.length; i++) {
        setCurrentBatch(i + 1);
        const batch = mintingData.batches[i];

        console.log(`\n🔄 Processing batch ${i + 1}/${mintingData.batches.length}`);
        console.log('👥 Batch users:', batch.length);

        try {
          showAlert('info', `Processing batch ${i + 1}/${mintingData.batches.length}... Please approve in MetaMask`);

          // Prepare addresses and amounts
          const addresses = batch.map(item => item.username);
          const amounts = batch.map(item => {
            const amount = ethers.parseUnits(item.amount.toString(), 18);
            console.log(`💰 ${item.username}: ${item.amount} tokens (${amount.toString()} wei)`);
            return amount;
          });

          console.log('📝 Prepared transaction data:', {
            addresses: addresses.length,
            amounts: amounts.length,
            totalAmount: batch.reduce((sum, item) => sum + item.amount, 0)
          });

          // Execute minting transaction
          console.log('📤 Sending transaction to blockchain...');
          const tx = await contract.RBMminting(addresses, amounts);
          console.log('✅ Transaction sent:', tx.hash);

          showAlert('info', `Transaction sent: ${tx.hash}. Waiting for confirmation...`);

          // Wait for transaction confirmation
          console.log('⏳ Waiting for transaction confirmation...');
          const receipt = await tx.wait();
          console.log('📋 Transaction receipt:', receipt);

          if (receipt.status === 1) {
            console.log('✅ Transaction confirmed successfully');

            // Transaction successful - notify server
            console.log('📡 Notifying server of successful batch...');
            await adminApi.post('/minting/confirm-batch', {
              batchIndex: i,
              transactionHash: receipt.hash,
              userIds: batch.map(item => item.userId)
            });

            results.push({
              batchIndex: i + 1,
              success: true,
              transactionHash: receipt.hash,
              usersCount: batch.length
            });

            totalProcessed += batch.length;
            showAlert('success', `Batch ${i + 1} completed! ${totalProcessed}/${mintingData.totalUsers} users processed`);

          } else {
            console.error('❌ Transaction failed with status:', receipt.status);
            results.push({
              batchIndex: i + 1,
              success: false,
              error: 'Transaction failed',
              usersCount: batch.length
            });
            showAlert('error', `Batch ${i + 1} failed - transaction reverted`);
          }

        } catch (batchError) {
          console.error(`❌ Batch ${i + 1} error:`, batchError);

          let errorMessage = batchError.message;
          if (batchError.code === 'ACTION_REJECTED') {
            errorMessage = 'Transaction rejected by user';
          } else if (batchError.code === 'INSUFFICIENT_FUNDS') {
            errorMessage = 'Insufficient funds for gas';
          } else if (batchError.code === 'NETWORK_ERROR') {
            errorMessage = 'Network connection error';
          }

          results.push({
            batchIndex: i + 1,
            success: false,
            error: errorMessage,
            usersCount: batch.length
          });

          showAlert('error', `Batch ${i + 1} failed: ${errorMessage}`);

          // Ask user if they want to continue with remaining batches
          if (i < mintingData.batches.length - 1) {
            const continueProcessing = window.confirm(
              `Batch ${i + 1} failed. Do you want to continue with the remaining ${mintingData.batches.length - i - 1} batches?`
            );
            if (!continueProcessing) {
              console.log('🛑 User chose to stop processing');
              break;
            }
          }
        }

        // Small delay between batches to avoid overwhelming MetaMask
        if (i < mintingData.batches.length - 1) {
          console.log('⏸️ Waiting 3 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      setMintingResults(results);

      // Final summary
      const successfulBatches = results.filter(r => r.success).length;
      const totalSuccessfulUsers = results.filter(r => r.success).reduce((sum, r) => sum + r.usersCount, 0);

      console.log('🎉 Minting process completed!');
      console.log('📊 Final results:', {
        successfulBatches,
        totalBatches: results.length,
        successfulUsers: totalSuccessfulUsers,
        totalUsers: mintingData.totalUsers
      });

      showAlert('success',
        `Minting completed! ${successfulBatches}/${results.length} batches successful. ` +
        `${totalSuccessfulUsers}/${mintingData.totalUsers} users processed.`
      );

      // Refresh minting data to show updated state
      console.log('🔄 Refreshing minting data...');
      await fetchMintingData();

    } catch (error) {
      console.error('💥 Minting process failed:', error);

      let errorMessage = error.message;
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'MetaMask transaction was rejected';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient ETH for gas fees';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network connection failed';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }

      showAlert('error', `Minting failed: ${errorMessage}`);
    } finally {
      setMintingInProgress(false);
      setCurrentBatch(0);
      setTotalBatches(0);
      console.log('🏁 Minting process ended');
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: 'success', message: '' }), 5000);
  };

  const handleViewBatchDetails = (batch, index) => {
    console.log('📋 Viewing batch details:', { batchIndex: index + 1, users: batch.length });
    setSelectedBatchData(batch);
    setSelectedBatchIndex(index + 1);
    setBatchDetailsDialog(true);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Secure Token Minting
      </Typography>

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Wallet Connection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Wallet size={24} />
                <Box>
                  <Typography variant="h6">
                    Wallet Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {walletConnected ? `Connected: ${walletAddress}` : 'Not connected'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {!walletConnected ? (
                  <Button
                    variant="contained"
                    onClick={connectWallet}
                    startIcon={<Wallet />}
                  >
                    Connect MetaMask
                  </Button>
                ) : (
                  <Chip label="Connected" color="success" />
                )}
                <Button
                  variant="outlined"
                  onClick={fetchMintingData}
                  startIcon={<Refresh2 />}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Minting Progress */}
      {mintingInProgress && (
        <Card sx={{ mb: 3, bgcolor: 'warning.light' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Secure Minting in Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Processing batch {currentBatch} of {totalBatches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please approve each transaction in MetaMask when prompted
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(currentBatch / totalBatches) * 100}
                sx={{ mt: 2, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                Progress: {Math.round((currentBatch / totalBatches) * 100)}%
              </Typography>
            </Box>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                🔐 <strong>Important:</strong> Do not close this page or navigate away during minting.
                Each batch requires MetaMask approval.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Minting Results */}
      {mintingResults && mintingResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Minting Results
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Batch</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Transaction Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mintingResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.batchIndex}</TableCell>
                      <TableCell>{result.usersCount}</TableCell>
                      <TableCell>
                        <Chip
                          label={result.success ? 'Success' : 'Failed'}
                          color={result.success ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {result.success ? (
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {result.transactionHash?.substring(0, 20)}...
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="error">
                            {result.error}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
    

      {/* Minting Data */}
      {loading ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading minting data...
            </Typography>
          </CardContent>
        </Card>
      ) : mintingData ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Minting Summary
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setConfirmDialog(true)}
                disabled={!walletConnected || mintingInProgress || !mintingData.batches?.length}
                startIcon={<MoneyAdd />}
              >
                Start Secure Minting
              </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {mintingData.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2">Total Users</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {formatAmount(mintingData.totalAmount || 0)}
                  </Typography>
                  <Typography variant="body2">Total Tokens</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {mintingData.batches?.length || 0}
                  </Typography>
                  <Typography variant="body2">Batches</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {mintingData.totalTransactions || 0}
                  </Typography>
                  <Typography variant="body2">Transactions</Typography>
                </Box>
              </Grid>
            </Grid>

            {mintingData.batches && mintingData.batches.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mintingData.batches.map((batch, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => handleViewBatchDetails(batch, index)}
                            sx={{ fontWeight: 'bold', minWidth: 'auto', p: 1 }}
                          >
                            #{index + 1}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${batch.length} users`}
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatAmount(batch.reduce((sum, item) => sum + item.amount, 0))} tokens
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Ready"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewBatchDetails(batch, index)}
                            startIcon={<SecuritySafe size={16} />}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No users eligible for minting
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecuritySafe size={24} />
            Confirm Secure Minting
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>🔐 Secure Blockchain Minting Process</strong><br/>
              You are about to execute real blockchain transactions using MetaMask.
              Your private keys never leave your wallet.
            </Typography>
          </Alert>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>📊 Minting Summary:</strong>
          </Typography>
          <Typography variant="body2">
            • <strong>Total Users:</strong> {mintingData?.totalUsers || 0}
          </Typography>
          <Typography variant="body2">
            • <strong>Total Tokens:</strong> {formatAmount(mintingData?.totalAmount || 0)}
          </Typography>
          <Typography variant="body2">
            • <strong>Batches:</strong> {mintingData?.batches?.length || 0}
          </Typography>
          <Typography variant="body2">
            • <strong>Contract:</strong> {CONTRACT_ADDRESS}
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>⚠️ Important Instructions:</strong><br/>
              • Each batch requires MetaMask approval ({mintingData?.batches?.length || 0} approvals total)<br/>
              • Do NOT close this page during minting<br/>
              • Do NOT logout during the process<br/>
              • Ensure you have enough ETH for gas fees<br/>
              • Process will take approximately {Math.ceil((mintingData?.batches?.length || 0) * 0.5)} minutes
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setConfirmDialog(false);
              executeMinting();
            }} 
            variant="contained" 
            color="primary"
          >
            Start Minting
          </Button>
        </DialogActions>
      </Dialog>

      {/* Batch Details Dialog */}
      <Dialog
        open={batchDetailsDialog}
        onClose={() => setBatchDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecuritySafe size={24} />
            Batch #{selectedBatchIndex} Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBatchData && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Batch Summary:</strong> {selectedBatchData.length} users will receive a total of{' '}
                  {formatAmount(selectedBatchData.reduce((sum, item) => sum + item.amount, 0))} tokens
                </Typography>
              </Alert>

              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>User Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Token Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Wei Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBatchData.map((user, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.85rem',
                              wordBreak: 'break-all'
                            }}
                          >
                            {user.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {formatAmount(user.amount)} tokens
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              color: 'text.secondary'
                            }}
                          >
                            {user.amount}000000000000000000
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBatchDetailsDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setBatchDetailsDialog(false);
              setConfirmDialog(true);
            }}
            startIcon={<MoneyAdd size={16} />}
          >
            Proceed to Mint All Batches
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecureMinting;
