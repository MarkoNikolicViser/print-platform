"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Bell, Settings, LogOut, User } from "lucide-react";

export function AdminHeader() {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md")); // md = 960px

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: 2,
        borderColor: "primary.main",
        bgcolor: "background.default",
      }}
    >
      <Toolbar sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width={32}
              height={32}
              bgcolor="primary.main"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                fontWeight="bold"
                color="primary.contrastText"
              >
                PS
              </Typography>
            </Box>
            {!isMobileOrTablet && (
              <Box>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  PrintSerbia Admin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Copy Centar Beograd
                </Typography>
              </Box>
            )}
          </Box>
          {!isMobileOrTablet && (
            <Chip
              label="Aktivno"
              size="small"
              sx={{ bgcolor: "#C8E6C9", color: "#1B5E20" }}
            />
          )}
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton size="small" color="default">
            <Badge badgeContent={3} color="error">
              <Bell size={18} />
            </Badge>
          </IconButton>
          {isMobileOrTablet ? (
            <>
              <IconButton size="small" color="default">
                <User size={18} />
              </IconButton>
              <IconButton size="small" color="default">
                <Settings size={18} />
              </IconButton>
              <IconButton size="small" color="default">
                <LogOut size={18} />
              </IconButton>
            </>
          ) : (
            <>
              <Button variant="text" size="small" startIcon={<User size={18} />}>
                Marko Petrović
              </Button>
              <Button variant="text" size="small" startIcon={<Settings size={18} />}>
                Podešavanja
              </Button>
              <Button variant="outlined" size="small" startIcon={<LogOut size={18} />}>
                Odjavi se
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}