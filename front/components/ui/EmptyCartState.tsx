'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from 'next/navigation';

interface EmptyCartStateProps {
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export default function EmptyCartState({
    title = 'Korpa je prazna',
    description = 'Izgleda da još niste dodali nijedan proizvod u korpu.',
    ctaLabel = 'Nazad na ponudu',
    ctaHref = '/',
}: EmptyCartStateProps) {
    const router = useRouter();

    return (
        <Box
            maxWidth="sm"
            mx="auto"
            mt={8}
            px={2}
            textAlign="center"
        >
            <Stack spacing={3} alignItems="center">
                <ShoppingCartOutlinedIcon
                    sx={{ fontSize: 64, color: 'text.secondary' }}
                />

                <Typography variant="h5" fontWeight={600}>
                    {title}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push(ctaHref)}
                >
                    {ctaLabel}
                </Button>
            </Stack>
        </Box>
    );
}
