import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const contractABI = process.env.REACT_APP_CONTRACT_ABI;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function AuthLogin() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [referralId, setReferralId] = useState('');
  const { address: userAddress, isConnected } = useAccount();
  const { login, register } = useAuth();
  const scriptedRef = useScriptRef();

  useEffect(() => {
    const checkRegistration = async () => {
      if (isConnected && userAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []); // Ensure the wallet is connected
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          const userDetails = await contract.getUserDetail(userAddress);
          setIsRegistered(userDetails._isRegistered);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    checkRegistration();
  }, [isConnected, userAddress]);

  const handleRegistrationOrLogin = async () => {
    if (isConnected) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Ensure wallet connection
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

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
      }
    } else {
      alert('Please connect your wallet!');
    }
  };

  return (
    <MainCard title="Register or Login">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ConnectButton />
        </Grid>
        {!isRegistered && isConnected && (
          <Grid item xs={12}>
            <TextField
              label="Referral ID"
              variant="outlined"
              fullWidth
              value={referralId}
              onChange={(e) => setReferralId(e.target.value)}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              variant="contained"
              onClick={handleRegistrationOrLogin}
              disabled={!isConnected}
            >
              {isRegistered ? 'Login' : 'Register & Login'}
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </MainCard>
  );
}

