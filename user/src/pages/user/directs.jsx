import CommonDatatable from 'helpers/CommonDatatable'
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import Grid from '@mui/material/Grid';
import { Wallet3, Chart, DocumentText } from 'iconsax-react';
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import axios from 'utils/axios';

export default function ROI() {
    const theme = useTheme();
    const [user, setUser] = useState({});
    const [teamStats, setTeamStats] = useState({
        totalInvestment: 0,
        totalStackedIco: 0,
        totalStackedCoin: 0
    });
    const { user: userData } = useAuth();
    const apiPoint = 'get-user-direct'

    useEffect(() => {
        setUser(userData);
        
        // Fetch data directly here instead of relying on CommonDatatable callback
        const fetchDirectData = async () => {
            try {
                const res = await axios.get(`/${apiPoint}?type=1`);
                console.log('Direct API response:', res.data);
                
                if (res.data?.status && res.data?.result?.list) {
                    calculateTeamStats(res.data.result.list);
                }
            } catch (error) {
                console.error('Error fetching direct data:', error);
            }
        };
        
        fetchDirectData();
    }, [userData]);
    
    const calculateTeamStats = (data) => {
        console.log('Processing data for stats:', data);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('No data available to calculate stats');
            return;
        }
        
        const stats = data.reduce((acc, member) => {
            // Convert values to numbers and handle null/undefined values
            const investment = parseFloat(member.topup) || 0;
            const stackedIco = parseFloat(member.wallet) || 0;
            const stackedCoin = parseFloat(member.wallet_token) || 0;
            
            console.log(`Member: ${member.name}, Investment: ${investment}, Stacked ICO: ${stackedIco}, Stacked Coin: ${stackedCoin}`);
            
            return {
                totalInvestment: acc.totalInvestment + investment,
                totalStackedIco: acc.totalStackedIco + stackedIco,
                totalStackedCoin: acc.totalStackedCoin + stackedCoin
            };
        }, { totalInvestment: 0, totalStackedIco: 0, totalStackedCoin: 0 });
        
        console.log('Final calculated stats:', stats);
        
        // Format numbers to 2 decimal places for display
        setTeamStats({
            totalInvestment: Number(stats.totalInvestment.toFixed(2)),
            totalStackedIco: Number(stats.totalStackedIco.toFixed(2)),
            totalStackedCoin: Number(stats.totalStackedCoin.toFixed(2))
        });
    };
    
    console.log('Current teamStats:', teamStats);

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
                header: 'Name',
                accessorKey: 'name'
            },
            {
                header: 'Total Stacked',
                accessorKey: 'wallet'
            },
            // {
            //     header: 'Position',
            //     accessorKey: 'position',
            //     cell: (props) => {
            //         return props.getValue() === 'L' ? "Left" : "Right"
            //     },
            // },
            {
                header: 'Investments',
                accessorKey: 'topup'
            },
           
            {
                header: 'Date',
                accessorKey: 'created_at',
                // meta: { className: 'cell-right' }
                cell: (props) => {
                    return new Date(props.getValue()).toLocaleString();
                },
                enableColumnFilter: false,
                enableGrouping: false
            }
        ],
        []
    );

    return<> 
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
    
    <CommonDatatable columns={columns} apiPoint={apiPoint} type={1} /> </>
}


