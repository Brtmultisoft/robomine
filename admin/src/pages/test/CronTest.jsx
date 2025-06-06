import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { PlayArrow, CheckCircle, Error } from 'iconsax-react';

const CronTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runStarRankingCron = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/cron/starRankingCron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'XK7PZ8'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to run cron');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cron Job Testing
      </Typography>
      
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Star Ranking Cron Job
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This will manually trigger the star ranking cron job to check all users for rank qualifications.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            onClick={runStarRankingCron}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? 'Running Cron...' : 'Run Star Ranking Cron'}
          </Button>

          {result && (
            <Alert 
              severity="success" 
              icon={<CheckCircle />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>Cron executed successfully!</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Message:</strong> {result.message || 'Completed'}
              </Typography>
              {result.data && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Details:</strong> {JSON.stringify(result.data, null, 2)}
                </Typography>
              )}
            </Alert>
          )}

          {error && (
            <Alert 
              severity="error" 
              icon={<Error />}
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>Cron failed:</strong> {error}
              </Typography>
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>What this cron does:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ mt: 1 }}>
              <li>Checks all users for star rank qualifications</li>
              <li>Creates pending rank rewards for qualified users</li>
              <li>Updates user ranks in the database</li>
              <li>Creates income records with pending status</li>
              <li>Sends notifications to users about achievements</li>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CronTest;
