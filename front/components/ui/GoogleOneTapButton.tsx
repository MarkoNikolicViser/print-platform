'use client';

import { useState } from 'react';
import { Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_URI, STRAPI_REDIRECT_URI } from '@/helpers/constants';
import Spinner from './spinner';

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleOneTapButton() {
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCredentialResponse = async (response: any) => {
        setLoading(true);
        try {
            const idToken = response.credential;

            const res = await fetch(`${API_URL}/auth/google/one-tap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken, role: 'user' }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

        } catch (err) {
            console.error('One Tap login failed:', err);
            redirectToClassicGoogleSSO();
        }
    };

    const redirectToClassicGoogleSSO = () => {
        const options = {
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: STRAPI_REDIRECT_URI,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'select_account',
            state: JSON.stringify({ app_role: 'customer' })
        };

        const queryString = new URLSearchParams(options).toString();
        window.location.href = `${GOOGLE_URI}?${queryString}`;
    };

    const handleOneTapClick = () => {
        setLoading(true);
        if (!window.google) {
            console.error('Google script not loaded yet');
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
                redirectToClassicGoogleSSO();
            }
        });
    };

    return (
        <Button
            onClick={handleOneTapClick}
            disabled={loading}
            sx={{
                // width: 90,
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '&.Mui-disabled': {
                    bgcolor: '#fff',
                    color: 'rgba(0,0,0,0.87)',
                    opacity: 1, // uklanja fade efekat
                }
            }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <GoogleIcon />
                {loading ? <Spinner size={20} fullScreen={false} /> : 'Login'}
            </Box>

        </Button>
    );
}
