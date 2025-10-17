// Sponsor utility functions

export interface SponsorEntry {
  githubId: string;
  name: string;
  avatarUrl: string;
  tierName?: string;
  formattedAmount: string;
  sinceWhen: string;
  githubUrl: string;
  websiteUrl?: string;
  isSpecial?: boolean;
}

export interface SponsorsData {
  specialSponsors: SponsorEntry[];
  sponsors: SponsorEntry[];
  pastSponsors: SponsorEntry[];
}

// Filter visible sponsors (non-past sponsors)
export function filterVisibleSponsors(
  sponsors: SponsorEntry[],
): SponsorEntry[] {
  return sponsors.filter(
    (sponsor) => !sponsor.sinceWhen.toLowerCase().includes("past"),
  );
}

// Check if sponsor is special
export function isSpecialSponsor(sponsor: SponsorEntry): boolean {
  return sponsor.isSpecial || false;
}

// Sort special sponsors (you can customize this logic)
export function sortSpecialSponsors(sponsors: SponsorEntry[]): SponsorEntry[] {
  return sponsors.sort((a, b) => {
    // Sort by amount (assuming higher amounts are more special)
    const amountA = parseFloat(a.formattedAmount.replace(/[$,]/g, "")) || 0;
    const amountB = parseFloat(b.formattedAmount.replace(/[$,]/g, "")) || 0;
    return amountB - amountA;
  });
}

// Get sponsor URL (website or GitHub)
export function getSponsorUrl(sponsor: SponsorEntry): string {
  return sponsor.websiteUrl || sponsor.githubUrl;
}

// Format sponsor URL for display
export function formatSponsorUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

// Check if should show lifetime total
export function shouldShowLifetimeTotal(sponsor: SponsorEntry): boolean {
  // Show lifetime total for special sponsors or high-tier sponsors
  return (
    sponsor.isSpecial ||
    sponsor.tierName?.toLowerCase().includes("lifetime") ||
    false
  );
}
