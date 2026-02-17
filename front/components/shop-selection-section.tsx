'use client';

import dynamic from 'next/dynamic';
import { usePrintContext } from '@/context/PrintContext';
import { useCopyShops } from '@/hooks/useCopyShops';
import { AddToCartPayload, CopyShop } from '@/types';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
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
import { GEOAPIFY_KEY } from '@/helpers/constants';
import CopyshopsMap from './shops-map';

type SortBy = 'distance' | 'price' | 'rating';

export function ShopSelectionSection() {
  const {
    file,
    selectedTemplate,
    printConfig,
    quantity,
    fileInfo,
    selectedShop,
    setSelectedShop,
  } = usePrintContext();
  const disabled = !file || !selectedTemplate;

  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showMap, setShowMap] = useState<boolean>(false);

  const { mutate: addToCart, isPending } = useAddToCart();
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const memoizedConfig = useMemo(() => JSON.stringify(printConfig), [printConfig]);

  const { data: copyShops = [], isLoading, error, isError } = useCopyShops({
    selectedTemplate: selectedTemplate?.id,
    quantity,
    memoizedConfig,
    numberOfPages: fileInfo?.pages,
    enabled: true,
  });

  const mapShops = copyShops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    lat: shop.latitude,   // ovde koristiš shop.latitude
    lng: shop.longitude,  // ovde koristiš shop.longitude
  }));

  const selectedShopData: CopyShop | null =
    selectedShop && copyShops ? copyShops.find((s) => s.id === selectedShop) ?? null : null;

  const handleAddToCart = () => {
    const orderCode = localStorage.getItem('order_code');
    const payload: AddToCartPayload = {
      order_code: orderCode || undefined,
      product_template_id: selectedTemplate?.id,
      selected_options: memoizedConfig,
      quantity: quantity,
      print_shop_id: selectedShop,
      document_url: fileInfo?.url,
      document_name: file?.name,
      document_pages: String(fileInfo?.pages),
      document_mime: file?.type,
    };
    addToCart(payload);
  };

  if (isLoading) return <ShopSelectionSkeleton />;
  if (isError) return <ErrorState queryKey={['copyShops']} message={error.message} />;

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardHeader
        title={
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            color="primary"
            align="center"
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            Pronađite najbližu ili najjeftiniju štampariju
          </Typography>
        }
      />

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        {/* Filters and Search */}
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          flexWrap="wrap"
          gap={2}
        >
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
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ pl: 4 }}
            />
          </Box>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Grad</InputLabel>
            <Select
              size="small"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              label="Grad"
            >
              <MenuItem value="all">Svi gradovi</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Sort Buttons */}
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          flexWrap="wrap"
          gap={1}
        >
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
            disabled
          >
            {!isMobile && 'Najbolje ocenjene'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowMap((s) => !s)}
            size="small"
            startIcon={<Navigation size={16} />}
          >
            {showMap ? 'Lista' : 'Mapa'}
          </Button>
        </Box>

        {/* Map */}
        {showMap && (
          <Card
            variant="outlined"
            sx={{
              borderStyle: 'dashed',
              borderColor: 'primary.main',
              overflow: 'visible',
              mt: 2,
            }}
          >
            <CardContent sx={{ textAlign: 'initial', py: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Navigation size={24} color="var(--mui-palette-primary-main)" />
                <Typography variant="h6" color="primary">
                  Interaktivna mapa
                </Typography>
              </Box>
              <CopyshopsMap apiKey={GEOAPIFY_KEY} shops={mapShops} />
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
              copyShops.map((shop: CopyShop) => (
                <Card
                  key={shop.id}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderColor:
                      selectedShop === shop.id ? 'primary.main' : 'grey.300',
                    backgroundColor:
                      selectedShop === shop.id ? 'action.hover' : 'inherit',
                  }}
                  onClick={() => setSelectedShop(shop.id)}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection={isMobile ? 'column' : 'row'}
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box flex={1}>
                        <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mb={1}>
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
                            <Typography variant="caption">not available</Typography>
                          </Box>
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {shop?.templates.map((service: string) => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          mt={1}
                          display="block"
                        >
                          Radno vreme:{' '}
                          {shop.is_open_today
                            ? shop.working_time_today
                            : 'Neradan dan'}
                        </Typography>
                      </Box>
                      <Box textAlign={isMobile ? 'left' : 'right'} ml={isMobile ? 0 : 2} mt={isMobile ? 1 : 0}>
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
      </CardContent>

      {/* Rezime */}
      {selectedShop && file && selectedTemplate && (
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            boxShadow: { xs: 6, md: 0 },
          }}
        >
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddToCart}
              disabled={isPending}
            >
              Dodaj u korpu i nastavi kupovinu
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                handleAddToCart();
                router.push('/home/cart');
              }}
              disabled={isPending}
            >
              Plati i poruči odmah
            </Button>
          </Card>
        </Box>
      )}
    </Card>
  );
}
