# API Contracts

## Supabase Client Wrapper
```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppConfig } from '../agent-contracts';

export const supabase = createClient(AppConfig.SUPABASE_URL, AppConfig.SUPABASE_ANON_KEY) as SupabaseClient;
```

## Analytics Wrapper
```ts
import type { AnalyticsEvent } from '../agent-contracts';

export const analytics = {
  track: (event: AnalyticsEvent) => {
    // Stub implementation – replace with provider in concrete app
    console.log('Analytics event', event);
  },
};
```

## Payments Interface (RevenueCat stub)
```ts
export interface IRevenueCat {
  getEntitlements(): Promise<string[]>;
  purchase(productId: string): Promise<void>;
}

export class RevenueCatClient implements IRevenueCat {
  async getEntitlements() { return []; }
  async purchase(_productId: string) { /* no‑op */ }
}
```

These files define the public API surface the agents will use.
