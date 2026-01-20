import { CircularProgress, Box } from '@mui/material';
import React from 'react';

interface SpinnerProps {
  size?: number; // diameter of the spinner
  thickness?: number; // thickness of the spinner stroke
  color?: 'primary' | 'secondary' | 'inherit'; // MUI color options
  fullScreen?: boolean; // whether to center it fullscreen
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  thickness = 4,
  color = 'primary',
  fullScreen = true,
}) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100%',
        }}
      >
        <CircularProgress size={size} thickness={thickness} color={color} />
      </Box>
    );
  }

  return <CircularProgress size={size} thickness={thickness} color={color} />;
};

export default Spinner;
