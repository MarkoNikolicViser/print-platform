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
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import L from 'leaflet';

type Suggestion = {
    formatted: string;
    lat: number;
    lon: number;
};

interface AddressPickerProps {
    apiKey: string;
    onSelect: (data: {
        address: string;
        lat: number;
        lng: number;
    }) => void;
}

export default function AddressPicker({
    apiKey,
    onSelect,
}: AddressPickerProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Init mapa
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const map = L.map(mapContainerRef.current).setView(
            [44.7866, 20.4489],
            13
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;
    }, []);

    // Autocomplete
    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
                        query
                    )}&apiKey=${apiKey}`
                );
                const data = await res.json();

                const results: Suggestion[] = data.features.map((f: any) => ({
                    formatted: f.properties.formatted,
                    lat: f.properties.lat,
                    lon: f.properties.lon,
                }));

                setSuggestions(results);
            } catch (err) {
                console.error(err);
            }
        }, 400);
    }, [query, apiKey]);

    const setMarker = (lat: number, lng: number) => {
        if (!mapRef.current) return;

        mapRef.current.setView([lat, lng], 16);

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

        onSelect({
            address: item.formatted,
            lat: item.lat,
            lng: item.lon,
        });
    };

    // ✅ Use Current Location
    const handleCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation nije podržan u ovom browseru.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setMarker(lat, lng);

                try {
                    const res = await fetch(
                        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
                    );
                    const data = await res.json();

                    const address =
                        data.features?.[0]?.properties?.formatted || 'Nepoznata adresa';

                    setQuery(address);

                    onSelect({
                        address,
                        lat,
                        lng,
                    });
                } catch (err) {
                    console.error(err);
                }
            },
            (error) => {
                console.error(error);
                alert('Nije moguće dobiti lokaciju.');
            }
        );
    };

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            <Stack direction="row" spacing={2}>
                <TextField
                    fullWidth
                    label="Adresa kopirnice"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <Button
                    variant="outlined"
                    startIcon={<MyLocationIcon />}
                    onClick={handleCurrentLocation}
                >
                    Moja lokacija
                </Button>
            </Stack>

            {suggestions.length > 0 && (
                <Paper
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        zIndex: 10,
                        maxHeight: 250,
                        overflow: 'auto',
                        mt: 1,
                    }}
                >
                    <List>
                        {suggestions.map((item, index) => (
                            <ListItemButton
                                key={index}
                                onClick={() => handleSelect(item)}
                            >
                                <ListItemText primary={item.formatted} />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}

            <Box
                ref={mapContainerRef}
                sx={{
                    height: 300,
                    mt: 2,
                    borderRadius: 2,
                }}
            />
        </Box>
    );
}
