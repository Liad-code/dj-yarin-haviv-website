// Facebook Pixel type declarations
interface Window {
  fbq?: (
    type: 'track' | 'trackCustom' | 'init',
    eventName: string,
    data?: Record<string, unknown>,
    options?: { eventID?: string }
  ) => void;
  _fbq?: unknown;
}

