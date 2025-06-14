import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { TickCircle, CloseCircle, Clock, Award } from 'iconsax-react';
import { adminApi } from 'services/adminApi';
import Swal from 'sweetalert2';

const PendingRankRewards = () => {
  const [pendingRewards, setPendingRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingRewards();
  }, []);

  const fetchPendingRewards = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/rank-rewards/pending');
      if (response.data.status) {
        setPendingRewards(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching pending rewards:', error);
      Swal.fire('Error', 'Failed to fetch pending rewards', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (userId, action) => {
    try {
      setProcessing(true);
      const response = await adminApi.post('/rank-rewards/approve', {
        userId,
        action,
        adminId: 'admin' // You can get this from auth context
      });

      if (response.data.success) {
        Swal.fire(
          'Success!',
          `Rank reward ${action}d successfully`,
          'success'
        );
        fetchPendingRewards(); // Refresh the list
        setDialogOpen(false);
      }
    } catch (error) {
      console.error(`Error ${action}ing reward:`, error);
      Swal.fire('Error', `Failed to ${action} reward`, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const openConfirmDialog = (reward) => {
    setSelectedReward(reward);
    setDialogOpen(true);
  };

  const getRewardTypeColor = (rewardType) => {
    switch (rewardType) {
      case 'RBM_TOKEN':
        return 'primary';
      case 'E_WALLET':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      1: '#FFD700', // Gold
      2: '#C0C0C0', // Silver
      3: '#CD7F32', // Bronze
      5: '#9400D3'  // Purple
    };
    return colors[rank] || '#666';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Pending Rank Rewards
      </Typography>
      
      {pendingRewards.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No pending rank rewards at the moment.
        </Alert>
      ) : (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Rank Achieved</TableCell>
                    <TableCell>Reward Amount</TableCell>
                    <TableCell>Reward Type</TableCell>
                    <TableCell>Achieved Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingRewards.map((reward) => (
                    <TableRow key={reward.userId}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {reward.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reward.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Award />}
                          label={reward.rankName}
                          sx={{
                            backgroundColor: getRankColor(reward.rank),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          ${reward.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.rewardType}
                          color={getRewardTypeColor(reward.rewardType)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(reward.achievedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<TickCircle />}
                            onClick={() => openConfirmDialog(reward)}
                            disabled={processing}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CloseCircle />}
                            onClick={() => handleApproveReject(reward.userId, 'reject')}
                            disabled={processing}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <TickCircle color="green" />
            Approve Rank Reward
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Confirm Reward Approval
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">User:</Typography>
                  <Typography variant="body1">{selectedReward.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Rank:</Typography>
                  <Typography variant="body1">{selectedReward.rankName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Reward:</Typography>
                  <Typography variant="body1">${selectedReward.amount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Type:</Typography>
                  <Typography variant="body1">{selectedReward.rewardType}</Typography>
                </Grid>
              </Grid>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action will credit the reward to the user's account and cannot be undone.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            onClick={() => handleApproveReject(selectedReward?.userId, 'approve')}
            variant="contained"
            color="success"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <TickCircle />}
          >
            {processing ? 'Processing...' : 'Approve & Credit Reward'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingRankRewards;
