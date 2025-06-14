import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { TickCircle, CloseCircle, Clock, Award } from 'iconsax-react';
import { adminApi } from 'services/adminApi';
import Swal from 'sweetalert2';

const RankRewardsHistory = () => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRewardsHistory();
  }, []);

  const fetchRewardsHistory = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/rank-rewards/history');
      if (response.data.status) {
        setRewardsHistory(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching rewards history:', error);
      Swal.fire('Error', 'Failed to fetch rewards history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <TickCircle />;
      case 'rejected':
        return <CloseCircle />;
      case 'pending':
        return <Clock />;
      default:
        return <Clock />;
    }
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

  const filteredHistory = rewardsHistory.filter(reward => 
    statusFilter === 'all' || reward.status === statusFilter
  );

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
        Rank Rewards History
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredHistory.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No rank rewards history found for the selected filter.
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
                    <TableCell>Status</TableCell>
                    <TableCell>Processed Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((reward, index) => (
                    <TableRow key={`${reward.userId}-${index}`}>
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
                        <Chip
                          icon={getStatusIcon(reward.status)}
                          label={reward.status.toUpperCase()}
                          color={getStatusColor(reward.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {reward.approvedAt 
                          ? new Date(reward.approvedAt).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RankRewardsHistory;
