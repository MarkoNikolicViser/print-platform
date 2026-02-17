'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons when bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Copyshop {
  id: string;
  name: string;
  lat: number | null; // allow nulls
  lng: number | null; // allow nulls
}

interface Props {
  apiKey: string;
  shops: Copyshop[];
}

export default function CopyshopsMap({ apiKey, shops }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initial map setup
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      // Optional: prevent errors if container is tiny at first render
      preferCanvas: true,
    }).setView([44.8, 20.45], 12); // fallback center: Belgrade

    L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
      attribution: '© OpenStreetMap contributors, © Geoapify',
    }).addTo(map);

    // Create a layer group for markers
    const markerGroup = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersRef.current = markerGroup;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, [apiKey]);

  // Add/update markers when shops change
  useEffect(() => {
    const map = mapRef.current;
    const markerGroup = markersRef.current;
    if (!map || !markerGroup) return;

    // Clear previous markers safely
    markerGroup.clearLayers();

    // Filter out invalid coordinates
    const validShops = shops.filter(
      (s) =>
        typeof s.lat === 'number' &&
        typeof s.lng === 'number' &&
        isFinite(s.lat) &&
        isFinite(s.lng),
    ) as Array<Required<Pick<Copyshop, 'lat' | 'lng'>> & Copyshop>;

    // Add markers for valid shops
    validShops.forEach((shop) => {
      L.marker([shop.lat, shop.lng]).addTo(markerGroup).bindPopup(`<b>${shop.name}</b>`);
    });

    // Adjust view:
    // - Fit to bounds if we have at least 1 valid marker
    // - Else keep fallback center/zoom (no crash)
    if (validShops.length > 0) {
      const bounds = L.latLngBounds(validShops.map((s) => [s.lat!, s.lng!] as [number, number]));
      // If only one marker, set a nice zoom; else fit bounds
      if (validShops.length === 1) {
        map.setView(bounds.getCenter(), 15);
      } else {
        map.fitBounds(bounds.pad(0.1), { maxZoom: 16 });
      }
    } else {
      // Optional: reset to default view if no valid shops
      map.setView([44.8, 20.45], 12);
    }
  }, [shops]);

  return <div ref={containerRef} style={{ width: '100%', height: 500, borderRadius: 12 }} />;
}
