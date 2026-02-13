'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Copyshop {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

interface Props {
    apiKey: string;
    shops: Copyshop[];
}

export default function CopyshopsMap({ apiKey, shops }: Props) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current).setView([44.8, 20.45], 12);

        L.tileLayer(
            `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
            { attribution: '© OpenStreetMap contributors, © Geoapify' }
        ).addTo(map);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [apiKey]);

    // Add markers
    useEffect(() => {
        if (!mapRef.current) return;

        const map = mapRef.current;

        // Clear old markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        shops.forEach((shop) => {
            L.marker([shop.lat, shop.lng])
                .addTo(map)
                .bindPopup(`<b>${shop.name}</b>`);
        });
    }, [shops]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: 500, borderRadius: 12 }}
        />
    );
}
