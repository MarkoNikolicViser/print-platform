'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { strapiService } from '@/services/strapiService';

export default function AuthCallbackPage() {
    const calledRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const handleSSO = async () => {//izbaci logiku sa redirectom na frontu
            try {
                const params = new URLSearchParams(window.location.search);
                const token = params.get('token');
                console.log(token)
                if (token) {
                    localStorage.setItem('jwt', token)
                }
                // router.replace('/store');
            } catch (err) {
                console.error('Error in SSO callback:', err);
            }
        };

        handleSSO();
    }, [router]);

    return null;
}