// Shows 2026-11-22 as "22 Nov 2026".
export function formatDate(isoDate: string) {
  // Parse as UTC so the date doesn't shift with the visitor's time zone.
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
