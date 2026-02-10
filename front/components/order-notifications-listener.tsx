'use client';

import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { toast } from 'react-toastify';

export function OrderNotificationsListener() {
    useOrderNotifications((order) => {
        toast(`🆕 Novi order: ${order.orderCode}, total: ${order.total}€`, { type: 'info' });
    });

    return null;
}
