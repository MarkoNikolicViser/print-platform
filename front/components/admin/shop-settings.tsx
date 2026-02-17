'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import { useMyPrintShop } from '@/hooks/useMyPrintShop';
import { useUpdateMyPrintShop } from '@/hooks/useUpdateMyPrintShop';
const AddressPicker = dynamic(
  () => import('../address-picker'),
  { ssr: false }
);
import { GEOAPIFY_KEY } from '@/helpers/constants';
import NoPrintShopCard from '../ui/NoPrintShopCard';
import { useCreateMyPrintShop } from '@/hooks/useCreateMyPrintShop';

/* =========================
   Working hours mappers
========================= */

const daysMap = {
  mon: 'monday',
  tue: 'tuesday',
  wed: 'wednesday',
  thu: 'thursday',
  fri: 'friday',
  sat: 'saturday',
  sun: 'sunday',
} as const;

const reverseDaysMap = Object.fromEntries(
  Object.entries(daysMap).map(([k, v]) => [v, k])
);

function apiToUIWorkingHours(apiHours: any) {
  const result: any = {};

  Object.entries(daysMap).forEach(([apiKey, uiKey]) => {
    const day = apiHours?.[apiKey];
    result[uiKey] = {
      open: day?.from ?? '08:00',
      close: day?.to ?? '16:00',
      closed: day?.open === false,
    };
  });

  return result;
}

function uiToApiWorkingHours(uiHours: any) {
  const result: any = {};

  Object.entries(reverseDaysMap).forEach(([uiKey, apiKey]) => {
    const day = uiHours[uiKey];
    result[apiKey] = day.closed
      ? { open: false }
      : { open: true, from: day.open, to: day.close };
  });

  return result;
}

/* =========================
   Component
========================= */

