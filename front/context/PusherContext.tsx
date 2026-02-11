'use client';

import Pusher from 'pusher-js';
import { createContext, useEffect, useState, ReactNode } from 'react';

export const PusherContext = createContext<Pusher | null>(null);

export const PusherProvider = ({ children }: { children: ReactNode }) => {
    const [pusher, setPusher] = useState<Pusher | null>(null);

    useEffect(() => {
        const p = new Pusher('0b9b3b0d66441f14597d', {
            cluster: 'eu',
            forceTLS: true,
            authEndpoint: 'strapi/pusher/auth',
            authTransport: 'ajax',
        });

        setPusher(p);

        return () => {
            p.disconnect();
            setPusher(null);
        };
    }, []);

    return <PusherContext.Provider value={pusher}>{children}</PusherContext.Provider>;
};
