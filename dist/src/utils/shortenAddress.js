export function shortenAddress(address, start = 6, end = 4) {
    if (!address || typeof address !== "string")
        return "";
    if (address.length <= start + end)
        return address;
    const first = address.slice(0, start);
    const last = address.slice(-end);
    return `${first}...${last}`;
}
//# sourceMappingURL=shortenAddress.js.map