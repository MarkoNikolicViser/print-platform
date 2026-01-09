"use client";

import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Skeleton,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ImageIcon from "@mui/icons-material/Image";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import { useEffect, useState, ReactElement } from "react";
import { useProductTemplatesByMime } from "../hooks/useProductTemplatesByMime";

/* ---------------- ICON MAP ---------------- */

type IconKey =
    | "description"
    | "aspect_ratio"
    | "checkroom"
    | "local_cafe"
    | "image"
    | "wallpaper";

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
};

type Template = {
    id: number;
    name: string;
    description: string;
    icon: IconKey;
};

/* ---------------- DUMMY DATA ---------------- */

const dummyTemplates: Template[] = [
    {
        id: 1,
        name: "Stampa na Papiru",
        description: "Stampa na papiru",
        icon: "description",
    },
    {
        id: 2,
        name: "Vizit karta",
        description: "Stampa vizit karte",
        icon: "aspect_ratio",
    },
    {
        id: 3,
        name: "Print na majici",
        description: "Stampa na majici",
        icon: "checkroom",
    },
    {
        id: 4,
        name: "Print na šolji",
        description: "Stampa na šolji",
        icon: "local_cafe",
    },
    {
        id: 5,
        name: "Poster",
        description: "Stampa postera",
        icon: "wallpaper",
    },
    {
        id: 6,
        name: "Fotografija",
        description: "Stampa fotografija",
        icon: "image",
    },
];

/* ---------------- SKELETON ---------------- */

function TemplateSkeleton() {
    return (
        <Card>
            <CardContent sx={{ textAlign: "center" }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mx: "auto" }} />
                <Skeleton variant="text" width="60%" sx={{ mx: "auto", mt: 1 }} />
                <Skeleton variant="text" width="80%" sx={{ mx: "auto" }} />
            </CardContent>
        </Card>
    );
}

/* ---------------- COMPONENT ---------------- */

export function PrintTypeSelector({
    fileUploaded,
    documentMime,
}: Props) {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

    const {
        data: templates = [],
        isLoading,
    } = useProductTemplatesByMime(
        documentMime, fileUploaded
    );

    const showSkeletons = fileUploaded && isLoading;
    const templatesToRender = !fileUploaded
        ? dummyTemplates
        : templates

    /* Reset selection when file is removed */
    useEffect(() => {
        if (!fileUploaded) {
            setSelectedTemplate(null);
        }
    }, [fileUploaded]);

    return (
        <Grid container spacing={2}>
            {showSkeletons
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                        <TemplateSkeleton />
                    </Grid>
                ))
                : templatesToRender.map((template) => {
                    const isSelected = selectedTemplate === template.id;

                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                            <Card
                                variant={isSelected ? "outlined" : undefined}
                                sx={{
                                    border: isSelected
                                        ? "2px solid #1976d2"
                                        : "1px solid transparent",
                                    opacity: fileUploaded ? 1 : 0.6,
                                    transition: "0.2s",
                                }}
                            >
                                <CardActionArea
                                    disabled={!fileUploaded}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <CardContent sx={{ textAlign: "center" }}>
                                        {iconMap[template.icon] ?? (
                                            <DescriptionIcon fontSize="large" />
                                        )}

                                        <Typography variant="h6" mt={1}>
                                            {template.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {template.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    );
                })}
        </Grid>
    );
}
