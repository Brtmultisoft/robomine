import { styled } from '@mui/material/styles';
import { Card, Button } from '@mui/material';

export const StatusCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(0,0,0,0.3)'
      : '0 8px 25px rgba(0,0,0,0.1)',
  }
}));

export const GlassCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0,0,0,0.3)'
      : '0 8px 32px rgba(0,0,0,0.1)',
  }
}));

export const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  }
}));
