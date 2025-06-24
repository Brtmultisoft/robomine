import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const contractABI = process.env.REACT_APP_CONTRACT_ABI;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// RBM Whitelist Contract Configuration
// const RBM_WHITELIST_ADDRESS = process.env.RBM_WHITELIST_ADDRESS;
// const RBM_TOKEN_ADDRESS = process.env.RBM_TOKEN_ADDRESS; // RBM Token Contract

// RBM Whitelist Contract ABI
// const RBM_WHITELIST_ABI = process.env.RBM_WHITELIST_ABI

// RBM Token ABI (for approval)
// const RBM_TOKEN_ABI = process.env.RBM_TOKEN_ABI

export default function AuthLogin() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [referralId, setReferralId] = useState('');
  // const [isWhitelisted, setIsWhitelisted] = useState(false);
  // const [isApproved, setIsApproved] = useState(false);
  // const [rbmBalance, setRbmBalance] = useState('0');
  // const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { address: userAddress, isConnected } = useAccount();
  const { login, register } = useAuth();
  const scriptedRef = useScriptRef();

  // const steps = ['Connect Wallet', 'Approve RBM Tokens', 'Whitelist Address', 'Register/Login'];

  useEffect(() => {
    const checkAllStatuses = async () => {
      if (isConnected && userAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();

          // Check main contract registration
          const mainContract = new ethers.Contract(contractAddress, contractABI, signer);
          const userDetails = await mainContract.getUserDetail(userAddress);
          setIsRegistered(userDetails._isRegistered);

          // Check whitelist status
          // const whitelistContract = new ethers.Contract(RBM_WHITELIST_ADDRESS, RBM_WHITELIST_ABI, provider);
          // const whitelistStatus = await whitelistContract.checkIfRegistered(userAddress);
          // setIsWhitelisted(whitelistStatus);

          // // Check RBM token balance and allowance
          // const rbmContract = new ethers.Contract(RBM_TOKEN_ADDRESS, RBM_TOKEN_ABI, provider);
          // const balance = await rbmContract.balanceOf(userAddress);
          // const allowance = await rbmContract.allowance(userAddress, RBM_WHITELIST_ADDRESS);

          // setRbmBalance(ethers.utils.formatEther(balance));
          // setIsApproved(allowance.gt(0)); // Just check if any allowance exists

          // // Update current step based on status (Approval first, then whitelist)
          // if (!isConnected) {
          //   setCurrentStep(0);
          // } else if (!allowance.gt(0)) {
          //   setCurrentStep(1); // Approve RBM tokens first (regardless of balance)
          // } else if (!whitelistStatus) {
          //   setCurrentStep(2); // Then whitelist address
          // } else {
          //   setCurrentStep(3); // Finally register/login
          // }

        } catch (error) {
          console.error('Error checking statuses:', error);
        }
      } else {
        // setCurrentStep(0);
      }
    };

    checkAllStatuses();
  }, [isConnected, userAddress]);

  // // Handle whitelist address
  // const handleWhitelist = async () => {
  //   if (!isConnected || !userAddress) {
  //     openSnackbar({
  //       open: true,
  //       message: 'Please connect your wallet first!',
  //       variant: 'alert',
  //       alert: { color: 'error' }
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const whitelistContract = new ethers.Contract(RBM_WHITELIST_ADDRESS, RBM_WHITELIST_ABI, signer);

  //     const tx = await whitelistContract.whitlistAddress(userAddress);
  //     await tx.wait();

  //     setIsWhitelisted(true);
  //     setCurrentStep(3);

  //     openSnackbar({
  //       open: true,
  //       message: 'Address whitelisted successfully!',
  //       variant: 'alert',
  //       alert: { color: 'success' }
  //     });
  //   } catch (error) {
  //     openSnackbar({
  //       open: true,
  //       message: `Whitelist failed: ${error.message}`,
  //       variant: 'alert',
  //       alert: { color: 'error' }
  //     });
  //     console.error('Whitelist failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Handle RBM token approval
  // const handleApproval = async () => {
  //   if (!isConnected || !userAddress) {
  //     openSnackbar({
  //       open: true,
  //       message: 'Please connect your wallet first!',
  //       variant: 'alert',
  //       alert: { color: 'error' }
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const rbmContract = new ethers.Contract(RBM_TOKEN_ADDRESS, RBM_TOKEN_ABI, signer);

  //     // Get user's RBM balance
  //     const balance = await rbmContract.balanceOf(userAddress);

  //     // Approve maximum amount (or balance if user has tokens)
  //     // Use a large number for approval to cover future token acquisitions
  //     const approvalAmount = balance.gt(0) ? balance : ethers.utils.parseEther("1000000000"); // 1B tokens max approval

  //     // Approve the whitelist contract to spend user's RBM tokens
  //     const tx = await rbmContract.approve(RBM_WHITELIST_ADDRESS, approvalAmount);
  //     await tx.wait();

  //     setIsApproved(true);
  //     setCurrentStep(2);

  //     openSnackbar({
  //       open: true,
  //       message: 'RBM tokens approved successfully!',
  //       variant: 'alert',
  //       alert: { color: 'success' }
  //     });
  //   } catch (error) {
  //     openSnackbar({
  //       open: true,
  //       message: `Approval failed: ${error.message}`,
  //       variant: 'alert',
  //       alert: { color: 'error' }
  //     });
  //     console.error('Approval failed:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRegistrationOrLogin = async () => {
    if (!isConnected) {
      openSnackbar({
        open: true,
        message: 'Please connect your wallet first!',
        variant: 'alert',
        alert: { color: 'error' }
      });
      return;
    }

    // if (!isApproved) {
    //   openSnackbar({
    //     open: true,
    //     message: 'Please approve RBM tokens first!',
    //     variant: 'alert',
    //     alert: { color: 'error' }
    //   });
    //   return;
    // }

    // if (!isWhitelisted) {
    //   openSnackbar({
    //     open: true,
    //     message: 'Please whitelist your address first!',
    //     variant: 'alert',
    //     alert: { color: 'error' }
    //   });
    //   return;
    // }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call selfMigrate before registration/login
      try {
        const migrateTx = await contract.selfMigrate();
        await migrateTx.wait();
      } catch (migrateError) {
        // If already migrated, contract will revert, so we can ignore this error
        if (migrateError.message && migrateError.message.includes('Already migrated')) {
          // Already migrated, continue
        }
      }

      const userDetails = await contract.getUserDetail(userAddress);
      setIsRegistered(userDetails._isRegistered);

      if (!isRegistered) {
        const tx = await contract.registration(referralId);
        await tx.wait();
        await register(userAddress, referralId);
        openSnackbar({
          open: true,
          message: 'Registration successful!',
          variant: 'alert',
          alert: { color: 'success' }
        });
        setIsRegistered(true);
      } else {
        await login(userAddress);
        if (scriptedRef.current) {
          openSnackbar({
            open: true,
            message: 'Login successful!',
            variant: 'alert',
            alert: { color: 'success' }
          });
        }
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: `Operation failed: ${error.message}`,
        variant: 'alert',
        alert: { color: 'error' }
      });
      console.error('Operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard title="RBM Registration Process">
      <Grid container spacing={3}>
        {/* Progress Stepper */}
        {/* <Grid item xs={12}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid> */}

        {/* Wallet Connection */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ConnectButton />
            {isConnected && (
              <Typography variant="body2" color="success.main">
                ✓ Wallet Connected
              </Typography>
            )}
          </Box>
        </Grid>

        {/* RBM Balance Display */}
        {/* {isConnected && (
          <Grid item xs={12}>
            <Typography variant="body2">
              RBM Balance: {parseFloat(rbmBalance).toFixed(4)} RBM
            </Typography>
          </Grid>
        )} */}

        {/* Step 2: Approve RBM Tokens */}
        {/* {isConnected && currentStep >= 1 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AnimateButton>
                <Button
                  variant={isApproved ? "outlined" : "contained"}
                  onClick={handleApproval}
                  disabled={loading || isApproved}
                  startIcon={loading && currentStep === 1 ? <CircularProgress size={20} /> : null}
                >
                  {isApproved ? '✓ RBM Tokens Approved' : 'Approve RBM Tokens'}
                </Button>
              </AnimateButton>
              {isApproved && (
                <Typography variant="body2" color="success.main">
                  RBM tokens approved for registration
                </Typography>
              )}
              
            </Box>
          </Grid>
        )} */}

        {/* Step 3: Whitelist Address */}
        {/* {isConnected && isApproved && currentStep >= 2 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AnimateButton>
                <Button
                  variant={isWhitelisted ? "outlined" : "contained"}
                  onClick={handleWhitelist}
                  disabled={loading || isWhitelisted}
                  startIcon={loading && currentStep === 2 ? <CircularProgress size={20} /> : null}
                >
                  {isWhitelisted ? '✓ Address Whitelisted' : 'Whitelist Address'}
                </Button>
              </AnimateButton>
              {isWhitelisted && (
                <Typography variant="body2" color="success.main">
                  Your address is whitelisted
                </Typography>
              )}
            </Box>
          </Grid>
        )} */}

        {/* Referral ID Input */}
        {!isRegistered && isConnected && (
          <Grid item xs={12}>
            <TextField
              label="Referral ID (Optional)"
              variant="outlined"
              fullWidth
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
              helperText="Enter the referral ID if you have one"
            />
          </Grid>
        )}

        {/* Step 4: Register/Login */}
        {isConnected && (
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                variant="contained"
                onClick={handleRegistrationOrLogin}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                size="large"
                fullWidth
              >
                {isRegistered ? 'Login to Dashboard' : 'Complete Registration'}
              </Button>
            </AnimateButton>
          </Grid>
        )}

        {/* Status Messages */}
        {isConnected && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Registration Status:
              </Typography>
              {/* <Typography variant="body2" color={isApproved ? "success.main" : "text.secondary"}>
                • Token Approval: {isApproved ? "✓ Completed" : "Pending"}
              </Typography>
              <Typography variant="body2" color={isWhitelisted ? "success.main" : "text.secondary"}>
                • Whitelist: {isWhitelisted ? "✓ Completed" : "Pending"}
              </Typography> */}
              <Typography variant="body2" color={isRegistered ? "success.main" : "text.secondary"}>
                • Registration: {isRegistered ? "✓ Completed" : "Pending"}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
}

