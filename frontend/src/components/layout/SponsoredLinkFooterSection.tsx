import { sponsoredLinkConfig } from '../../config/sponsoredLink';

/**
 * Conditionally renders a "Sponsored" section in the footer with an external link.
 * Only displays when sponsoredLinkConfig is provided and has a valid URL.
 */
export default function SponsoredLinkFooterSection() {
  // Don't render anything if config is missing or URL is empty
  if (!sponsoredLinkConfig) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">Sponsored:</span>
      <a
        href={sponsoredLinkConfig.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline"
      >
        {sponsoredLinkConfig.text}
      </a>
    </div>
  );
}
