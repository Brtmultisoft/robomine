// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { Link as RouterLink, useSearchParams } from 'react-router-dom';

// // material-ui
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import Stack from '@mui/material/Stack';
// import Link from '@mui/material/Link';
// import InputLabel from '@mui/material/InputLabel';
// import Typography from '@mui/material/Typography';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormHelperText from '@mui/material/FormHelperText';
// import FormControlLabel from '@mui/material/FormControlLabel';

// // third-party
// import * as Yup from 'yup';
// import { Formik } from 'formik';

// // project-imports
// import useAuth from 'hooks/useAuth';
// import useScriptRef from 'hooks/useScriptRef';
// import IconButton from 'components/@extended/IconButton';
// import AnimateButton from 'components/@extended/AnimateButton';
// import { fetcher } from 'utils/axios';

// // assets
// import { Eye, EyeSlash } from 'iconsax-react';
// import { Image } from 'react-bootstrap';

// // ============================|| JWT - LOGIN ||============================ //


// export default function AuthLogin({ forgot }) {

//   const [checked, setChecked] = useState(false);
//   const { isLoggedIn, login } = useAuth();
//   const scriptedRef = useScriptRef();

//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   }

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };


//   return <>
//     <Formik
//       enableReinitialize
//       initialValues={{
//         email: '',
//         password: '',
//         submit: null
//       }}
//       validationSchema={Yup.object().shape({
//         email: Yup.string()
//           .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
//           .required('Email is required'),
//         password: Yup.string().required('Password is required'),
      
//       })}
//       onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//         try {

//           await login(values.email, values.password);
//           if (scriptedRef.current) {
//             setStatus({ success: true });
//             setSubmitting(false);
//           }

//         } catch (err) {
//           console.error(err);
//           setStatus({ success: false });
//           setErrors({ submit: err.message });
//           setSubmitting(false);
//         }
//       }}
//     >
//       {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//         <form noValidate onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Stack spacing={1}>
//                 <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                 <OutlinedInput
//                   id="email-login"
//                   type="email"
//                   value={values.email}
//                   name="email"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   placeholder="Enter email address"
//                   fullWidth
//                   error={Boolean(touched.email && errors.email)}
//                 />
//               </Stack>
//               {touched.email && errors.email && (
//                 <FormHelperText error id="standard-weight-helper-text-email-login">
//                   {errors.email}
//                 </FormHelperText>
//               )}
//             </Grid>
//             <Grid item xs={12}>
//               <Stack spacing={1}>
//                 <InputLabel htmlFor="password-login">Password</InputLabel>
//                 <OutlinedInput
//                   fullWidth
//                   error={Boolean(touched.password && errors.password)}
//                   id="-password-login"
//                   type={showPassword ? 'text' : 'password'}
//                   value={values.password}
//                   name="password"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton
//                         aria-label="toggle password visibility"
//                         onClick={handleClickShowPassword}
//                         onMouseDown={handleMouseDownPassword}
//                         edge="end"
//                         color="secondary"
//                       >
//                         {showPassword ? <Eye /> : <EyeSlash />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   placeholder="Enter password"
//                 />
//               </Stack>
//               {touched.password && errors.password && (
//                 <FormHelperText error id="standard-weight-helper-text-password-login">
//                   {errors.password}
//                 </FormHelperText>
//               )}
//             </Grid>

//             <Grid item xs={12} sx={{ mt: -1 }}>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={checked}
//                       onChange={(event) => setChecked(event.target.checked)}
//                       name="checked"
//                       color="primary"
//                       size="small"
//                     />
//                   }
//                   label={<Typography variant="h6">Keep me sign in</Typography>}
//                 />

//                 <Link variant="h6" component={RouterLink} to={isLoggedIn && forgot ? forgot : '/forgot-password'} color="text.primary">
//                   Forgot Password?

//                 </Link>
//               </Stack>
//             </Grid>
//             {errors.submit && (
//               <Grid item xs={12}>
//                 <FormHelperText error>{errors.submit}</FormHelperText>
//               </Grid>
//             )}
             
//               <Grid item xs={12}>
//                 <AnimateButton>
//                   <Button
//                     disableElevation
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     Login
//                   </Button>
//                 </AnimateButton>
//               </Grid>
          

//             <br />
//           </Grid>
//         </form>
//       )}
//     </Formik>
//   </>

// }

// AuthLogin.propTypes = { forgot: PropTypes.string };




import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
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
  const { isLoggedIn, login } = useAuth();
  const { register, checkReferID } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
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
          setUserDetails(userDetails);
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
          await register(userAddress);
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
