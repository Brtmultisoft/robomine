import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from 'components/MainCard';
import axios from 'utils/axios';

const BanDownline = () => {
    const theme = useTheme();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setResult(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = activeTab === 0 
                ? await axios.post(`/ban-downline/${userId}`)
                : await axios.post(`/unban-downline/${userId}`);
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${activeTab === 0 ? 'ban' : 'unban'} downline users`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard title="Manage User Downline">
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    centered
                                    sx={{ mb: 2 }}
                                >
                                    <Tab label="Ban Downline" />
                                    <Tab label="Unban Downline" />
                                </Tabs>

                                <Typography variant="h5">
                                    Enter User ID to {activeTab === 0 ? 'Ban' : 'Unban'} Downline
                                </Typography>
                                
                                <TextField
                                    fullWidth
                                    label="User ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                    placeholder="Enter user ID"
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color={activeTab === 0 ? "error" : "success"}
                                    disabled={loading || !userId}
                                    sx={{ mt: 2 }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        `${activeTab === 0 ? 'Ban' : 'Unban'} Downline Users`
                                    )}
                                </Button>

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {result && (
                                    <Alert 
                                        severity={activeTab === 0 ? "success" : "info"} 
                                        sx={{ mt: 2 }}
                                    >
                                        Successfully {activeTab === 0 ? 'banned' : 'unbanned'} {result.bannedCount} users
                                        {result.failedCount > 0 && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Failed to {activeTab === 0 ? 'ban' : 'unban'} {result.failedCount} users
                                            </Typography>
                                        )}
                                    </Alert>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </MainCard>
    );
};

export default BanDownline; 