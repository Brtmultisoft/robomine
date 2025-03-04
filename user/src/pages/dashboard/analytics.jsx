import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Button } from '@mui/material';
import { Copy, ArrowRight } from 'iconsax-react';
import { useNavigate ,Link} from 'react-router-dom';


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
import axios from 'utils/axios';
// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const { user: userData } = useAuth();
  const [directIncome, setDirectIncome] = useState(0);
  const navigate = useNavigate();
   

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

  const handlePreviewClick = (type) => {
    navigate(`/packages/${type}`);
  };
  useEffect(() => {
    const fetchDirectIncome = async () => {
      const response = await axios.get('/get-user-direct');
      
      
     
    };
    fetchDirectIncome();
  }, []);
 
  return (
    <>
      {/* Profile Header */}
      <Box 
        sx={{ 
          bgcolor: 'grey.900', 
          p: 3, 
          mb: 3, 
          borderRadius: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2
        }}
      >
        {/* Left Section - Profile & IDs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              border: '2px solid',
              borderColor: 'primary.main'
            }}
            src="/default-profile.png" // Add your default profile image path
            alt="Profile"
          />
          <Stack spacing={1}>
            <Typography variant="h5" color="common.white" sx={{overflow: 'hidden'}}>
              ID {userData?.id}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="grey.500">
                {userData?.username?.slice(0, 6)}...{userData?.username?.slice(-4) || '0x14Dc...207F'}
              </Typography>
              <Tooltip title="Copy ID">
                <IconButton
                  size="small"
                  onClick={() => {
                    navigator.clipboard.writeText(userData?.username || '0x14Dc...207F');
                    Swal.fire({
                      icon: 'success',
                      title: 'Copied!',
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }}
                  sx={{ color: 'grey.500' }}
                >
                  <Copy size={16} variant="Bold" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Box>

        {/* Right Section - Personal Link */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 3, md: 5 },
            bgcolor: 'grey.800',
            p: 2,
            borderRadius: 2,
            width: { xs: '100%', md: 'auto', lg: '30%' }
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" color="grey.500">
              Referal Link
            </Typography>
            <Typography 
              variant="body2" 
              color="white"
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <Typography component={Link} to={`${process.env.PUBLIC_URL}/login?ref=${userData?.username}`} color="white" target="_blank">
                {`${process.env.PUBLIC_URL}/login?ref=${userData?.username}`}
              </Typography>
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(`${process.env.PUBLIC_URL}/login?ref=${userData?.username}`);
              Swal.fire({
                icon: 'success',
                title: 'Copied!',
                showConfirmButton: false,
                timer: 1500
              });
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 'auto' },
              px: 3,
              whiteSpace: 'nowrap'
            }}
          >
            Copy
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards Box - Your existing code */}
      <Box sx={{ bgcolor: 'grey.900', p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Row 1 - Statistics Cards */}
          {/* <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={userData?.partners || 0}
              value="Team"
              subtitle="Total Team Members"
              increment={0}
              darkMode={true}
            />
          </Grid> */}

          <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={ `$${(userData?.extra?.totalIncome)?.toFixed(3) || 0}`}
              value="Total Earnings"
              subtitle="Total Earnings"
              increment={387}
              darkMode={true}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={`$${(userData?.extra?.directIncome)?.toFixed(3) || 0}`}
              value="Direct Income"
              subtitle="Direct Income"
              increment={0}
              // isPercentage={true}
              darkMode={true}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={`$${(userData?.extra?.levelIncome)?.toFixed(3) || 0}`}
              value="Level Income"
              subtitle="Level Income"
              // secondaryCount={`$${userData?.profits?.bnb || 0}`}
              increment={0}
              darkMode={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={`${userData?.extra?.cappingLimit || 0}`}
              value="Capping Limit"
              subtitle="Capping Limit"
              // secondaryCount={`$${userData?.profits?.bnb || 0}`}
              increment={0}
              darkMode={true}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={`$${(userData?.extra?.provisionIncome)?.toFixed(3) || 0}`}
              value="Provision Bonus"
              subtitle="Provision Bonus"
              // secondaryCount={userData?.profits?.bnb || "364.9904 BNB"}
              increment={0}
              darkMode={true}
            />
          </Grid>

           <Grid item xs={12} sm={6} lg={4}>
            <NewOrders
              count={`$${(userData?.extra?.matrixIncome)?.toFixed(3) || 0}`}
              value="Global Auto Pool Matrix Income"
              subtitle="Global Auto Pool Matrix Income"
              increment={0}
              darkMode={true}
            />
          </Grid>     
          
        </Grid>
      </Box>

      {/* Add this after your existing statistics cards Grid */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* X3 Package */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg, #0f172a 0%,rgb(97, 55, 170) 100%)',
                p: 2.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '220px', // Fixed height for rectangle shape
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>x3 Package</Typography>
                {/* <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>375 330 BUSD</Typography> */}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Grid container spacing={1} sx={{ maxWidth: '200px' }}>
                  {[...Array(12)].map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '85%',
                          paddingTop: '80%',
                          bgcolor: '#4F46E5',
                          borderRadius: 0.5,
                          opacity: 0.7
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

               <Link to="/packages/x3"> <Button
                  variant="contained"
                  // onClick={() => handlePreviewClick('x3')}
                  sx={{
                    bgcolor: '#D946EF',
                    color: 'common.white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: '#C026D3'
                    },
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Preview
                </Button>
                </Link>
              </Box>
            </Card>
          </Grid>

          {/* X6 Package */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg,rgb(190, 99, 99) 0%,rgb(203, 206, 190) 100%)',
                p: 2.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '220px', // Fixed height for rectangle shape
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>x6 Package</Typography>
                {/* <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>375 330 BUSD</Typography> */}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Grid container spacing={1} sx={{ maxWidth: '200px' }}>
                  {[...Array(12)].map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '85%',
                          paddingTop: '80%',
                          bgcolor: '#4F46E5',
                          borderRadius: 0.5,
                          opacity: 0.7
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Button
                  variant="contained"
                  onClick={() => handlePreviewClick('x6')}
                  sx={{
                    bgcolor: 'rgb(226, 71, 71)',
                    color: 'common.white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: '#C026D3'
                    },
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Preview
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* X9 Package */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg,rgb(55, 63, 172) 0%,rgb(33, 128, 15) 100%)',
                p: 2.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '220px', // Fixed height for rectangle shape
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>x9 Package</Typography>
                {/* <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>375 330 BUSD</Typography> */}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Grid container spacing={1} sx={{ maxWidth: '200px' }}>
                  {[...Array(12)].map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '85%',
                          paddingTop: '80%',
                          bgcolor: '#4F46E5',
                          borderRadius: 0.5,
                          opacity: 0.7
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Link to="/packages/x9"><Button
                  variant="contained"
                  sx={{
                    bgcolor: 'rgb(52, 235, 16)',
                    color: 'common.white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: '#C026D3'
                    },
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Preview
                </Button>
                </Link>
              </Box>
            </Card>
          </Grid>

          {/* Prime Member Package */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg, #0f172a 0%,rgb(151, 28, 145) 100%)',
                p: 2.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '220px', // Fixed height for rectangle shape
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>Prime Member</Typography>
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>$ 2500</Typography>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Grid container spacing={1} sx={{ maxWidth: '200px' }}>
                  {/* {[...Array(12)].map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '85%',
                          paddingTop: '80%',
                          bgcolor: '#4F46E5',
                          borderRadius: 0.5,
                          opacity: 0.7
                        }}
                      />
                    </Grid>
                  ))} */}
                </Grid>

                <Link to="/membership/prime"><Button
                  variant="contained"
                  sx={{
                    bgcolor: '#D946EF',
                    color: 'common.white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: '#C026D3'
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                    marginTop: '50%'
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Preview
                </Button></Link>
              </Box>
            </Card>
          </Grid>

          {/* Founder Member Package */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: 'grey.900',
                background: 'linear-gradient(135deg, #0f172a 0%,rgb(26, 204, 204) 100%)',
                p: 2.5,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                height: '220px', // Fixed height for rectangle shape
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>Founder Member</Typography>
                <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>$ 5000</Typography>
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Grid container spacing={1} sx={{ maxWidth: '200px' }}>
                  {/* {[...Array(12)].map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Box
                        sx={{
                          width: '85%',
                          paddingTop: '80%',
                          bgcolor: '#4F46E5',
                          borderRadius: 0.5,
                          opacity: 0.7
                        }}
                      />
                    </Grid>
                  ))} */}
                </Grid>

                <Link to="/membership/founder"><Button
                  variant="contained"
                  
                  sx={{
                    bgcolor: 'rgb(1, 255, 255)',
                    color: 'common.white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: '#C026D3'
                    },
                    textTransform: 'none',
                    fontSize: '1rem',
                      marginTop: '50%'
                  }}
                  endIcon={<ArrowRight size={16} />}
                >
                  Preview
                </Button></Link>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}