'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { API_URL } from '@/helpers/constants';

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleOneTapButton() {
    const [initialized, setInitialized] = useState(false);

    // callback kada Google pošalje credential
    const handleCredentialResponse = async (response: any) => {
        try {
            const idToken = response.credential;

            const res = await fetch(
                `${API_URL}/auth/google/one-tap`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken, role: 'user' }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem('jwt', data.jwt);
            window.location.href = '/store';
        } catch (err) {
            console.error('One Tap login failed:', err);
            // fallback: preusmeri na klasični Google SSO
            redirectToClassicGoogleSSO();
        }
    };

    const redirectToClassicGoogleSSO = () => {
        const options = {
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.NEXT_PUBLIC_STRAPI_REDIRECT_URI!,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'select_account',
            app_role: 'customer',
        };

        const queryString = new URLSearchParams(options).toString();
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;
    };

    const handleOneTapClick = () => {
        if (!window.google) {
            console.error('Google script not loaded yet');
            // fallback odmah ako skripta nije loadovana
            redirectToClassicGoogleSSO();
            return;
        }

        if (!initialized) {
            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });
            setInitialized(true);
        }

        window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // One Tap nije mogao da se prikaže → redirect fallback
                redirectToClassicGoogleSSO();
            }
        });
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
