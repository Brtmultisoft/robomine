import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import { fetcher } from 'utils/axios';
window.Buffer = Buffer;

const contractABI = process.env.REACT_APP_CONTRACT_ABI;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function AuthLogin() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [referralId, setReferralId] = useState('');
  const { isLoggedIn, login, register } = useAuth();
  const scriptedRef = useScriptRef();

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        openSnackbar({
          open: true,
          message: `Connected: ${accounts[0]}`,
          variant: 'alert',
          alert: { color: 'success' }
        });
      } catch (error) {
        console.error('Connection failed:', error);
        openSnackbar({
          open: true,
          message: 'Failed to connect MetaMask',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  useEffect(() => {
    const checkRegistration = async () => {
      if (window.ethereum && userAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
          const userDetails = await contract.getUserDetail(userAddress);
          setIsRegistered(userDetails._isRegistered);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    checkRegistration();
  }, [userAddress]);

  const handleRegistrationOrLogin = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      try {
        if (!isRegistered) {
          const tx = await contract.registration();
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
      alert('Please install MetaMask!');
    }
  };

  return (
    <MainCard title="Register or Login">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button variant="contained" onClick={connectMetaMask}>
              {userAddress ? `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connect MetaMask'}
            </Button>
          </AnimateButton>
        </Grid>
        {!isRegistered &&userAddress && (
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
              disabled={!userAddress}
            >
              {isRegistered ? 'Login' : 'Register & Login'}
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </MainCard>
  );
}