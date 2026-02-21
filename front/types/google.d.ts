export {};

declare global {
  interface GoogleCredentialResponse {
    credential: string;
    clientId?: string;
    select_by?: string;
  }

  interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    ux_mode?: 'popup' | 'redirect';
    login_uri?: string;
    state_cookie_domain?: string;
  }

  interface GoogleAccountsId {
    initialize: (config: GoogleIdConfiguration) => void;
    prompt: (momentListener?: (notification: unknown) => void) => void;
    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
    disableAutoSelect: () => void;
  }

  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}
