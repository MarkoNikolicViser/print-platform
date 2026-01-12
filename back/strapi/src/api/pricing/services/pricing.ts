export type PricingRule =
    | {
        pricing_type: 'enum';
        values: Record<string, number>;
    }
    | {
        pricing_type: 'boolean';
        values: Record<'true' | 'false', number>;
    }
    | {
        pricing_type: 'number';
        price_per_unit: number;
    }
    | {
        pricing_type: 'per_page';
        price_per_page: number;
    }
    | {
        pricing_type: 'range';
        ranges: {
            from: number;
            to: number;
            price: number;
        }[];
    };

export interface PricingConfig {
    rules: Record<string, PricingRule>;
}

export interface DocumentMeta {
    pages: number;
}

export interface CalculatePriceInput {
    printShopId: number;
    productTemplate: any;
    pricing: PricingConfig;
    document: DocumentMeta;
    options: Record<string, any>;
}

export async function calculatePrice({
    pricing,
    document,
    options,
}: CalculatePriceInput): Promise<number> {
    let total = 0;
    for (const [optionKey, optionValue] of Object.entries(options)) {
        const rule = pricing.rules?.[optionKey];

        if (!rule) {
            console.warn(`❌ No rule for option: ${optionKey}`);
            continue;
        }

        if (!rule.pricing_type) {
            console.warn(`❌ Missing pricing_type for: ${optionKey}`, rule);
            continue;
        }

        console.log('✔ PRICING:', optionKey, rule.pricing_type, optionValue);

        for (const [optionKey, optionValue] of Object.entries(options)) {
            const rule = pricing.rules?.[optionKey];
            if (!rule) continue;

            switch (rule.pricing_type) {
                case 'enum':
                    total += Number(rule.values[String(optionValue)] || 0);
                    break;

                case 'boolean':
                    total += Number(
                        rule.values[String(Boolean(optionValue)) as 'true' | 'false'] || 0
                    );
                    break;

                case 'number':
                    total += Number(rule.price_per_unit || 0) * Number(optionValue || 0);
                    break;

                case 'per_page':
                    total +=
                        Number(rule.price_per_page || 0) *
                        Number(document.pages || 0);
                    break;

                case 'range': {
                    const match = rule.ranges.find(
                        (r) =>
                            document.pages >= r.from &&
                            document.pages <= r.to
                    );

                    if (match) {
                        total += Number(match.price);
                    }
                    break;
                }
            }
        }

        return total;
    }
