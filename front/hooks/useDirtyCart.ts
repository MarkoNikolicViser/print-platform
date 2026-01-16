
// useDirtyCart.ts
import * as React from 'react';
import { OrderItem } from '../types';
import { diffCartById } from '../helpers/cartDiff';

export function useDirtyCart(initialItems: OrderItem[], editedItems: OrderItem[]) {
    const initialRef = React.useRef<OrderItem[]>([]);
    const initialized = React.useRef(false);

    // Set initial only when the "server" data changes for the first time (or after accept/reset):
    React.useEffect(() => {
        if (!initialized.current) {
            initialRef.current = structuredClone(initialItems);
            initialized.current = true;
        }
    }, [initialItems]);

    const result = React.useMemo(
        () => diffCartById(initialRef.current, editedItems),
        [editedItems],
    );

    const reset = React.useCallback(() => {
        // accept current as clean
        initialRef.current = structuredClone(editedItems);
    }, [editedItems]);

    const hardResetToServer = React.useCallback(() => {
        // discard edits and go back to server initial
        initialRef.current = structuredClone(initialItems);
    }, [initialItems]);

    return { ...result, reset, hardResetToServer, initial: initialRef.current };
}
