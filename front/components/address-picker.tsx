'use client';

import MyLocationIcon from '@mui/icons-material/MyLocation';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Fix za Next.js i Leaflet marker ikone
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Suggestion = {
  formatted: string;
  lat: number;
  lon: number;
  city?: string;
};

interface AddressPickerProps {
  apiKey: string;
  onSelect: (data: { address: string; lat: number; lng: number; city?: string }) => void;
  visible?: boolean;
  initial?: { lat: number; lng: number; address: string; city?: string }; // Novi inicijalni stejt
}

export default function AddressPicker({
  apiKey,
  onSelect,
  visible = true,
  initial,
}: AddressPickerProps) {
  const { t } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState(initial?.address ?? '');
  const [selected, setSelected] = useState<boolean>(!!initial); // ako imamo inicijalnu lokaciju
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingAuto, setLoadingAuto] = useState(false);
  const autoAbortRef = useRef<AbortController | null>(null);

  // ---- Initialize map ----
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [44.8176, 20.4569],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
      attribution: '© OpenStreetMap contributors, © Geoapify',
    }).addTo(map);

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 150);
  }, [apiKey]);

  // ---- ResizeObserver ----
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (initial && typeof initial.lat === 'number' && typeof initial.lng === 'number') {
      setMarker(initial.lat, initial.lng);
      setSelected(true);
    }
  }, [initial]);

  // ---- Autocomplete ----
  useEffect(() => {
    if (selected) return; // ne prikazuj autocomplete ako je selektovano

    if (!query || query.trim().length < 3) {
      autoAbortRef.current?.abort();
      setSuggestions([]);
      setLoadingAuto(false);
      return;
    }

    autoAbortRef.current?.abort();
    const controller = new AbortController();
    autoAbortRef.current = controller;

    const fetchSuggestions = async () => {
      setLoadingAuto(true);
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query,
        )}&limit=8&filter=countrycode:rs&apiKey=${apiKey}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const results: Suggestion[] = (data.features ?? []).map((f: any) => ({
          formatted: f.properties.formatted,
          lat: f.properties.lat,
          lon: f.properties.lon,
          city: f.properties.city || f.properties.state,
        }));

        setSuggestions(results);
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') console.error(err);
        setSuggestions([]);
      } finally {
        setLoadingAuto(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query, apiKey, selected]);

  // ---- Marker helper ----
  const setMarker = (lat: number, lng: number) => {
    if (!mapRef.current) return;

    mapRef.current.setView([lat, lng], 16, { animate: true });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    }
  };

  const handleSelect = (item: Suggestion) => {
    setQuery(item.formatted);
    setSuggestions([]);
    setMarker(item.lat, item.lon);
    setSelected(true);
    onSelect({ address: item.formatted, lat: item.lat, lng: item.lon, city: item.city });
  };

  // ---- Current location ----
  const handleCurrentLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );
      const { latitude, longitude } = pos.coords;
      setMarker(latitude, longitude);

      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`,
      );
      const data = await res.json();
      const address = data.features?.[0]?.properties?.formatted || '';
      const city = data.features?.[0]?.properties?.city || data.features?.[0]?.properties?.state;

      setQuery(address);
      setSelected(true);
      onSelect({ address, lat: latitude, lng: longitude, city });
    } catch (err: any) {
      console.error(err);
      alert(t('addressPicker.locationError'));
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Stack direction="row" spacing={2} mb={1}>
        <TextField
          fullWidth
          label={t('addressPicker.label')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(false); // reset autocomplete kada korisnik kuca novo
          }}
          placeholder={t('addressPicker.placeholder')}
        />
        <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={handleCurrentLocation}>
          {t('addressPicker.myLocation')}
        </Button>
      </Stack>

      {loadingAuto && (
        <CircularProgress size={20} sx={{ position: 'absolute', top: 45, right: 10 }} />
      )}

      {suggestions.length > 0 && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: 1400,
            maxHeight: 280,
            overflow: 'auto',
            mt: 1,
          }}
        >
          <List>
            {suggestions.map((item, i) => (
              <ListItemButton key={i} onClick={() => handleSelect(item)}>
                <ListItemText primary={item.formatted} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      <Box
        ref={mapContainerRef}
        sx={{
          width: '100%',
          height: 360,
          mt: 2,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
        }}
      />
    </Box>
  );
}
