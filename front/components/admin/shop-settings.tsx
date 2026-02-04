'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Chip,
} from '@mui/material';

import { useMyPrintShop } from '@/hooks/useMyPrintShop';
import { useUpdateMyPrintShop } from '@/hooks/useUpdateMyPrintShop';

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

export function ShopSettings() {
  const { data: shop, isLoading } = useMyPrintShop();
  const updateShop = useUpdateMyPrintShop();

  const [config, setConfig] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (shop) {
      setConfig({
        name: shop.name,
        address: shop.address,
        city: shop.city,
        phone: shop.phone,
        email: shop.email,
        isActive: shop.is_active,
        workingHours: apiToUIWorkingHours(shop.working_hours),
      });
    }
  }, [shop]);

  if (isLoading || !config) {
    return <Typography>Učitavanje...</Typography>;
  }

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
    updateShop.mutate({
      name: config.name,
      address: config.address,
      city: config.city,
      phone: config.phone,
      working_hours: uiToApiWorkingHours(config.workingHours),
    });
    setHasChanges(false);
  };

  return (
    <Box maxWidth={900}>
      <Typography variant="h5" mb={3}>
        Podešavanja štamparije
      </Typography>

      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Naziv"
              value={config.name}
              onChange={(e) => updateField('name', e.target.value)}
              fullWidth
            />

            <TextField
              label="Adresa"
              value={config.address}
              onChange={(e) => updateField('address', e.target.value)}
              fullWidth
            />

            <TextField
              label="Grad"
              value={config.city}
              onChange={(e) => updateField('city', e.target.value)}
              fullWidth
            />

            <TextField
              label="Telefon"
              value={config.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              fullWidth
            />

            {/* READ ONLY */}
            <TextField
              label="Email"
              value={config.email}
              disabled
              fullWidth
            />

            <Chip
              label={config.isActive ? 'Aktivna' : 'Neaktivna'}
              color={config.isActive ? 'success' : 'default'}
              sx={{ width: 'fit-content' }}
            />
          </Stack>
        </Paper>

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