import { Grid, Card, Typography, Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect,useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import { useParams } from 'react-router-dom';
import axiosServices from 'utils/axios';
const slotPackages = [
  { level: 1, price: 2 },
  { level: 2, price: 4 },
  { level: 3, price: 8 },
  { level: 4, price: 16 },
  { level: 5, price: 32 },
  { level: 6, price: 64 },
  { level: 7, price: 128 },
  { level: 8, price: 256 },
  { level: 9, price: 512 },
  { level: 10, price: 1024 },
  { level: 11, price: 2048 },
  { level: 12, price: 4096 }
];


export default function Packages() {
    const {type} = useParams()
    const {randomUUID} = new ShortUniqueId({length: 5, dictionary: 'alpha_upper'})
    const [purchasePackages, setPurchasePackages] = useState([])
    const [refresh, setRefresh] = useState(false)
    
  const handleBuyPackage = (_,price) => {
    const investment_plan_id = randomUUID();
    // Add your purchase logic here
    
    axiosServices.post('/add-investment', {
      investment_plan_id: type+investment_plan_id,
      amount: price
    })
    setRefresh(!refresh)
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      try {
        const response = await axiosServices.get('/get-all-investments'); 
        setPurchasePackages(response.data.result.list)
      } catch (error) {
        console.error('Failed to fetch purchased packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPackages();
  }, [refresh])
  
  //  Check if a package is already purchased
  const isPackagePurchased = (slotValue) => {
    return purchasePackages.some((pkg) => pkg.slot_value === slotValue);
  };

  return (
    <MainCard 
      sx={{ 
        bgcolor: 'grey.900',
        '& .MuiCardHeader-root': {
          color: 'common.white'
        }
      }}
    >
      <Grid container spacing={3}>
        {slotPackages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pkg.level}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #4158D0 0%, #C850C0 100%)',
                p: 2.5,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" color="common.white" sx={{ fontWeight: 600 }}>
                  Slot {pkg.level}
                </Typography>
                <Typography variant="h4" color="common.white" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontWeight: 600 
                }}>
                  <span style={{ color: '#FFD700' }}>•</span> ${pkg.price}
                </Typography>
              </Box>

              <Grid container spacing={1} sx={{ mb: 3 }}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      sx={{
                        width: '100%',
                        paddingTop: '100%',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '50%'
                        }
                      }}
                    >
                      {{type} && (index == 1) && (
                        <Typography variant="h6" color="common.white" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                         {type}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={() => handleBuyPackage(pkg.level, pkg.price)}
                disabled={isPackagePurchased(pkg.level)}
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                  },
                  textTransform: 'none',
                  py: 1.5,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              >
                {isPackagePurchased(pkg.level) ? 'Purchased' : 'Buy Package'}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MainCard>
  );
}
