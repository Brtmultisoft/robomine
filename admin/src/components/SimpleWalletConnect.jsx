import React, { useState, useEffect } from 'react';
import { ConnectButton, useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { Box, Card, CardContent, Typography, Chip, Alert, Button } from '@mui/material';
import { client, bscChain, wallets } from '../lib/thirdweb';
import rbmWhitelistService from '../services/rbmWhitelistService';

const SimpleWalletConnect = () => {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const isConnected = !!activeAccount;
  const [isOwner, setIsOwner] = useState(false);
  const [checkingOwner, setCheckingOwner] = useState(false);

  const handleDisconnect = async () => {
    try {
      if (activeWallet) {
        await activeWallet.disconnect();
        setIsOwner(false);
        setCheckingOwner(false);
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  // Check if connected wallet is owner
  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (activeAccount?.address) {
        try {
          setCheckingOwner(true);
          const contractOwner = await rbmWhitelistService.getOwner();
          setIsOwner(activeAccount.address.toLowerCase() === contractOwner.toLowerCase());
        } catch (error) {
          console.error('Error checking owner status:', error);
          setIsOwner(false);
        } finally {
          setCheckingOwner(false);
        }
      } else {
        setIsOwner(false);
      }
    };

    checkOwnerStatus();
  }, [activeAccount]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Wallet Connection
            </Typography>
            {isConnected ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Chip
                    label={`${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}`}
                    color="success"
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary">
                    BSC Network
                  </Typography>
                </Box>

                {/* Owner Status */}
                <Box sx={{ mt: 1 }}>
                  {checkingOwner ? (
                    <Typography variant="caption" color="textSecondary">
                      Checking owner status...
                    </Typography>
                  ) : (
                    <Chip
                      label={isOwner ? "✅ Contract Owner" : "❌ Not Owner"}
                      color={isOwner ? "success" : "warning"}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Owner Alert */}
                {!checkingOwner && !isOwner && (
                  <Alert severity="info" sx={{ mt: 2, fontSize: '0.875rem' }}>
                    You are not the contract owner. Some features may be restricted.
                  </Alert>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Connect your wallet to access features
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isConnected ? (
              <ConnectButton
                client={client}
                wallets={wallets}
                chain={bscChain}
                connectModal={{
                  size: 'wide',
                  title: 'Connect Wallet',
                  showThirdwebBranding: false,
                }}
                connectButton={{
                  label: "Connect Wallet",
                  style: {
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }
                }}
              />
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDisconnect}
                sx={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Disconnect
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimpleWalletConnect;