export function ShopSettings({ shop, isLoading }) {
  const updateShop = useUpdateMyPrintShop();
  const createShop = useCreateMyPrintShop();

  const [config, setConfig] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  useEffect(() => {
    if (shop) {
      setConfig({
        name: shop.name,
        address: shop.address,
        city: shop.city,
        phone: shop.phone,
        email: shop.email,
        bank_account: shop.bank_account,
        isActive: shop.is_active,
        latitude: shop.latitude,
        longitude: shop.longitude,
        workingHours: apiToUIWorkingHours(shop.working_hours),
      });

    }
  }, [shop]);

  const updateField = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateWorkingHour = (
    day: string,
    field: 'open' | 'close' | 'closed',
    value: any
  ) => {
    setConfig((prev: any) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const saveConfig = () => {
    if (createMode) {
      createShop.mutate({
        name: config.name,
        address: config.address,
        city: config.city,
        phone: config.phone,
        latitude: config.latitude,
        longitude: config.longitude,
        working_hours: uiToApiWorkingHours(config.workingHours),
        email: config.email,
        bank_account: config.bank_account,
      });

    } else {
      updateShop.mutate({
        name: config.name,
        address: config.address,
        city: config.city,
        phone: config.phone,
        latitude: config.latitude,
        longitude: config.longitude,
        working_hours: uiToApiWorkingHours(config.workingHours),
        email: config.email,
        bank_account: config.bank_account,
      });
    }
    setHasChanges(false);
    setEditingLocation(false);
  };

  /* =========================
     RENDER LOGIC
  ========================= */

  if (isLoading) {
    return (
      <Box maxWidth={900} sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={360} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
    );
  }

  // 👇 Ako shop ne postoji i nije kliknuto na create
  if (!shop && !createMode) {
    return (
      <NoPrintShopCard
        createUrl="#"
        onCreate={() => {
          setCreateMode(true);
          setConfig({
            name: '',
            address: '',
            city: '',
            phone: '',
            email: '',
            bank_account: '',
            isActive: true,
            latitude: null,
            longitude: null,
            workingHours: apiToUIWorkingHours({}),
          });

        }}
      />
    );
  }

  if (!config) return null;

  return (
    <Box maxWidth={900}>
      <Typography variant="h5" mb={3}>
        {createMode ? 'Kreiraj kopirnicu' : 'Podešavanja štamparije'}
      </Typography>

      <Stack spacing={3}>

        {/* OSNOVNI PODACI */}
        {/* OSNOVNI PODACI */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            🏢 Informacije o firmi
          </Typography>

          {!editingCompany ? (
            <Stack spacing={2}>
              <TextField
                label="Naziv"
                value={config.name}
                disabled
                fullWidth
              />

              <TextField
                label="Telefon"
                value={config.phone}
                disabled
                fullWidth
              />

              <TextField
                label="Email"
                value={config.email}
                disabled
                fullWidth
              />

              <TextField
                label="Broj računa"
                value={config.bank_account}
                disabled
                fullWidth
              />

              <Chip
                label={config.isActive ? 'Aktivna' : 'Neaktivna'}
                color={config.isActive ? 'success' : 'default'}
                sx={{ width: 'fit-content' }}
              />

              <Button
                variant="outlined"
                onClick={() => setEditingCompany(true)}
              >
                Promeni podatke
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Naziv"
                value={config.name}
                onChange={(e) => updateField('name', e.target.value)}
                fullWidth
              />

              <TextField
                label="Telefon"
                value={config.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                fullWidth
              />

              <TextField
                label="Email"
                value={config.email}
                onChange={(e) => updateField('email', e.target.value)}
                fullWidth
              />

              <TextField
                label="Broj računa"
                value={config.bank_account}
                onChange={(e) => updateField('bank_account', e.target.value)}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => setEditingCompany(false)}
                >
                  Potvrdi
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditingCompany(false)}
                >
                  Otkaži
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>

        {/* LOKACIJA */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            📍 Lokacija
          </Typography>

          {!editingLocation ? (
            <Stack spacing={2}>
              <TextField
                label="Adresa"
                value={config.address}
                disabled
                fullWidth
              />

              <TextField
                label="Grad"
                value={config.city}
                disabled
                fullWidth
              />

              <Button
                variant="outlined"
                onClick={() => setEditingLocation(true)}
              >
                Promeni lokaciju
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <AddressPicker
                apiKey={GEOAPIFY_KEY}
                visible={true}
                initial={{
                  lat: config.latitude,
                  lng: config.longitude,
                  address: config.address,
                  city: config.city,
                }}
                onSelect={(data) => {
                  setConfig((prev: any) => ({
                    ...prev,
                    address: data.address,
                    city: data.city ?? prev.city, // grad sada ispravno ažuriran
                    latitude: data.lat,
                    longitude: data.lng,
                  }));
                  setHasChanges(true);
                }}
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => setEditingLocation(false)}
                >
                  Potvrdi lokaciju
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setEditingLocation(false)}
                >
                  Otkaži
                </Button>
              </Stack>
            </Stack>
          )}
        </Paper>

        {/* RADNO VREME */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" mb={2}>
            Radno vreme
          </Typography>

          <Stack spacing={2}>
            {Object.entries(config.workingHours).map(
              ([day, value]: any) => (
                <Stack
                  key={day}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography sx={{ width: 90 }}>
                    {day.toUpperCase()}
                  </Typography>

                  <TextField
                    type="time"
                    disabled={value.closed}
                    value={value.open}
                    onChange={(e) =>
                      updateWorkingHour(day, 'open', e.target.value)
                    }
                  />

                  <TextField
                    type="time"
                    disabled={value.closed}
                    value={value.close}
                    onChange={(e) =>
                      updateWorkingHour(day, 'close', e.target.value)
                    }
                  />

                  <Button
                    size="small"
                    variant={value.closed ? 'contained' : 'outlined'}
                    onClick={() =>
                      updateWorkingHour(day, 'closed', !value.closed)
                    }
                  >
                    {value.closed ? 'Zatvoreno' : 'Otvoreno'}
                  </Button>
                </Stack>
              )
            )}
          </Stack>
        </Paper>

        {/* SAVE */}
        <Box textAlign="right">
          <Button
            variant="contained"
            disabled={!hasChanges || updateShop.isPending}
            onClick={saveConfig}
          >
            Sačuvaj izmene
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
