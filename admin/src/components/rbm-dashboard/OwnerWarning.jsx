import React from 'react';
import { Alert, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';

const OwnerWarning = ({ isOwner, contractOwner }) => {
  if (isOwner) return null;

  return (
    <Alert
      severity="warning"
      sx={{
        mb: 4,
        borderRadius: 2,
        '& .MuiAlert-icon': { fontSize: 28 }
      }}
      icon={<Warning />}
    >
      <Typography variant="body1" fontWeight="bold">
        🚫 Limited Access: You are not the contract owner
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Transfer functions are restricted to the contract owner only.
        Current owner: {contractOwner ? `${contractOwner.slice(0, 8)}...${contractOwner.slice(-8)}` : 'Loading...'}
      </Typography>
    </Alert>
  );
};

export default OwnerWarning;
