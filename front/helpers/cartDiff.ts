
import { OrderItem, SelectedOptions } from '../types';

const IGNORED_KEYS = new Set([
    'createdAt', 'updatedAt', 'publishedAt', 'status_code', 'locale',
    // price fields often server/computed; keep if you really PATCH them:
    // 'unit_price', 'total_price',
]);

function diffSelectedOptions(
    a: SelectedOptions | undefined,
    b: SelectedOptions | undefined,
    basePath: string,
    changes: string[],
): Partial<SelectedOptions> | undefined {
    if (!a && !b) return undefined;
    const oldVal = a ?? {};
    const newVal = b ?? {};
    const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    const out: Partial<SelectedOptions> = {};
    let any = false;

    for (const k of keys) {
        const p = `${basePath}.${k}`;
        if (oldVal[k] !== newVal[k]) {
            changes.push(p);
            out[k] = newVal[k];
            any = true;
        }
    }
    return any ? out : undefined;
}

export function diffCartById(
    initial: OrderItem[],
    current: OrderItem[],
) {
    const byIdA = new Map<number, OrderItem>(initial.map(it => [it.id, it]));
    const byIdB = new Map<number, OrderItem>(current.map(it => [it.id, it]));

    const update: Array<{ id: number; selected_options?: Partial<SelectedOptions>; quantity?: number }> = [];
    const remove: number[] = [];
    const add: OrderItem[] = [];
    const changed: string[] = [];

    // removed & changed
    for (const [id, oldItem] of byIdA) {
        const newItem = byIdB.get(id);
        if (!newItem) {
            remove.push(id);
            changed.push(`[id=${id}]`);
            continue;
        }

        const base = `[id=${id}]`;
        const patch: { id: number; selected_options?: Partial<SelectedOptions>; quantity?: number } = { id };

        // Only compare allowed/interesting fields
        const selPatch = diffSelectedOptions(
            oldItem.selected_options,
            newItem.selected_options,
            `${base}.selected_options`,
            changed,
        );
        if (selPatch && Object.keys(selPatch).length > 0) {
            patch.selected_options = selPatch;
        }

        if (oldItem.quantity !== newItem.quantity) {
            patch.quantity = newItem.quantity;
            changed.push(`${base}.quantity`);
        }

        // Add here if you want to allow unit_price/total_price changes:
        // if (Number(oldItem.unit_price) !== Number(newItem.unit_price)) { ... }
        // if (Number(oldItem.total_price) !== Number(newItem.total_price)) { ... }

        if (patch.selected_options || typeof patch.quantity === 'number') {
            update.push(patch);
        }
    }

    // added
    for (const [id, newItem] of byIdB) {
        if (!byIdA.has(id)) {
            add.push(newItem);
            changed.push(`[id=${id}]`);
        }
    }

    return {
        dirty: update.length > 0 || remove.length > 0 || add.length > 0,
        changed: changed.sort(),
        patch: { update, remove, add },
    };
}
