'use client';

import Pusher from 'pusher-js';
import { createContext, useEffect, useState, ReactNode } from 'react';

type PusherContextType = {
    pusher: Pusher | null;
    printShopId?: number;
};

export const PusherContext = createContext<PusherContextType>({
    pusher: null,
    printShopId: undefined,
});

export const PusherProvider = ({
    children,
    printShopId,
}: {
    children: ReactNode;
    printShopId?: number;
}) => {
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

    return (
        <PusherContext.Provider value={{ pusher, printShopId }}>
            {children}
        </PusherContext.Provider>
    );
};
