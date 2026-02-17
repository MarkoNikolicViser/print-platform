'use client';

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import { AlertCircle } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  needsAttention?: boolean;
}

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  menuItems: MenuItem[];
}

export function AdminSidebar({ activeTab, onTabChange, menuItems }: AdminSidebarProps) {
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
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Tooltip title={item.label} placement="right" disableHoverListener={!isMobile}>
                <ListItemButton
                  disabled={item.disabled}
                  selected={activeTab === item.id}
                  onClick={() => onTabChange(item.id)}
                  sx={{
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    px: isMobile ? 0 : 2,
                    position: 'relative',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, position: 'relative' }}>
                    {item.icon}

                    {item.needsAttention && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -6,
                          width: 10,
                          height: 10,
                          bgcolor: 'error.main',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                  </ListItemIcon>

                  {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, gap: 1 }}>
                      <ListItemText primary={item.label} />
                      {item.needsAttention && (
                        <AlertCircle size={16} color={theme.palette.error.main} />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
