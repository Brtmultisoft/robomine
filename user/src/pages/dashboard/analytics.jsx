import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';

// project-imports
import NewOrders from 'sections/widget/chart/NewOrders';
import NewUsers from 'sections/widget/chart/NewUsers';
import Visitors from 'sections/widget/chart/Visitors';
import DropboxStorage from 'sections/widget/statistics/DropboxStorage';
import SwitchBalanace from 'sections/widget/statistics/SwitchBalanace';
import ProjectAnalytics from 'sections/widget/chart/ProjectAnalytics';
import EcommerceIncome from 'sections/widget/chart/EcommerceIncome';
import LanguagesSupport from 'sections/widget/chart/LanguagesSupport';
import ProductOverview from 'sections/widget/chart/ProductOverview';
import PaymentHistory from 'sections/widget/data/PaymentHistory';
import EcommerceRadial from 'sections/widget/chart/EcommerceRadial';
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { Book } from 'iconsax-react';
import { Button } from '@mui/material';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const { user: userData } = useAuth();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const generateReferralLink = () => {
    const userAddress = user?.username || '0xb8B09Ab677d0D2B50f3d3bBcEF27790D44386edD'; // Ensure userAddress is defined
    return `${userAddress}`;
  };

  const handleCopyReferralLink = () => {
    const referralLink = generateReferralLink();
    navigator.clipboard.writeText(referralLink).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Referral link has been copied to clipboard.',
        showConfirmButton: false,
        timer: 1500
      });
    });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {/* row 1 */}
      <Grid item xs={12} md={4} lg={3}>
        <NewOrders count={parseFloat(parseFloat(user?.extra?.dailyIncome).toFixed(3)) || 0} />
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <NewUsers count={parseFloat(user?.extra?.levelIncome).toFixed(3) || 0} />
      </Grid>
      <Grid item xs={12} lg={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <EcommerceDataCard
              title="Username"
              count={user?.name ?? "Anonymous"}
              color="success"
              iconPrimary={<Book color={theme.palette.success.darker} />}
            />
          </Grid>
          <Grid item xs={12}>
            <EcommerceDataCard
              title="Status"
              count={user?.status ? "ACTIVE" : "INACTIVE"}
              color="success"
              iconPrimary={<Book color={theme.palette.success.darker} />}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} lg={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SwitchBalanace count={(Number(user?.extra?.dailyIncome || 0) +  Number(user?.extra?.levelIncome || 0)).toFixed(2)} />
          </Grid>
          <Grid item xs={12}>
            <EcommerceRadial count={(user?.wallet_token+user?.wallet)*2.5} name="Capping Limit" color={theme.palette.primary.main} />
          </Grid>


          {/* <Grid item xs={12} md={6} lg={12}>
            <LanguagesSupport />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} md={4} lg={3} spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} >
            <EcommerceIncome count={user?.wallet_topup} />
          </Grid>
          <Grid item xs={12} >
            <EcommerceRadial name="Total Staked Token" count={user?.wallet_token+user?.wallet} color={theme.palette.primary.main} />
            <Button
              variant="contained"
              onClick={handleCopyReferralLink}
              style={{ backgroundColor: theme.palette.primary.main, color: '#fff' }}
            >
              Copy Referral Link
            </Button>
          </Grid>
        


        </Grid>
      </Grid>




      {/* row 2 */}

      {/* row 3 */}
      <Grid item xs={6}>
        <ProjectAnalytics />
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <ProductOverview />
      </Grid> */}
    </Grid>
  );
}
