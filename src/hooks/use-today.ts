import { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function parseBuildDate(value: unknown): Date {
  const date = typeof value === "string" ? new Date(value) : new Date(Number.NaN);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Today's date, hydration-safe: the build date (customFields.buildDate) on
 * the server and the first client render, the real date after mount.
 */
export function useToday(): Date {
  const { siteConfig } = useDocusaurusContext();
  const [today, setToday] = useState(() => parseBuildDate(siteConfig.customFields?.buildDate));
  useEffect(() => setToday(new Date()), []);
  return today;
}
