import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Wallet3,
  Profile2User,
  MoneyRecive,
  PresentionChart,
  MoneySend
} from 'iconsax-react';
import SimpleWalletConnect from 'components/SimpleWalletConnect';

const RBMWhitelistDashboard = () => {
  const theme = useTheme();

  const FeatureCard = ({ title, description, icon, href, buttonText }) => (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                borderRadius: 2,
                p: 1.5,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {React.cloneElement(icon, {
                size: 24,
                color: theme.palette.text.primary
              })}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, flexGrow: 1 }}>
            {description}
          </Typography>

          <Button
            variant="outlined"
            href={href}
            fullWidth
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          RBM WhiteList Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage RBM token transfers and whitelist operations
        </Typography>
      </Box>

   

      {/* Main Features */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Main Features
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard
            title="Single Transfer"
            description="Transfer tokens from a specific registered user to the platform wallet"
            icon={<MoneyRecive />}
            href="/rbm-whitelist/transfers/single"
            buttonText="Start Transfer"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard
            title="Multi Transfer"
            description="Transfer tokens from all eligible registered users in one transaction"
            icon={<MoneySend />}
            href="/rbm-whitelist/transfers/multi"
            buttonText="Bulk Transfer"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard
            title="User Analytics"
            description="View detailed information about registered users and their token balances"
            icon={<Profile2User />}
            href="/rbm-whitelist/queries/registered-users"
            buttonText="View Users"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FeatureCard
            title="Query Tools"
            description="Check allowances, balances, registration status and extractable tokens"
            icon={<PresentionChart />}
            href="/rbm-whitelist/queries/allowance"
            buttonText="Query Data"
          />
        </Grid>
      </Grid>

      {/* Quick Access Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Quick Access
      </Typography>

      <Card sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                href="/rbm-whitelist/queries/allowance"
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }
                }}
              >
                Check Allowance
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                href="/rbm-whitelist/queries/registration"
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }
                }}
              >
                Check Registration
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                href="/rbm-whitelist/queries/balance"
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }
                }}
              >
                Check Balance
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                href="/rbm-whitelist/queries/total-extractable"
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }
                }}
              >
                Total Extractable
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RBMWhitelistDashboard;
