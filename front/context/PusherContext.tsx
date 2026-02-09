'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';

type PusherContextType = {
    pusher: Pusher | null;
    channel: Pusher.Channel | null;
};

const PusherContext = createContext<PusherContextType>({
    pusher: null,
    channel: null,
});

export function PusherProvider({
    printShopId,
    token,
    children,
}: {
    printShopId: number;
    token: string;
    children: React.ReactNode;
}) {
    const pusherRef = useRef<Pusher | null>(null);
    const channelRef = useRef<Pusher.Channel | null>(null);

    useEffect(() => {
        if (!printShopId || !token) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: `${process.env.NEXT_PUBLIC_STRAPI_URL}/pusher/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

        const channelName = `private-print-shop-${printShopId}`;
        const channel = pusher.subscribe(channelName);

        pusherRef.current = pusher;
        channelRef.current = channel;

        return () => {
            if (channel) pusher.unsubscribe(channelName);
            pusher.disconnect();
        };
    }, [printShopId, token]);

    return (
        <PusherContext.Provider
            value={{
                pusher: pusherRef.current,
                channel: channelRef.current,
            }}
        >
            {children}
        </PusherContext.Provider>
    );
}

export function usePusher() {
    return useContext(PusherContext);
}
