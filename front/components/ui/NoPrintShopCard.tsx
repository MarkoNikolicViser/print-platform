'use client';

import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

interface Props {
    createUrl?: string; // gde vodi dugme (default: /dashboard/print-shop/create)
}

export default function NoPrintShopCard({
    createUrl = '/dashboard/print-shop/create',
}: Props) {
    const router = useRouter();

    return (
        <Card
            sx={{
                maxWidth: 600,
                mx: 'auto',
                mt: 6,
                p: 2,
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Stack spacing={3} alignItems="center">
                    <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main' }} />

                    <Typography variant="h5" fontWeight={600}>
                        Nemaš kreiranu kopirnicu
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Da bi mogao da primaš porudžbine, potrebno je da prvo
                        kreiraš svoju kopirnicu.
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => router.push(createUrl)}
                        sx={{
                            px: 4,
                            py: 1.2,
                            borderRadius: 2,
                        }}
                    >
                        Kreiraj kopirnicu
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
