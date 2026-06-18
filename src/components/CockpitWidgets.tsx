import { useState, useEffect } from 'react';
import { getAccentHex } from '../utils';

export function UptimeCounter() {
  const [uptime, setUptime] = useState({ d: 0, h: 0, m: 0, s: 0, ms: 0 });

  useEffect(() => {
    let savedInception = localStorage.getItem("codeoven_uptime_inception");
    if (!savedInception) {
      savedInception = "2021-01-01T00:00:00Z";
      localStorage.setItem("codeoven_uptime_inception", savedInception);
    }
    const epoch =
      new Date(savedInception).getTime() ||
      new Date("2021-01-01T00:00:00Z").getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - epoch;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor(diff % 1000);

      setUptime({ d, h, m, s, ms });
    }, 45); // rapid millisecond update rate

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="block text-white font-black font-mono">
      {uptime.d}D {uptime.h}H {uptime.m}M {uptime.s}S {uptime.ms}MS
    </span>
  );
}

interface LocalDateTimeIndicatorProps {
  accentColor: string;
}

export function LocalDateTimeIndicator({ accentColor }: LocalDateTimeIndicatorProps) {
  const [localDateTime, setLocalDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");

      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());

      let tz = "";
      try {
        const parts = new Intl.DateTimeFormat("en", {
          timeZoneName: "short",
        }).formatToParts(now);
        const tzPart = parts.find((p) => p.type === "timeZoneName");
        if (tzPart) tz = tzPart.value;
      } catch (e) {
        // Fallback
      }

      const formatted = `${year}-${month}-${day} @ ${hours}:${minutes}:${seconds}${tz ? ` (${tz})` : ""}`;
      setLocalDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="block font-black font-mono"
      style={{ color: getAccentHex(accentColor as any) }}
    >
      {localDateTime || "LOADING_DATETIME..."}
    </span>
  );
}

export function PingIndicator() {
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing((prev) =>
        Math.max(14, Math.min(48, prev + (Math.random() > 0.5 ? 2 : -2))),
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="block text-[#00D4FF] font-black">
      {ping}ms (ENUGU_NODE)
    </span>
  );
}
