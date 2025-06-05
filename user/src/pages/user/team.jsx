import CommonDatatable from 'helpers/CommonDatatable'
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import { useMemo, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Wallet3, Chart, DocumentText } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';

export default function ROI() {
    const theme = useTheme();
    const [user, setUser] = useState({});
    const [teamStats, setTeamStats] = useState({
        totalInvestment: 0,
        totalStackedIco: 0,
        totalStackedCoin: 0
    });
    const { user: userData } = useAuth();
    const apiPoint = 'get-user-downline';

    useEffect(() => {
        setUser(userData);
    }, [userData]);

    // Calculate team stats from the data
    const calculateTeamStats = (data) => {
        if (!data || !Array.isArray(data)) return;
        
        const stats = data.reduce((acc, member) => {
            return {
                totalInvestment: acc.totalInvestment + (parseFloat(member.topup) || 0),
                totalStackedIco: acc.totalStackedIco + (parseFloat(member.wallet) || 0),
                totalStackedCoin: acc.totalStackedCoin + (parseFloat(member.wallet_token) || 0)
            };
        }, { totalInvestment: 0, totalStackedIco: 0, totalStackedCoin: 0 });
        
        setTeamStats(stats);
    };

    const columns = useMemo(
        () => [
            {
                header: 'User ID',
                accessorKey: 'trace_id'
            },
            {
                header: 'Identifier',
                accessorKey: 'username'
            },
            {
                header: 'Phone Number',
                accessorKey: 'phone_number'
            },
            {
                header: 'Investments',
                accessorKey: 'topup'
            },
            {
                header: 'Level',
                accessorKey: 'level'
            },
            {
                header: 'Total Stacked Ico',
                accessorKey: 'wallet'
            },
            {
                header: 'Total Stacked Coin',
                accessorKey: 'wallet_token'
            },
            {
                header: 'Date',
                accessorKey: 'created_at',
                cell: (props) => {
                    return new Date(props.getValue()).toLocaleString();
                },
                enableColumnFilter: false,
                enableGrouping: false
            }
        ],
        []
    );

    return (
     <> 
     <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <EcommerceDataCard
            title="Total Investment"
            count={teamStats.totalInvestment}
            iconPrimary={<Wallet3 />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <EcommerceDataCard
            title="Total Business"
            count={teamStats.totalStackedIco + teamStats.totalStackedCoin}
            iconPrimary={<Chart />}
            color="success"
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={4}>
          <EcommerceDataCard
            title="Total Stacked Coin"
            count={teamStats.totalStackedCoin}
            iconPrimary={<DocumentText />}
            color="warning"
          />
        </Grid> */}
      </Grid>  
    
    <CommonDatatable 
        columns={columns} 
        apiPoint={apiPoint} 
        noQueryStrings={true} 
        team={true} 
        onDataFetched={calculateTeamStats}
    /></>)
}
