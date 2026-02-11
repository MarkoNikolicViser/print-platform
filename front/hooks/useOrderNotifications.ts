import { PusherContext } from '@/context/PusherContext';
import { useContext, useEffect } from 'react';

type OrderNotification = {
    orderId: number;
    orderCode: string;
    total: number;
};

export function useOrderNotifications(callback: (order: OrderNotification) => void) {
    const pusher = useContext(PusherContext);

    useEffect(() => {
        if (!pusher) return; // ⬅️ čekaj dok se Pusher inicijalizuje

        const channel = pusher.subscribe('private-print-shop-1');

        const handler = (data: OrderNotification) => callback(data);

        channel.bind('new-order', handler);

        channel.bind('pusher:subscription_succeeded', () => console.log('✅ SUBSCRIBED'));
        channel.bind('pusher:subscription_error', (err: any) => console.error('❌ SUB ERROR', err));

        return () => {
            channel.unbind('new-order', handler);
            pusher.unsubscribe('private-print-shop-1');
        };
    }, [pusher, callback]);
}
