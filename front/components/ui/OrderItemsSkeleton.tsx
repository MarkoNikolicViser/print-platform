
import React from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    Paper,
    Grid,
    Divider,
    Skeleton
} from "@mui/material";

export const OrderItemsSkeleton: React.FC = () => {
    return (
        <Box maxWidth="md" mx="auto" mt={4} px={2}>
            <Box sx={{ p: 2 }}>
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Skeleton variant="text" width={180} height={32} />

                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={120} height={36} />
                        <Skeleton variant="rounded" width={140} height={36} />
                    </Stack>
                </Stack>

                {/* Items List */}
                <Stack spacing={2}>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Paper key={i} variant="outlined" sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Left Info */}
                                <Grid size={{ xs: 12, md: 4 }} >
                                    <Skeleton variant="text" width="80%" height={24} />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="70%" sx={{ mt: 1 }} />
                                    <Skeleton variant="text" width="50%" />
                                    <Skeleton variant="text" width="40%" />
                                </Grid>

                                {/* Right Options */}
                                <Grid size={{ xs: 12, md: 8 }} >
                                    <Grid container spacing={2}>
                                        {Array.from({ length: 4 }).map((_, j) => (
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={j}>
                                                <Skeleton
                                                    variant="rounded"
                                                    height={40}
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Skeleton variant="text" width="60%" />
                        </Paper>
                    ))}
                </Stack>

                {/* Summary */}
                <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Skeleton variant="text" width={140} height={28} />
                        <Skeleton variant="text" width={100} height={32} />
                    </Stack>
                </Paper>
            </Box>

            {/* Checkout Button */}
            <Box mt={4} display="flex" justifyContent="flex-end">
                <Skeleton variant="rounded" width={200} height={48} />
            </Box>
        </Box>
    );
};
