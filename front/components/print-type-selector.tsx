'use client';

import { usePrintContext } from '@/context/PrintContext';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { Grid, Card, CardActionArea, CardContent, Typography, Skeleton, Box, useTheme } from '@mui/material';
import { useEffect, ReactElement } from 'react';
import { useProductTemplatesByMime } from '../hooks/useProductTemplatesByMime';

/* ---------------- ICON MAP ---------------- */

type IconKey = 'description' | 'aspect_ratio' | 'checkroom' | 'local_cafe' | 'image' | 'wallpaper';

const iconMap: Record<IconKey, ReactElement> = {
  description: <DescriptionIcon fontSize="large" />,
  aspect_ratio: <AspectRatioIcon fontSize="large" />,
  checkroom: <CheckroomIcon fontSize="large" />,
  local_cafe: <LocalCafeIcon fontSize="large" />,
  image: <ImageIcon fontSize="large" />,
  wallpaper: <WallpaperIcon fontSize="large" />,
};

/* ---------------- TYPES ---------------- */

type Props = {
  fileUploaded: boolean;
  documentMime?: string;
  uploading: boolean
};

type Template = {
  id: number;
  name: string;
  description: string;
  icon: IconKey;
  allowed_options?: any;
};

/* ---------------- DUMMY DATA ---------------- */

const dummyTemplates: Template[] = [
  {
    id: 1,
    name: 'Stampa na Papiru',
    description: 'Stampa na papiru',
    icon: 'description',
  },
  {
    id: 2,
    name: 'Vizit karta',
    description: 'Stampa vizit karte',
    icon: 'aspect_ratio',
  },
  {
    id: 3,
    name: 'Print na majici',
    description: 'Stampa na majici',
    icon: 'checkroom',
  },
  {
    id: 4,
    name: 'Print na šolji',
    description: 'Stampa na šolji',
    icon: 'local_cafe',
  },
  {
    id: 5,
    name: 'Poster',
    description: 'Stampa postera',
    icon: 'wallpaper',
  },
  {
    id: 6,
    name: 'Fotografija',
    description: 'Stampa fotografija',
    icon: 'image',
  },
];

/* ---------------- SKELETON ---------------- */

function TemplateSkeleton() {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mt: 1 }} />
        <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
      </CardContent>
    </Card>
  );
}

/* ---------------- COMPONENT ---------------- */

export function PrintTypeSelector({ fileUploaded, documentMime, uploading }: Props) {
  const { selectedTemplate, setSelectedTemplate } = usePrintContext();
  const theme = useTheme()
  const { data: templates = [], isLoading } = useProductTemplatesByMime(documentMime, fileUploaded);

  const showSkeletons = fileUploaded && isLoading;
  const templatesToRender = !fileUploaded ? dummyTemplates : templates;

  /* Reset selection when file is removed */
  useEffect(() => {
    if (!fileUploaded) {
      setSelectedTemplate(null);
    }
  }, [fileUploaded]);

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      {showSkeletons || uploading
        ? Array.from({ length: 6 }).map((_, idx) => (
          <Grid size={{ xs: 6, sm: 6, md: 4 }} key={idx}>
            <TemplateSkeleton />
          </Grid>
        ))
        : templatesToRender.map((template) => {
          const isSelected =
            selectedTemplate?.id === template.id;

          return (
            <Grid
              size={{ xs: 6, sm: 6, md: 4 }}
              key={template.id}
            >
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'primary.main'
                    : 'divider',
                  bgcolor: isSelected
                    ? 'primary.50'
                    : 'background.paper',
                  opacity: fileUploaded ? 1 : 0.5,
                  transition: 'all .2s ease',
                  minHeight: 140
                }}
              >
                <CardActionArea
                  disabled={!fileUploaded}
                  onClick={() =>
                    setSelectedTemplate({
                      id: template.id,
                      allowedOptions:
                        template?.allowed_options,
                    })
                  }
                  sx={{
                    py: { xs: 2, sm: 3 },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      p: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1,
                        color: isSelected
                          ? 'primary.main'
                          : 'text.secondary',
                      }}
                    >
                      {iconMap[
                        template.icon as IconKey
                      ] ?? (
                          <DescriptionIcon fontSize="medium" />
                        )}
                    </Box>

                    <Typography
                      fontWeight={700}
                      fontSize={{
                        xs: '0.85rem',
                        sm: '1rem',
                      }}
                    >
                      {template.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'block',
                        },
                        mt: 0.5,
                      }}
                    >
                      {template.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      {fileUploaded && !selectedTemplate && !isLoading && !uploading && (
        <Box
          sx={{
            width: '100%',
            mt: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            color={'red'}
            sx={{ opacity: 0.8, fontWeight: 700 }}
          >
            *Izaberite način štampe kako biste nastavili sa podešavanjem opcija.
          </Typography>
        </Box>
      )}
    </Grid>
  );

}
