import * as React from 'react';
import { OrderItem } from '../types';
import { diffCartById } from '../helpers/cartDiff';

function ids(items: OrderItem[]) {
  return items
    .map((i) => i.id)
    .sort()
    .join(',');
}

export function useDirtyCart(initialItems: OrderItem[], editedItems: OrderItem[]) {
  const initialRef = React.useRef<OrderItem[]>([]);
  const prevServerIds = React.useRef<string | null>(null);

  React.useEffect(() => {
    const nextIds = ids(initialItems);

    if (prevServerIds.current !== nextIds) {
      initialRef.current = structuredClone(initialItems);
      prevServerIds.current = nextIds;
    }
  }, [initialItems]);

  const result = React.useMemo(() => diffCartById(initialRef.current, editedItems), [editedItems]);

  const reset = React.useCallback(
    (next?: OrderItem[]) => {
      initialRef.current = structuredClone(next ?? editedItems);
    },
    [editedItems],
  );
  const hardResetToServer = React.useCallback(() => {
    initialRef.current = structuredClone(initialItems);
    prevServerIds.current = ids(initialItems);
  }, [initialItems]);

  return {
    ...result,
    reset,
    hardResetToServer,
    initial: initialRef.current,
  };
}
