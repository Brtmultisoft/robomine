import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  UserRemove,
  TickCircle
} from 'iconsax-react';
import { adminApi } from '../../services/adminApi';

const LevelIncomeBanManagement = () => {
  const [stats, setStats] = useState({});
  const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

  // Quick ban/unban by username
  const [quickUsername, setQuickUsername] = useState('');
  const [quickBanLoading, setQuickBanLoading] = useState(false);
  const [quickUnbanLoading, setQuickUnbanLoading] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminApi.get('/level-income-bans/stats');
      if (response.data.status) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };





  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: 'success', message: '' }), 5000);
  };

  // Quick ban user by username
  const handleQuickBan = async () => {
    if (!quickUsername.trim()) {
      showAlert('error', 'Please enter a username');
      return;
    }

    setQuickBanLoading(true);
    try {
      // Use the server-side ban by username endpoint
      const response = await adminApi.post('/level-income-bans/ban-by-username', {
        username: quickUsername.trim(),
        reason: reason || `Quick ban by admin for username: ${quickUsername}`
      });

      if (response.data.status) {
        showAlert('success', `User "${quickUsername}" banned from level income successfully`);
        setQuickUsername('');
        setReason('');
        fetchStats();
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to ban user');
    } finally {
      setQuickBanLoading(false);
    }
  };

  // Quick unban user by username
  const handleQuickUnban = async () => {
    if (!quickUsername.trim()) {
      showAlert('error', 'Please enter a username');
      return;
    }

    setQuickUnbanLoading(true);
    try {
      // Use the server-side unban by username endpoint
      const response = await adminApi.post('/level-income-bans/unban-by-username', {
        username: quickUsername.trim(),
        reason: reason || `Quick unban by admin for username: ${quickUsername}`
      });

      if (response.data.status) {
        showAlert('success', `User "${quickUsername}" unbanned from level income successfully`);
        setQuickUsername('');
        setReason('');
        fetchStats();
      }
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to unban user');
    } finally {
      setQuickUnbanLoading(false);
    }
  };



  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Level Income Ban Management
      </Typography>

      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Users
              </Typography>
              <Typography variant="h4">
                {stats.totalUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                Active Users
              </Typography>
              <Typography variant="h4">
                {stats.activeUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Banned Users
              </Typography>
              <Typography variant="h4">
                {stats.bannedUsers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Ban Rate
              </Typography>
              <Typography variant="h4">
                {stats.banPercentage || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Ban/Unban Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Ban/Unban by Username
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Enter Username"
                value={quickUsername}
                onChange={(e) => setQuickUsername(e.target.value)}
                placeholder="Paste username here..."
                helperText="Enter the exact username to ban/unban"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Reason (Optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for ban/unban..."
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={handleQuickBan}
                  disabled={quickBanLoading || !quickUsername.trim()}
                  startIcon={quickBanLoading ? <CircularProgress size={20} color="inherit" /> : <UserRemove size={20} />}
                >
                  {quickBanLoading ? 'Banning...' : 'Quick Ban'}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleQuickUnban}
                  disabled={quickUnbanLoading || !quickUsername.trim()}
                  startIcon={quickUnbanLoading ? <CircularProgress size={20} color="inherit" /> : <TickCircle size={20} />}
                >
                  {quickUnbanLoading ? 'Unbanning...' : 'Quick Unban'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


    </Box>
  );
};

export default LevelIncomeBanManagement;
