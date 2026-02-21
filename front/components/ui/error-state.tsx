'use client';

import { Box, Typography, Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  queryKey: string[];
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ queryKey, message }) => {
  const { t } = useTranslation();
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
        {message ?? t('common.errorLoadingData')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => queryClient.invalidateQueries({ queryKey })}
      >
        {t('common.tryAgain')}
      </Button>
    </Box>
  );
};

export default ErrorState;
