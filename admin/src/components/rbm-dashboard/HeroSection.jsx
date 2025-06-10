import React from 'react';
import { Box, Container, Typography, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Token } from '@mui/icons-material';

const HeroSectionStyled = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const HeroSection = () => {
  return (
    <HeroSectionStyled>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <Token sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography variant="h2" component="h1" fontWeight="bold">
            RBM Dashboard
          </Typography>
        </Stack>
      </Container>
    </HeroSectionStyled>
  );
};

export default HeroSection;
