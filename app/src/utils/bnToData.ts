import BN from "bn.js";

export const bnToData = (tweetTimestamp: BN) => {
  const timestampMs: number = tweetTimestamp.toNumber() * 1000;
  const date: Date = new Date(timestampMs);
  return formatDate(date);
};

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);
  const parts = formattedDate.split(", ");
  const [Date, Year, Time] = parts;

  return `${Time} · ${Date}, ${Year}`;
}
