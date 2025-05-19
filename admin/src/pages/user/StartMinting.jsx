import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'utils/axios';
import { openSnackbar } from 'api/snackbar';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Stop } from 'iconsax-react';

// project imports
import MainCard from 'components/MainCard';

// validation schema
const validationSchema = Yup.object({
  user_id: Yup.string().required('User ID is required')
});

export default function StopMinting() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      user_id: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`/start-minting/${values.user_id}`);
        if (response.status === 200) {
          openSnackbar({
            open: true,
            message: 'Minting Started successfully',
            variant: 'alert',
            alert: {
              color: 'success'
            }
          });
          formik.resetForm();
        }
      } catch (error) {
        openSnackbar({
          open: true,
          message: error?.response?.data?.msg || 'Failed to start minting',
          variant: 'alert',
          alert: {
            color: 'error'
          }
        });
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <MainCard title="Start User Minting">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="user_id">User ID</InputLabel>
              <OutlinedInput
                id="user_id"
                name="user_id"
                placeholder="Enter User ID"
                fullWidth
                value={formik.values.user_id}
                onChange={formik.handleChange}
                error={formik.touched.user_id && Boolean(formik.errors.user_id)}
              />
              {formik.touched.user_id && formik.errors.user_id && (
                <FormHelperText error>{formik.errors.user_id}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">
              This action will Start all minting activities for the specified user by changing the status to 2.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <LoadingButton 
                type="submit" 
                loading={loading} 
                variant="contained" 
                color="success"
                loadingPosition="start" 
                startIcon={<Stop />}
              >
                Start Minting
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
