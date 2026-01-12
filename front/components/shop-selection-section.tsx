"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
} from "@mui/material";
import { MapPin, Clock, Star, Phone, Navigation, Filter, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query";
import { strapiService } from "@/services/strapiService"
import ShopSelectionSkeleton from '../components/ui/shop-selection-skeleton';
import ErrorState from '../components/ui/error-state';
import { useAddToCart } from "../hooks/useAddToCart"
import { usePrintContext } from "@/context/PrintContext";


interface Shop {
  id: number
  name: string
  address: string
  city: string
  phone: string
  distance: number
  basePrice: number
  rating: number
  reviewCount: number
  estimatedTime: string
  services: string[]
  workingHours: string
  coordinates: { lat: number; lng: number }
}

const mockShops: Shop[] = [
  {
    id: 1,
    name: "Copy Centar Beograd",
    address: "Knez Mihailova 15",
    city: "Beograd",
    phone: "+381 11 123-4567",
    distance: 0.5,
    basePrice: 8,
    rating: 4.8,
    reviewCount: 124,
    estimatedTime: "30 min",
    services: ["Štampanje", "Kopiranje", "Skeniranje", "Povezivanje"],
    workingHours: "08:00 - 20:00",
    coordinates: { lat: 44.8176, lng: 20.4633 },
  },
  {
    id: 2,
    name: "Štamparija Milenijum",
    address: "Terazije 25",
    city: "Beograd",
    phone: "+381 11 234-5678",
    distance: 1.2,
    basePrice: 6,
    rating: 4.6,
    reviewCount: 89,
    estimatedTime: "45 min",
    services: ["Štampanje", "Kopiranje", "Laminiranje"],
    workingHours: "09:00 - 19:00",
    coordinates: { lat: 44.8125, lng: 20.4612 },
  },
  {
    id: 3,
    name: "Print Shop Novi Sad",
    address: "Zmaj Jovina 8",
    city: "Novi Sad",
    phone: "+381 21 345-6789",
    distance: 2.1,
    basePrice: 5,
    rating: 4.9,
    reviewCount: 156,
    estimatedTime: "1 sat",
    services: ["Štampanje", "Kopiranje", "Skeniranje", "Povezivanje", "Dizajn"],
    workingHours: "08:30 - 19:30",
    coordinates: { lat: 45.2671, lng: 19.8335 },
  },
  {
    id: 4,
    name: "Express Print Niš",
    address: "Obrenovićeva 12",
    city: "Niš",
    phone: "+381 18 456-7890",
    distance: 3.5,
    basePrice: 7,
    rating: 4.4,
    reviewCount: 67,
    estimatedTime: "1.5 sata",
    services: ["Štampanje", "Kopiranje", "Foto štampanje"],
    workingHours: "09:00 - 18:00",
    coordinates: { lat: 43.3209, lng: 21.8958 },
  },
  {
    id: 5,
    name: "Kragujevac Copy",
    address: "Svetozara Markovića 3",
    city: "Kragujevac",
    phone: "+381 34 567-8901",
    distance: 4.2,
    basePrice: 6,
    rating: 4.7,
    reviewCount: 93,
    estimatedTime: "2 sata",
    services: ["Štampanje", "Kopiranje", "Skeniranje", "Povezivanje"],
    workingHours: "08:00 - 18:30",
    coordinates: { lat: 44.0165, lng: 20.9114 },
  },
]

export function ShopSelectionSection() {
  const { file, selectedTemplate, printConfig } = usePrintContext();
  const disabled = !file || !selectedTemplate;
  const [selectedShop, setSelectedShop] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [sortBy, setSortBy] = useState<"distance" | "price" | "rating">("distance")
  const [filterCity, setFilterCity] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const router = useRouter()

  const memoizedConfig = useMemo(() => JSON.stringify(printConfig), [printConfig]);

  const {
    data: copyShops,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["copyShops", memoizedConfig],
    queryFn: () =>
      !selectedTemplate
        ? strapiService.getCopyShops()
        : strapiService.getCopyShops(
          selectedTemplate?.id,
          3,
          1,
          memoizedConfig
        ),
    refetchOnWindowFocus: false,
  });

  // Listen for cost updates from print configuration
  useEffect(() => {
    const handleFileCalculated = (event: CustomEvent) => {
      setEstimatedCost(event.detail.estimatedCost || 0)
    }

    window.addEventListener("fileCalculated", handleFileCalculated as EventListener)
    return () => window.removeEventListener("fileCalculated", handleFileCalculated as EventListener)
  }, [])

  const cities = ["all", ...Array.from(new Set(mockShops.map((shop) => shop.city)))]

  const filteredAndSortedShops = mockShops
    .filter((shop) => {
      const matchesCity = filterCity === "all" || shop.city === filterCity
      const matchesSearch =
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCity && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "price":
          return a.basePrice - b.basePrice
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const calculateShopPrice = (shop: Shop): number => {
    if (!estimatedCost) return 0
    const multiplier = shop.basePrice / 10 // Base price per RSD
    return Math.round(estimatedCost * multiplier)
  }

  const selectedShopData = selectedShop ? copyShops?.find((s) => s.id === selectedShop) : null

  const handleOrderClick = () => {
    if (!selectedShopData || !estimatedCost) return

    // In a real app, you would pass this data through state management or URL params
    router.push("/checkout")
  }

  const { mutate, isPending } = useAddToCart()

  const handleAddToCart = () => {
    const orderCode = localStorage.getItem("order_code")
    const payload = {
      "order_code": orderCode || undefined,
      "product_template_id": selectedTemplate?.id,
      "selected_options": memoizedConfig,
      "quantity": 2,
      "print_shop_id": selectedShop,
      "customer_email": email,
      "document_url": "/test.pdf",
      "document_name": "test",
      "document_pages": "4",
      "document_mime": file?.type
    }
    mutate(payload)
  }
  if (isLoading) return <ShopSelectionSkeleton />
  if (isError) return <ErrorState queryKey={["copyShops"]} message={error.message} />;

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6" color="primary" sx={{ textTransform: "uppercase", fontWeight: "bold" }}>
            3. Izaberite štampariju
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary">
            Pronađite najbližu ili najjeftiniju štampariju
          </Typography>
        }
      />
      <CardContent sx={{
        display: "flex", flexDirection: "column", gap: 4,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto"
      }}>
        {/* Filters and Search */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex={1} minWidth={200} position="relative">
            <Search size={16} style={{ position: "absolute", top: "50%", left: 10, transform: "translateY(-50%)", color: "#888" }} />
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
              {cities.slice(1).map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2}>
          <Button variant={sortBy === "distance" ? "contained" : "outlined"} onClick={() => setSortBy("distance")} size="small" startIcon={<MapPin size={16} />}>
            Najbliže
          </Button>
          <Button variant={sortBy === "price" ? "contained" : "outlined"} onClick={() => setSortBy("price")} size="small">
            Najjeftinije
          </Button>
          <Button variant={sortBy === "rating" ? "contained" : "outlined"} onClick={() => setSortBy("rating")} size="small" startIcon={<Star size={16} />}>
            Najbolje ocenjene
          </Button>
          <Button variant="outlined" onClick={() => setShowMap(!showMap)} size="small" startIcon={<Navigation size={16} />}>
            {showMap ? "Lista" : "Mapa"}
          </Button>
        </Box>

        {/* Map View */}
        {showMap && (
          <Card variant="outlined" sx={{ borderStyle: "dashed", borderColor: "primary.main" }}>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <Navigation size={48} color="primary" style={{ marginBottom: 16 }} />
              <Typography variant="h6" color="primary">Interaktivna mapa</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Ovde bi se prikazala mapa sa lokacijama štamparija
              </Typography>
              <Grid container spacing={2}>
                {copyShops?.map((shop) => (
                  <Grid size={{ xs: 12, md: 4 }} key={shop.id}>
                    <Box p={2} border={1} borderRadius={2}>
                      <Typography variant="body1">{shop.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{shop.city}</Typography>
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
              <Card sx={{ p: 4, textAlign: "center" }}>
                <Filter size={32} color="#888" style={{ marginBottom: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  Nema štamparija koje odgovaraju vašim kriterijumima
                </Typography>
              </Card>
            ) : (
              copyShops?.map((shop) => (
                <Card
                  key={shop.id}
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    borderColor: selectedShop === shop.id ? "primary.main" : "grey.300",
                    backgroundColor: selectedShop === shop.id ? "action.hover" : "inherit",
                  }}
                  onClick={() => setSelectedShop(shop.id)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="subtitle1" color="primary">{shop.name}</Typography>
                          <Chip label={shop.city} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">{shop.address}</Typography>
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
                          {/* <Box display="flex" alignItems="center" gap={1}>
                            <Phone size={14} />
                            <Typography variant="caption">{shop.phone}</Typography>
                          </Box> */}
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {shop?.templates.map((service: string) => (
                            <Chip key={service} label={service} size="small" variant="outlined" />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" mt={1}>
                          Radno vreme: {shop.is_open_now ? shop.working_time_today : 'Neradan dan'}
                        </Typography>
                      </Box>
                      <Box textAlign="right" ml={2}>
                        {shop?.total_price ? <Typography variant="h6" color="primary">
                          {shop?.total_price} RSD
                        </Typography> : null}
                        {/* <Typography variant="caption" color="text.secondary">
                          {estimatedCost ? "za ovaj posao" : "osnovna cena"}
                        </Typography> */}
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
          <Card variant="outlined" sx={{ borderColor: "primary.main", backgroundColor: "action.hover" }}>
            <CardHeader
              title={
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  Rezime narudžbine
                </Typography>
              }
            />
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }} >
                  <Typography variant="subtitle2" color="primary">Izabrana štamparija:</Typography>
                  <Typography variant="body1">{selectedShopData.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedShopData.address}, {selectedShopData.city}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} >
                  <Typography variant="subtitle2" color="primary">Detalji:</Typography>
                  <Typography variant="body2">Udaljenost: calculate this km</Typography>
                  <Typography variant="body2">Vreme pripreme: not awailable for now</Typography>
                  <Typography variant="body2">Ocena: not available for now</Typography>
                </Grid>
              </Grid>

              {estimatedCost > 0 && (
                <Box p={2} border={1} borderRadius={2} borderColor="primary.main" bgcolor="background.paper">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="medium">Ukupna cena:</Typography>
                    <Typography variant="h6" color="primary">{calculateShopPrice(selectedShopData)} RSD</Typography>
                  </Box>
                </Box>
              )}

              <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                  label="Email za obaveštenja (opciono)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vasa.email@example.com"
                  fullWidth
                />
                <Typography variant="caption" color="text.secondary">
                  Poslaćemo vam email kada bude gotovo štampanje
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!estimatedCost}
                    onClick={handleOrderClick}
                  >
                    {estimatedCost
                      ? `Naruči i plati (${calculateShopPrice(selectedShopData)} RSD)`
                      : "Prvo konfigurišite štampanje"}
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
