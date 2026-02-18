export function shortenAddress(
  address?: string,
  start: number = 6,
  end: number = 4,
): string {
  if (!address || typeof address !== "string") return "";

  if (address.length <= start + end) return address;

  const first = address.slice(0, start);
  const last = address.slice(-end);

  return `${first}...${last}`;
}
