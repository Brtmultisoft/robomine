import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import MainCard from 'components/MainCard';
import { Button } from '@mui/material';
import { Copy, ArrowRight } from 'iconsax-react';

const PrimePackage = () => {
  return (
    <MainCard title="Prime Membership">
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
            <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>Prime Membership</Typography>
            <Typography variant="h3" color="common.white" sx={{ fontWeight: 700 }}>$ 2500</Typography>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <ul
              style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
                color: 'white',
                fontSize: '1.25rem',
                lineHeight: '1.6',
              }}
            >
              <li>(i) Prime members earn 5% of CTO</li>
              <li>(ii) Non-working members earn max X2</li>
              <li>(iii) Working members earn max x3 and many more.....</li>
            </ul>

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
              Buy Now
            </Button>
          </Box>
        </Card>
      </Grid>
    </MainCard>
  );
};

export default PrimePackage;