import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import { debounce } from 'lodash';

// material-ui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// project imports
import MainCard from 'components/MainCard';

// validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  username: Yup.string()
    .min(6, 'Username must be at least 6 characters')
    .max(200, 'Username must be less than 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters'),
  phone_number: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  refer_username: Yup.string(),
  wallet: Yup.number()
    .min(0, 'Wallet balance cannot be negative')
    .default(0),
  status: Yup.boolean().default(true)
});

const AddUserForm = ({ open, onClose, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [referrerStatus, setReferrerStatus] = useState({ checking: false, exists: null, user: null });

  // Function to check if referrer username exists
  const checkReferrerUsername = async (username) => {
    if (!username || username.length < 3) {
      setReferrerStatus({ checking: false, exists: null, user: null });
      return;
    }

    setReferrerStatus({ checking: true, exists: null, user: null });

    try {
      const response = await axios.get(`/check-username/${username}`);
      if (response.status === 200) {
        setReferrerStatus({
          checking: false,
          exists: response.data.result.exists,
          user: response.data.result.user || null
        });
      }
    } catch (error) {
      setReferrerStatus({ checking: false, exists: false, user: null });
    }
  };

  // Debounced version of the check function
  const debouncedCheckReferrer = useCallback(
    debounce(checkReferrerUsername, 500),
    []
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      refer_username: '',
      wallet: 0,
      status: true
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.post('/add-user', values);
        
        if (response.status === 200) {
          openSnackbar({
            open: true,
            message: 'User created successfully!',
            variant: 'alert',
            alert: { color: 'success' }
          });
          resetForm();
          onUserAdded && onUserAdded(response.data.data);
          onClose();
        }
        else{
           openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: { color: 'success' }
          });
        }
      } catch (error) {
        const errorMessage = error?.message || 'Failed to create user';
        console.log(error)
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: { color: 'error' }
        });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  // Effect to check referrer username when it changes
  useEffect(() => {
    if (formik.values.refer_username) {
      debouncedCheckReferrer(formik.values.refer_username);
    } else {
      setReferrerStatus({ checking: false, exists: null, user: null });
    }
  }, [formik.values.refer_username, debouncedCheckReferrer]);

  const handleClose = () => {
    formik.resetForm();
    setReferrerStatus({ checking: false, exists: null, user: null });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h4">Add New User</Typography>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="name">Full Name *</InputLabel>
                <OutlinedInput
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter full name"
                  fullWidth
                  error={Boolean(formik.touched.name && formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                  <FormHelperText error>{formik.errors.name}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username">Username *</InputLabel>
                <OutlinedInput
                  id="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter username"
                  fullWidth
                  error={Boolean(formik.touched.username && formik.errors.username)}
                />
                {formik.touched.username && formik.errors.username && (
                  <FormHelperText error>{formik.errors.username}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(formik.touched.email && formik.errors.email)}
                />
                {formik.touched.email && formik.errors.email && (
                  <FormHelperText error>{formik.errors.email}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="phone_number">Phone Number</InputLabel>
                <OutlinedInput
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter phone number"
                  fullWidth
                  error={Boolean(formik.touched.phone_number && formik.errors.phone_number)}
                />
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <FormHelperText error>{formik.errors.phone_number}</FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Security Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Security Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password">Password *</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter password"
                  fullWidth
                  error={Boolean(formik.touched.password && formik.errors.password)}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error>{formik.errors.password}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="confirm_password">Confirm Password *</InputLabel>
                <OutlinedInput
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Confirm password"
                  fullWidth
                  error={Boolean(formik.touched.confirm_password && formik.errors.confirm_password)}
                />
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                  <FormHelperText error>{formik.errors.confirm_password}</FormHelperText>
                )}
              </Stack>
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="refer_username">Referrer Username</InputLabel>
                <OutlinedInput
                  id="refer_username"
                  name="refer_username"
                  type="text"
                  value={formik.values.refer_username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter referrer username (optional)"
                  fullWidth
                  error={Boolean(formik.touched.refer_username && formik.errors.refer_username)}
                  endAdornment={
                    formik.values.refer_username && (
                      <InputAdornment position="end">
                        {referrerStatus.checking ? (
                          <CircularProgress size={20} />
                        ) : referrerStatus.exists === true ? (
                          <Chip label="✓ Found" color="success" size="small" />
                        ) : referrerStatus.exists === false ? (
                          <Chip label="✗ Not Found" color="error" size="small" />
                        ) : null}
                      </InputAdornment>
                    )
                  }
                />
                {formik.touched.refer_username && formik.errors.refer_username && (
                  <FormHelperText error>{formik.errors.refer_username}</FormHelperText>
                )}
                {referrerStatus.exists === true && referrerStatus.user && (
                  <FormHelperText sx={{ color: 'success.main' }}>
                    Referrer: {referrerStatus.user.name} ({referrerStatus.user.username})
                  </FormHelperText>
                )}
                {referrerStatus.exists === false && formik.values.refer_username && (
                  <FormHelperText error>
                    No referrer exists with username: {formik.values.refer_username}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="wallet">Initial Wallet Balance</InputLabel>
                <OutlinedInput
                  id="wallet"
                  name="wallet"
                  type="number"
                  value={formik.values.wallet}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0"
                  fullWidth
                  error={Boolean(formik.touched.wallet && formik.errors.wallet)}
                />
                {formik.touched.wallet && formik.errors.wallet && (
                  <FormHelperText error>{formik.errors.wallet}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.status}
                    onChange={(e) => formik.setFieldValue('status', e.target.checked)}
                    name="status"
                  />
                }
                label="Active Status"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Create User
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserForm;
