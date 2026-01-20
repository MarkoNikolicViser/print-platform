'use client';

import { Box, Typography, Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorStateProps {
  queryKey: string[];
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  queryKey,
  message = 'Greška u vraćanju podataka',
}) => {
  const queryClient = useQueryClient();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      p={3}
    >
      <Typography variant="body1" color="error">
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => queryClient.invalidateQueries({ queryKey })}
      >
        Pokušaj ponovo
      </Button>
    </Box>
  );
};

export default ErrorState;
