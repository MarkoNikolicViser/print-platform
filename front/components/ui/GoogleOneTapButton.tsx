'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleOneTapButton() {
    const [initialized, setInitialized] = useState(false);

    const handleOneTapClick = () => {
        if (!window.google) return;

        if (!initialized) {
            // Inicijalizacija
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async (response: any) => {
                    const idToken = response.credential;
                    // pošalji token backendu
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/google/one-tap`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: idToken, role: 'user' }),
                        }
                    );
                    const data = await res.json();
                    localStorage.setItem('jwt', data.jwt);
                    window.location.reload();
                },
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            setInitialized(true);
        }

        // Pokreće popup
        window.google.accounts.id.prompt();
    };

    return (
        <Button
            onClick={handleOneTapClick}
            startIcon={<GoogleIcon />}
            sx={{
                textTransform: 'none',
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '-0.3px',
                borderRadius: '999px',
                bgcolor: '#fff',
                color: 'rgba(0,0,0,0.87)',
                border: '1px solid rgba(0,0,0,0.12)',
                px: 2.2,
                py: 0.9,
                minHeight: 40,
            }}
        >
            Login
        </Button>
    );
}
