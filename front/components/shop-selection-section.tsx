'use client';

import { usePrintContext } from '@/context/PrintContext';
import { useCopyShops } from '@/hooks/useCopyShops';
import { CopyShop } from '@/types';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
  Chip,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MapPin, Clock, Star, Navigation, Filter, Search, EuroIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import ErrorState from '../components/ui/error-state';
import ShopSelectionSkeleton from '../components/ui/shop-selection-skeleton';
import { useAddToCart } from '../hooks/useAddToCart';

type SortBy = 'distance' | 'price' | 'rating';

export interface AddToCartPayload {
  order_code?: string;
  product_template_id?: number;
  selected_options: string;
  quantity: number;
  print_shop_id: number | null;
  customer_email?: string;
  document_url: string;
  document_name: string | undefined;
  document_pages: string;
  document_mime?: string;
}

export function ShopSelectionSection() {
  const { file, selectedTemplate, printConfig, quantity, fileInfo } = usePrintContext();
  const disabled = !file || !selectedTemplate;
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showMap, setShowMap] = useState<boolean>(false);
  const { mutate: addToCart, isPending } = useAddToCart();

  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const memoizedConfig = useMemo(() => JSON.stringify(printConfig), [printConfig]);

  const {
    data: copyShops = [],
    isLoading,
    error,
    isError,
  } = useCopyShops({
    selectedTemplate: selectedTemplate?.id,
    quantity,
    memoizedConfig,
    numberOfPages: fileInfo?.pages, // optional; defaults to 3
    enabled: true, // optional
  });

  const selectedShopData: CopyShop | null =
    selectedShop && copyShops ? (copyShops.find((s) => s.id === selectedShop) ?? null) : null;

  const handleAddToCart = () => {
    const orderCode = localStorage.getItem('order_code');
    const payload: AddToCartPayload = {
      order_code: orderCode || undefined,
      product_template_id: selectedTemplate?.id,
      selected_options: memoizedConfig,
      quantity: quantity,
      print_shop_id: selectedShop,
      document_url: '/test.pdf',
      document_name: file?.name,
      document_pages: String(fileInfo?.pages),
      document_mime: file?.type,
    };
    addToCart(payload);
  };
  if (isLoading) return <ShopSelectionSkeleton />;
  if (isError) return <ErrorState queryKey={['copyShops']} message={error.message} />;

  return (
    <Card>
      <CardHeader
        title={
          <Typography
            variant="h6"
            color="primary"
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            3. Izaberite štampariju
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Pronađite najbližu ili najjeftiniju štampariju
          </Typography>
        }
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        {/* Filters and Search */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex={1} minWidth={200} position="relative">
            <Search
              size={16}
              style={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                color: '#888',
              }}
            />
            <TextField
              placeholder="Pretražite štamparije..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ pl: 4 }}
            />
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Grad</InputLabel>
            <Select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} label="Grad">
              <MenuItem value="all">Svi gradovi</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant={sortBy === 'distance' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('distance')}
            size="small"
            startIcon={<MapPin size={16} />}
          >
            {!isMobile && 'Najbliže'}
          </Button>
          <Button
            variant={sortBy === 'price' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('price')}
            size="small"
            startIcon={<EuroIcon size={16} />}
          >
            {!isMobile && 'Najjeftinije'}
          </Button>
          <Button
            variant={sortBy === 'rating' ? 'contained' : 'outlined'}
            onClick={() => setSortBy('rating')}
            size="small"
            startIcon={<Star size={16} />}
          >
            {!isMobile && 'Najbolje ocenjene'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowMap(!showMap)}
            size="small"
            startIcon={<Navigation size={16} />}
          >
            {showMap ? 'Lista' : 'Mapa'}
          </Button>
        </Box>

        {/* Map View */}
        {showMap && (
          <Card variant="outlined" sx={{ borderStyle: 'dashed', borderColor: 'primary.main' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Navigation size={48} color="primary" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="primary">
                Interaktivna mapa
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Ovde bi se prikazala mapa sa lokacijama štamparija
              </Typography>
              <Grid container spacing={2}>
                {copyShops?.map((shop: CopyShop) => (
                  <Grid size={{ xs: 12, md: 4 }} key={shop.id}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="body1">{shop.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {shop.city}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Shop List */}
        {!showMap && (
          <Box display="flex" flexDirection="column" gap={2}>
            {copyShops?.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Filter size={32} color="#888" style={{ marginBottom: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  Nema štamparija koje odgovaraju vašim kriterijumima
                </Typography>
              </Card>
            ) : (
              copyShops?.map((shop: CopyShop) => (
                <Card
                  key={shop.id}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderColor: selectedShop === shop.id ? 'primary.main' : 'grey.300',
                    backgroundColor: selectedShop === shop.id ? 'action.hover' : 'inherit',
                  }}
                  onClick={() => setSelectedShop(shop.id)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="subtitle1" color="primary">
                            {shop.name}
                          </Typography>
                          <Chip label={shop.city} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {shop.address}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <MapPin size={14} />
                            <Typography variant="caption">calculate this km</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Clock size={14} />
                            <Typography variant="caption">calculate this</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Star size={14} color="#facc15" />
                            <Typography variant="caption">not available for now</Typography>
                          </Box>
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {shop?.templates.map((service: string) => (
                            <Chip key={service} label={service} size="small" variant="outlined" />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" mt={1}>
                          Radno vreme:{' '}
                          {shop.is_open_today ? shop.working_time_today : 'Neradan dan'}
                          {/* //TO DO - disable if not working with is_open_now */}
                        </Typography>
                      </Box>
                      <Box textAlign="right" ml={2}>
                        {shop?.total_price ? (
                          <Typography variant="h6" color="primary">
                            {shop?.total_price} RSD
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        )}

        {/* Order Summary */}
        {selectedShop && selectedShopData && (
          <Card
            variant="outlined"
            sx={{ borderColor: 'primary.main', backgroundColor: 'action.hover' }}
          >
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  Rezime narudžbine
                </Typography>
              }
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="primary">
                    Izabrana štamparija:
                  </Typography>
                  <Typography variant="body1">{selectedShopData.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedShopData.address}, {selectedShopData.city}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="primary">
                    Detalji:
                  </Typography>
                  <Typography variant="body2">Udaljenost: calculate this km</Typography>
                  <Typography variant="body2">Vreme pripreme: not awailable for now</Typography>
                  <Typography variant="body2">Ocena: not available for now</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      handleAddToCart();
                      router.push('/checkout');
                    }}
                  >
                    {/* {estimatedCost
                      ? `Naruči i plati (${calculateShopPrice(selectedShopData)} RSD)`
                      : "Prvo konfigurišite štampanje"} */}
                    Plati i poruci odmah
                  </Button>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isPending}
                    onClick={handleAddToCart}
                  >
                    Dodaj u korpu
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
