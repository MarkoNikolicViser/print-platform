'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  Stack,
  IconButton,
} from '@mui/material';
import { useRef } from 'react';

type Props = {
  templates: TemplateWithPricing[];
  selectedTemplate: TemplateWithPricing | null;
  onSelect: (template: TemplateWithPricing) => void;
  isLoading?: boolean;
};

function TemplateSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </CardContent>
    </Card>
  );
}

export function PricingTemplateSelector({
  templates,
  selectedTemplate,
  onSelect,
  isLoading,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <TemplateSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box position="relative">
      {/* LEFT ARROW */}
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          position: 'absolute',
          left: -20,
          top: '40%',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {/* SCROLL AREA */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <Card
              key={template.id}
              sx={{
                minWidth: 300,
                flexShrink: 0,
                border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                opacity: template.pricing?.is_active === false ? 0.7 : 1,
              }}
            >
              <CardActionArea onClick={() => onSelect(template)}>
                <CardContent>
                  {/* HEADER */}
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h6">{template.name}</Typography>

                    <Stack direction="row" spacing={1}>
                      {template.has_pricing && (
                        <Chip
                          size="small"
                          label={template.pricing?.is_active ? 'Active' : 'Inactive'}
                          color={template.pricing?.is_active ? 'success' : 'error'}
                          variant="outlined"
                        />
                      )}

                      <Chip
                        size="small"
                        label={template.has_pricing ? 'Edit' : 'Create'}
                        color={template.has_pricing ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </Stack>
                  </Box>

                  {/* DESC */}
                  <Typography variant="body2" color="text.secondary">
                    {template.description ?? 'Bez opisa'}
                  </Typography>

                  {/* BASE PRICE PLACEHOLDER */}
                  <Typography
                    variant="caption"
                    display="block"
                    mt={1}
                    sx={{
                      visibility: template.has_pricing ? 'visible' : 'hidden',
                    }}
                  >
                    Base price: <strong>{template.pricing?.base_price ?? 0} RSD</strong>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      {/* RIGHT ARROW */}
      <IconButton
        onClick={() => scroll('right')}
        sx={{
          position: 'absolute',
          right: -20,
          top: '40%',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
}
