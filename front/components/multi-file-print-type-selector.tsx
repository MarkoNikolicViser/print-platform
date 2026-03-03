'use client';

import { usePrintContext } from '@/context/PrintContext';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Skeleton,
    Box,
} from '@mui/material';
import { useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductTemplatesByMime } from '../hooks/useProductTemplatesByMime';

/* ---------------- TYPES ---------------- */

type UploadedFileLite = {
    type: string;
    status: 'uploading' | 'done' | 'error';
};

type Props = {
    files: UploadedFileLite[];
};

type IconKey =
    | 'description'
    | 'aspect_ratio'
    | 'checkroom'
    | 'local_cafe'
    | 'image'
    | 'wallpaper';

type Template = {
    id: number;
    name: string;
    description: string;
    icon: IconKey;
    allowed_options?: any;
};

/* ---------------- ICON MAP ---------------- */

const iconMap: Record<IconKey, ReactElement> = {
    description: <DescriptionIcon fontSize="large" />,
    aspect_ratio: <AspectRatioIcon fontSize="large" />,
    checkroom: <CheckroomIcon fontSize="large" />,
    local_cafe: <LocalCafeIcon fontSize="large" />,
    image: <ImageIcon fontSize="large" />,
    wallpaper: <WallpaperIcon fontSize="large" />,
};

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

export function MultiFilePrintTypeSelector({ files }: Props) {
    const { t } = useTranslation();
    const { selectedTemplate, setSelectedTemplate } = usePrintContext();

    const allDone =
        files.length > 0 && files.every((f) => f.status === 'done');

    const uniqueMimes = [...new Set(files.map((f) => f.type))];
    const singleMime = uniqueMimes.length === 1 ? uniqueMimes[0] : null;

    const canFetchTemplates = allDone && !!singleMime;

    const {
        data: templates = [],
        isLoading,
    } = useProductTemplatesByMime(singleMime ?? undefined, canFetchTemplates);

    /* Reset selection if invalid */
    useEffect(() => {
        if (!canFetchTemplates) {
            setSelectedTemplate(null);
        }
    }, [canFetchTemplates]);

    /* ---------------- RENDER ---------------- */

    if (!files.length) return null;

    if (!allDone) {
        return (
            <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                    {t('home.printTypeSelector.waitProcessing')}
                </Typography>
            </Box>
        );
    }

    if (allDone && !singleMime) {
        return (
            <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="error" fontWeight={600}>
                    {t('home.printTypeSelector.mixedTypesWarning')}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <Grid size={{ xs: 6, sm: 6, md: 4 }} key={idx}>
                            <TemplateSkeleton />
                        </Grid>
                    ))
                    : templates.map((template: Template) => {
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
                                        transition: 'all .2s ease',
                                        minHeight: { xs: 110, sm: 130 },
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() =>
                                            setSelectedTemplate({
                                                id: template.id,
                                                allowedOptions:
                                                    template.allowed_options,
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
                                                {iconMap[template.icon] ??
                                                    <DescriptionIcon fontSize="medium" />}
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
            </Grid>

            {allDone &&
                !selectedTemplate &&
                !isLoading && (
                    <Box
                        sx={{
                            width: '100%',
                            mt: 2,
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ fontWeight: 700 }}
                        >
                            {t('home.printTypeSelector.selectTypeWarning')}
                        </Typography>
                    </Box>
                )}
        </>
    );
}