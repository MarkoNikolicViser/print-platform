'use client';

import { Button, Menu, MenuItem, alpha, Typography } from '@mui/material';
import { Globe } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'sr', label: 'Srpski (RS)' },
  { code: 'en', label: 'English (EN)' },
  { code: 'ru', label: 'Русский (RU)' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  const currentLangCode = i18n.language || 'sr';

  return (
    <>
      <Button
        onClick={handleClick}
        color="inherit"
        sx={{
          minWidth: 'auto',
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          color: 'text.secondary',
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main',
          },
        }}
      >
        <Globe size={18} style={{ marginRight: 6 }} />
        <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
          {currentLangCode.substring(0, 2)}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={currentLangCode.startsWith(lang.code)}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
