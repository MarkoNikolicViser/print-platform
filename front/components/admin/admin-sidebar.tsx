'use client';

import {
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import { BarChart3, ShoppingCart, DollarSign, Settings, Home } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Pregled', icon: <BarChart3 size={20} /> },
  { id: 'orders', label: 'Narudžbine', icon: <ShoppingCart size={20} /> },
  { id: 'pricing', label: 'Cene', icon: <DollarSign size={20} /> },
  { id: 'settings', label: 'Podešavanja', icon: <Settings size={20} /> },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          position: 'relative', // prevents overlay
          width: isMobile ? 64 : 240,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box p={2}>
        <Tooltip title="Nazad na sajt" placement="right" disableHoverListener={!isMobile}>
          <Button
            // variant="outlined"
            fullWidth={!isMobile}
            onClick={() => (window.location.href = '/')}
            sx={{
              mb: 2,
              justifyContent: isMobile ? 'center' : 'flex-start',
              minWidth: 0,
              // px: isMobile ? 0 : 2,
            }}
          >
            <Home size={20} />
            {!isMobile && <Box ml={1}>Nazad na sajt</Box>}
          </Button>
        </Tooltip>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={item.label} placement="right" disableHoverListener={!isMobile}>
                <ListItemButton
                  selected={activeTab === item.id}
                  onClick={() => onTabChange(item.id)}
                  sx={{
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    px: isMobile ? 0 : 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>{item.icon}</ListItemIcon>
                  {!isMobile && <ListItemText primary={item.label} sx={{ ml: 1 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
