# Agent Contracts

## Shared Types

```ts
/** Application configuration */
export interface AppConfig {
  APP_NAME: string;
  APP_SLUG: string;
  BUNDLE_ID: string;
  ANDROID_PACKAGE: string;
  APP_SCHEME: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  REVENUECAT_IOS_KEY?: string;
  REVENUECAT_ANDROID_KEY?: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

/** Authentication response */
export interface AuthResult {
  user: User;
  session: Session;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

/** Analytics event */
export interface AnalyticsEvent {
  name: string;
  payload?: Record<string, any>;
  timestamp?: number;
}

/** Feature flag */
export interface FeatureFlag {
  key: string;
  enabled: boolean;
}

/** API response wrapper */
export interface ApiResponse<T = any> {
  data: T;
  error?: Error;
}

/** Error handling */
export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'AppError';
  }
}
```

These contracts must be imported by all agents to ensure consistent typing.
