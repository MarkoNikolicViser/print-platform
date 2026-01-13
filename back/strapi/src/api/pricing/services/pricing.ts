export type TemplateOption =
    | {
        pricing_type: 'enum';
        component_type: 'select';
        options: { value: string }[];
    }
    | {
        pricing_type: 'boolean';
        component_type: 'checkbox';
    }
    | {
        pricing_type: 'number';
        component_type: 'number';
        min?: number;
        max?: number;
    }
    | {
        pricing_type: 'per_page';
        component_type: 'hidden';
    }
    | {
        pricing_type: 'range';
        component_type: 'hidden';
    };

export interface ProductTemplate {
    allowed_options: Record<string, TemplateOption>;
}
export type PricingRule =
    | {
        values: Record<string, number>;
    }
    | {
        price_per_unit: number;
    }
    | {
        price_per_page: number;
    }
    | {
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
    productTemplate: ProductTemplate;
    pricing: PricingConfig;
    document: DocumentMeta;
    options: Record<string, unknown>;
}
export async function calculatePrice({
    pricing,
    productTemplate,
    document,
    options,
}: CalculatePriceInput): Promise<number> {
    let total = 0;

    const templateOptions = productTemplate.allowed_options;

    for (const [key, rawValue] of Object.entries(options)) {
        const templateRule = templateOptions[key];
        const pricingRule = pricing.rules[key];

        if (!templateRule || !pricingRule) continue;

        switch (templateRule.pricing_type) {
            case 'enum': {
                const value = String(rawValue);
                const rule = pricingRule as { values: Record<string, number> };
                total += rule.values?.[value] ?? 0;
                break;
            }

            case 'boolean': {
                const value = String(Boolean(rawValue));
                const rule = pricingRule as {
                    values: Record<'true' | 'false', number>;
                };
                total += rule.values?.[value] ?? 0;
                break;
            }

            case 'number': {
                const rule = pricingRule as { price_per_unit: number };
                total += rule.price_per_unit * Number(rawValue || 0);
                break;
            }

            case 'per_page': {
                const rule = pricingRule as { price_per_page: number };
                total += rule.price_per_page * (document.pages || 0);
                break;
            }

            case 'range': {
                const rule = pricingRule as {
                    ranges: { from: number; to: number; price: number }[];
                };
                const match = rule.ranges.find(
                    r =>
                        document.pages >= r.from &&
                        document.pages <= r.to
                );
                if (match) total += match.price;
                break;
            }
        }
    }

    return total;
}
