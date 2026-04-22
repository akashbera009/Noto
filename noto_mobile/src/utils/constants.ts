export const Constants = {
  // Pagination
  NOTES_PAGE_SIZE: 20,

  // Note constraints
  NOTE_TITLE_MAX_LENGTH: 100,
  NOTE_CONTENT_MAX_LENGTH: 10000,

  // Animation durations (ms)
  ANIMATION: {
    fast: 150,
    normal: 250,
    slow: 400,
    splash: 2000,
  },

  // Toast durations
  TOAST: {
    short: 2000,
    medium: 3500,
    long: 5000,
  },

  // API
  API_TIMEOUT: 15000, // 15s
  RETRY_ATTEMPTS: 3,

  // Search debounce
  SEARCH_DEBOUNCE_MS: 300,
} as const;
