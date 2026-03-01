/**
 * Sponsored link configuration
 * Single source of truth for sponsored/monetization links
 */

interface SponsoredLinkConfig {
  url: string;
  text: string;
}

function getSponsoredLinkConfig(): SponsoredLinkConfig | null {
  // Read from environment variables (set at build time)
  const url = import.meta.env.VITE_SPONSORED_LINK_URL?.trim() || '';
  const text = import.meta.env.VITE_SPONSORED_LINK_TEXT?.trim() || 'Sponsored Link';

  // If URL is missing or empty, return null (no sponsored section will render)
  if (!url) {
    return null;
  }

  return {
    url,
    text,
  };
}

export const sponsoredLinkConfig = getSponsoredLinkConfig();
