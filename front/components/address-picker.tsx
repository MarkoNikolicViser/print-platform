// components/address-picker.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import 'leaflet/dist/leaflet.css';

type Suggestion = {
  formatted: string;
  lat: number;
  lon: number;
};

interface AddressPickerProps {
  apiKey: string; // Geoapify API key (MUST be defined)
  onSelect: (data: { address: string; lat: number; lng: number }) => void;
  visible?: boolean; // parent visibility for invalidateSize
}

export default function AddressPicker({ apiKey, onSelect, visible = true }: AddressPickerProps) {
  const LRef = useRef<typeof import('leaflet') | null>(null);

  const mapRef = useRef<import('leaflet').Map | null>(null);
  const markerRef = useRef<import('leaflet').Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [autoErr, setAutoErr] = useState<string | null>(null);
  const [loadingAuto, setLoadingAuto] = useState(false);

  // Keep a ref to abort previous autocomplete fetch
  const autoAbortRef = useRef<AbortController | null>(null);

  // ---- Map init ----
  useEffect(() => {
    let disposed = false;

    (async () => {
      if (!LRef.current) {
        const L = await import('leaflet');
        if (!disposed) LRef.current = L;
      }
      if (disposed) return;
      if (!mapContainerRef.current || mapRef.current || !LRef.current) return;

      const L = LRef.current;
      const map = L.map(mapContainerRef.current, {
        center: [44.7866, 20.4489], // Belgrade
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      // Use Geoapify tiles (prevents OSM 403)
      L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
        attribution: '© OpenStreetMap contributors, © Geoapify',
      }).addTo(map);

      mapRef.current = map;

      // Ensure correct size after layout
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    })();

    return () => {
      disposed = true;
      try {
        mapRef.current?.remove();
      } catch {}
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [apiKey]);

  // Invalidate on visibility change (parent toggles map)
  useEffect(() => {
    if (!mapRef.current) return;
    requestAnimationFrame(() => {
      mapRef.current!.invalidateSize(false);
      setTimeout(() => mapRef.current?.invalidateSize(false), 250);
    });
  }, [visible]);

  // ResizeObserver to keep map responsive
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const el = mapContainerRef.current;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize(false));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- Autocomplete ----
  useEffect(() => {
    // Reset errors
    setAutoErr(null);

    // Do not call API for very short inputs
    if (!query || query.trim().length < 3) {
      if (autoAbortRef.current) autoAbortRef.current.abort();
      setSuggestions([]);
      setLoadingAuto(false);
      return;
    }

    // Abort previous fetch
    if (autoAbortRef.current) {
      autoAbortRef.current.abort();
    }
    const controller = new AbortController();
    autoAbortRef.current = controller;

    const fetchSuggestions = async () => {
      setLoadingAuto(true);
      try {
        if (!apiKey) {
          throw new Error('Missing Geoapify API key.');
        }

        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query,
        )}&limit=8&apiKey=${apiKey}`;

        const res = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            // Some corporate networks need explicit accept
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          // Common cases: 401 (bad key), 403 (referrer policy), 429 (rate limit)
          throw new Error(`Autocomplete HTTP ${res.status}: ${text || res.statusText}`);
        }

        const data = await res.json();
        const features = Array.isArray(data?.features) ? data.features : [];

        const results: Suggestion[] = features.map((f: any) => ({
          formatted: f?.properties?.formatted ?? 'Nepoznata adresa',
          lat: f?.properties?.lat,
          lon: f?.properties?.lon,
        }));

        setSuggestions(results);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // aborted due to new keystroke; ignore
          return;
        }
        console.error('Geoapify autocomplete error:', err);
        setAutoErr(err?.message || 'Greška pri autocomplete pretrazi.');
        setSuggestions([]);
      } finally {
        setLoadingAuto(false);
      }
    };

    // Small debounce
    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [query, apiKey]);

  // ---- Marker helpers ----
  const setMarker = (lat: number, lng: number) => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;

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
    onSelect({ address: item.formatted, lat: item.lat, lng: item.lon });
  };

  // ---- Current location ----
  async function getBrowserLocation(
    opts: PositionOptions = { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
  ): Promise<GeolocationPosition> {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      throw new Error('Geolokacija nije podržana u ovom pregledaču.');
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, opts);
    });
  }

  const handleCurrentLocation = async () => {
    try {
      const pos = await getBrowserLocation();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setMarker(lat, lng);

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`,
        );
        if (!res.ok) {
          console.error('Reverse geocoding HTTP error:', res.status);
        }
        const data = await res.json();
        const address = data.features?.[0]?.properties?.formatted || 'Nepoznata adresa';
        setQuery(address);
        onSelect({ address, lat, lng });
      } catch (rgErr) {
        console.error('Reverse geocoding error:', rgErr);
        onSelect({ address: 'Nepoznata adresa', lat, lng });
      }
    } catch (err: any) {
      if (err?.code === 1) alert('Pristup lokaciji odbijen.');
      else if (err?.code === 2) alert('Lokacija nije dostupna.');
      else if (err?.code === 3) alert('Vreme je isteklo. Pokušajte ponovo.');
      else alert(err?.message || 'Ne možemo dobiti lokaciju.');
      console.error('Geolocation error:', err);
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          label="Adresa kopirnice"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Unesite najmanje 3 slova…"
          helperText={loadingAuto ? 'Pretraga…' : autoErr ? `Greška: ${autoErr}` : ' '}
          FormHelperTextProps={{ sx: { minHeight: 20 } }}
        />

        <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={handleCurrentLocation}>
          Moja lokacija
        </Button>
      </Stack>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <Paper
          elevation={6}
          sx={{
            position: 'absolute',
            width: '100%',
            zIndex: 1400, // above Leaflet & MUI cards
            maxHeight: 280,
            overflow: 'auto',
            mt: 1,
          }}
        >
          <List>
            {suggestions.map((item, index) => (
              <ListItemButton key={`${item.formatted}-${index}`} onClick={() => handleSelect(item)}>
                <ListItemText primary={item.formatted} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}

      {/* Map container */}
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
