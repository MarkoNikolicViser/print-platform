'use client';

import { usePrintContext } from '@/context/PrintContext';
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Chip,
    Tooltip,
} from '@mui/material';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductTemplatesByMime } from '../hooks/useProductTemplatesByMime';

import DescriptionIcon from '@mui/icons-material/Description';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import ImageIcon from '@mui/icons-material/Image';
import WallpaperIcon from '@mui/icons-material/Wallpaper';

import { IconKey } from '@/types';

type UploadedFileLite = {
    id: string;
    type: string;
    status: 'uploading' | 'done' | 'error';
};

type Props = { files: UploadedFileLite[] };

type Template = {
    id: number;
    name: string;
    description: string;
    icon: IconKey;
    allowed_options?: any;
    supported_mime: string | string[];
    is_disabled: boolean;
};

const iconMap: Record<IconKey, ReactElement> = {
    description: <DescriptionIcon fontSize="large" />,
    aspect_ratio: <AspectRatioIcon fontSize="large" />,
    checkroom: <CheckroomIcon fontSize="large" />,
    local_cafe: <LocalCafeIcon fontSize="large" />,
    image: <ImageIcon fontSize="large" />,
    wallpaper: <WallpaperIcon fontSize="large" />,
};

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

export function MultiFilePrintTypeSelector({ files }: Props) {
    const { t } = useTranslation();
    const { setSelectedTemplate, files: contextFiles } = usePrintContext();

    const allDone = files.length > 0 && files.every((f) => f.status === 'done');
    const uniqueMimes = [...new Set(files.map((f) => f.type))];

    const { data: templates = [], isLoading } =
        useProductTemplatesByMime(uniqueMimes, allDone);

    if (!files.length) return null;

    // 👇 template uzimamo iz contexta
    const currentTemplateId = contextFiles[0]?.selectedTemplate?.id ?? null;

    return (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            {isLoading || !allDone
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <Grid size={{ xs: 6, sm: 4, md: 4 }} key={idx}>
                        <TemplateSkeleton />
                    </Grid>
                ))
                : templates.map((template: Template) => {
                    const isSelected = currentTemplateId === template.id;

                    let supportedMimes: string[] = [];

                    if (Array.isArray(template.supported_mime)) {
                        supportedMimes = template.supported_mime;
                    } else if (typeof template.supported_mime === 'string') {
                        try {
                            supportedMimes = JSON.parse(template.supported_mime);
                        } catch {
                            supportedMimes = [];
                        }
                    }

                    const mimeLabels = supportedMimes.map(
                        (mime) => mime.split('/')[1] ?? mime
                    );

                    return (
                        <Grid size={{ xs: 6, sm: 4, md: 4 }} key={template.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'primary.50' : 'background.paper',
                                    transition: 'all .2s ease',
                                    opacity: template.is_disabled ? 0.5 : 1,
                                }}
                            >
                                <Tooltip
                                    title={
                                        template.is_disabled
                                            ? "Neki fajlovi nisu kompatibilni sa ovim tipom štampe."
                                            : ""
                                    }
                                >
                                    <span>
                                        <CardActionArea
                                            disabled={template.is_disabled}
                                            onClick={() => {
                                                if (template.is_disabled) return;

                                                contextFiles.forEach((file) =>
                                                    setSelectedTemplate(file.id, {
                                                        id: template.id,
                                                        allowedOptions: template.allowed_options,
                                                        supportedMime: supportedMimes,
                                                        is_disabled: template.is_disabled,
                                                        description: template.description,
                                                        supported_mime: template.supported_mime as any,
                                                    })
                                                );
                                            }}
                                            sx={{ py: 2 }}
                                        >
                                            <CardContent sx={{ textAlign: 'center' }}>
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
                                                    {iconMap[template.icon] ?? <DescriptionIcon />}
                                                </Box>

                                                <Typography fontWeight={700}>
                                                    {template.name}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {template.description}
                                                </Typography>

                                                <Box
                                                    mt={1}
                                                    display="flex"
                                                    justifyContent="center"
                                                    flexWrap="wrap"
                                                    gap={0.5}
                                                >
                                                    {mimeLabels.map((label, i) => (
                                                        <Chip key={i} size="small" label={label} />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </span>
                                </Tooltip>
                            </Card>
                        </Grid>
                    );
                })}
        </Grid>
    );
}