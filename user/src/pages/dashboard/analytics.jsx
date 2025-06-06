import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import { Book, Star, Clock, Award, TickCircle, CloseCircle, InfoCircle } from 'iconsax-react';
import { Button } from '@mui/material';
import { userApi } from 'services/userApi';

// ==============================|| DASHBOARD - ANALYTICS ||============================== //

export default function DashboardAnalytics() {
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [rankStatus, setRankStatus] = useState({
    currentRank: 0,
    rankAchievedAt: null,
    pendingRankReward: null,
    hasAchievedRank: false,
    hasPendingReward: false
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });
  const { user: userData } = useAuth();

  useEffect(() => {
    setUser(userData);
    if (userData) {
      fetchRankStatus();
    }
  }, [userData]);

  // Fetch user's rank achievement status
  const fetchRankStatus = async () => {
    try {
      const response = await userApi.get('/get-rank-status');
      if (response.data.success) {
        setRankStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rank status:', error);
    }
  };

  // Countdown timer for 1st rank achievement (30 days from joining)
  useEffect(() => {
    if (!user?.created_at) return;

    const calculateTimeLeft = () => {
      const joinDate = new Date(user.created_at);
      const thirtyDaysLater = new Date(joinDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      const now = new Date();
      const difference = thirtyDaysLater.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [user?.created_at]);

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
      {/* 1st Rank Achievement Timer */}
      {(!user?.extra?.rank || user?.extra?.rank < 1) && user?.created_at && (
        <Grid item xs={12}>
          <Card
            sx={{
              background: timeLeft.expired
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 2
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Award size={32} color="white" />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {timeLeft.expired ? '⏰ Time Expired!' : '🏆 1st Rank Achievement Timer'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {timeLeft.expired
                        ? 'The 30-day window for 1st rank has expired'
                        : 'Time left to achieve 1st rank and earn $250 RBM tokens'
                      }
                    </Typography>
                  </Box>
                </Box>

                {!timeLeft.expired && (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={`${timeLeft.days}d`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '50px'
                      }}
                    />
                    <Chip
                      label={`${timeLeft.hours}h`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '50px'
                      }}
                    />
                    <Chip
                      label={`${timeLeft.minutes}m`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '50px'
                      }}
                    />
                    <Chip
                      label={`${timeLeft.seconds}s`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: '50px'
                      }}
                    />
                  </Box>
                )}

                {timeLeft.expired && (
                  <Chip
                    label="EXPIRED"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '8px 16px'
                    }}
                  />
                )}
              </Box>

              {!timeLeft.expired && (
                <Box mt={2}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    <strong>Requirements for 1st Rank:</strong> 5 Direct Members • 15 Team Members • $3000 Direct Business
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Rank Achievement Notification */}
      {rankStatus.hasAchievedRank && (
        <Grid item xs={12}>
          <Card
            sx={{
              background: rankStatus.hasPendingReward
                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                : rankStatus.pendingRankReward?.status === 'approved'
                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: 2
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  {rankStatus.hasPendingReward ? (
                    <InfoCircle size={32} color="white" />
                  ) : rankStatus.pendingRankReward?.status === 'approved' ? (
                    <TickCircle size={32} color="white" />
                  ) : (
                    <Award size={32} color="white" />
                  )}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {rankStatus.hasPendingReward
                        ? '⏳ Rank Achievement Pending Approval'
                        : rankStatus.pendingRankReward?.status === 'approved'
                        ? '✅ Rank Reward Approved!'
                        : `🎉 Congratulations! You've Achieved ${rankStatus.pendingRankReward?.rankName || `${rankStatus.currentRank} STAR`}!`
                      }
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {rankStatus.hasPendingReward
                        ? `Your ${rankStatus.pendingRankReward?.rankName} achievement is awaiting admin approval`
                        : rankStatus.pendingRankReward?.status === 'approved'
                        ? `Your ${rankStatus.pendingRankReward?.amount} ${rankStatus.pendingRankReward?.rewardType} reward has been credited`
                        : `You've successfully qualified for rank ${rankStatus.currentRank}`
                      }
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                  {rankStatus.hasPendingReward && (
                    <>
                      <Chip
                        label={`${rankStatus.pendingRankReward?.amount} ${rankStatus.pendingRankReward?.rewardType}`}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label="PENDING"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </>
                  )}

                  {rankStatus.pendingRankReward?.status === 'approved' && (
                    <Chip
                      label={`+${rankStatus.pendingRankReward?.amount} ${rankStatus.pendingRankReward?.rewardType}`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    />
                  )}

                  {!rankStatus.hasPendingReward && rankStatus.pendingRankReward?.status !== 'approved' && (
                    <Chip
                      label={`RANK ${rankStatus.currentRank}`}
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}
                    />
                  )}
                </Box>
              </Box>

              {rankStatus.rankAchievedAt && (
                <Box mt={2}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    <strong>Achieved on:</strong> {new Date(rankStatus.rankAchievedAt).toLocaleDateString()}
                    {rankStatus.pendingRankReward?.approvedAt && (
                      <> • <strong>Approved on:</strong> {new Date(rankStatus.pendingRankReward.approvedAt).toLocaleDateString()}</>
                    )}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}

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
            <SwitchBalanace count={(Number(user?.extra?.dailyIncome || 0) + Number(user?.extra?.levelIncome || 0)).toFixed(2)} />
          </Grid>
          <Grid item xs={12}>
            <EcommerceRadial count={(user?.wallet_token + user?.wallet) * 2.5} name="Capping Limit" color={theme.palette.primary.main} />
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
            <EcommerceRadial name="Total Staked Token" count={user?.wallet_token + user?.wallet} color={theme.palette.primary.main} />
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
      <Grid item xs={12} md={4} lg={3} spacing={3}>
        <Grid item xs={12}>
          <EcommerceDataCard
            title="Rank"
            count={user?.extra?.rank ?? 'Not Achieved'}
            color="success"
            iconPrimary={<Star color={theme.palette.success.darker} />}
          />
        </Grid>

      </Grid>
      {/* <Grid item xs={12} md={6}>
        <ProductOverview />
      </Grid> */}
    </Grid>
  );
}
