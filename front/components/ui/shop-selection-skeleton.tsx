import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

export default function ShopSelectionSkeleton() {
  return (
    <Card>
      <CardHeader
        title={<Skeleton variant="text" width={250} height={30} sx={{ mb: 1 }} />}
        subheader={<Skeleton variant="text" width={200} height={20} />}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Filters and Search */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex={1} minWidth={200}>
            <Skeleton variant="rectangular" height={40} />
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>
              <Skeleton variant="text" width={60} />
            </InputLabel>
            <Select disabled>
              <MenuItem>
                <Skeleton variant="text" width={80} />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}
        <Box display="flex" gap={2}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={100} height={36} />
          ))}
        </Box>

        {/* Map View Skeleton */}
        <Card variant="outlined" sx={{ borderStyle: 'dashed', borderColor: 'primary.main' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={150} height={28} />
            <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[...Array(3)].map((_, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Box p={2} border={1} borderRadius={2}>
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
