import { PusherContext } from '@/context/PusherContext';
import { useContext, useEffect } from 'react';

type OrderNotification = {
    orderId: number;
    orderCode: string;
    total: number;
};

export function useOrderNotifications(
    callback: (order: OrderNotification) => void
) {
    const { pusher, printShopId } = useContext(PusherContext);

    useEffect(() => {
        if (!pusher || !printShopId) return;

        const channelName = `private-print-shop-${printShopId}`;
        const channel = pusher.subscribe(channelName);

        const handler = (data: OrderNotification) => callback(data);

        channel.bind('new-order', handler);

        channel.bind('pusher:subscription_succeeded', () =>
            console.log('✅ SUBSCRIBED')
        );

        channel.bind('pusher:subscription_error', (err: any) =>
            console.error('❌ SUB ERROR', err)
        );

        return () => {
            channel.unbind('new-order', handler);
            pusher.unsubscribe(channelName);
        };
    }, [pusher, printShopId, callback]);
}
