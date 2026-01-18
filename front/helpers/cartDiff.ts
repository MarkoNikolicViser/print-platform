import { OrderItem, SelectedOptions } from '../types';

const IGNORED_KEYS = new Set([
    'createdAt',
    'updatedAt',
    'publishedAt',
    'status_code',
    'locale',
]);

function diffSelectedOptions(
    a: SelectedOptions | undefined,
    b: SelectedOptions | undefined,
    basePath: string,
    changes: string[],
): SelectedOptions | undefined {
    if (!a && !b) return undefined;

    const oldVal = a ?? {};
    const newVal = b ?? {};
    const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);

    let any = false;

    for (const k of keys) {
        if (IGNORED_KEYS.has(k)) continue;

        const p = `${basePath}.${k}`;
        if (oldVal[k] !== newVal[k]) {
            changes.push(p);
            any = true;
        }
    }

    if (!any) return undefined;

    // 🔑 merge: stari + novi
    return {
        ...oldVal,
        ...newVal,
    };
}


export function diffCartById(
    initial: OrderItem[],
    current: OrderItem[],
) {
    const byIdInitial = new Map<number, OrderItem>(
        initial.map(it => [it.id, it]),
    );
    const byIdCurrent = new Map<number, OrderItem>(
        current.map(it => [it.id, it]),
    );

    const update: Array<{
        id: number;
        selected_options?: Partial<SelectedOptions>;
        quantity?: number;
    }> = [];

    const remove: number[] = [];
    const changed: string[] = [];

    // removed & updated
    for (const [id, oldItem] of byIdInitial) {
        const newItem = byIdCurrent.get(id);

        if (!newItem) {
            remove.push(id);
            changed.push(`[id=${id}]`);
            continue;
        }

        const base = `[id=${id}]`;
        const patch: {
            id: number;
            selected_options?: Partial<SelectedOptions>;
            quantity?: number;
        } = { id };

        const selPatch = diffSelectedOptions(
            oldItem.selected_options,
            newItem.selected_options,
            `${base}.selected_options`,
            changed,
        );

        if (selPatch) {
            patch.selected_options = selPatch;
        }

        if (oldItem.quantity !== newItem.quantity) {
            patch.quantity = newItem.quantity;
            changed.push(`${base}.quantity`);
        }

        if (
            patch.selected_options !== undefined ||
            patch.quantity !== undefined
        ) {
            update.push(patch);
        }
    }

    // sanity check: new items with id should NOT appear here
    // if they do, it's a bug upstream
    for (const [id] of byIdCurrent) {
        if (!byIdInitial.has(id)) {
            throw new Error(
                `diffCartById: unexpected order_item with id=${id}. ` +
                `Creation must happen outside of diff logic.`,
            );
        }
    }

    return {
        dirty: update.length > 0 || remove.length > 0,
        changed: changed.sort(),
        patch: { update, remove },
    };
}
