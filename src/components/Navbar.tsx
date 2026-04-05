
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { MapPin, Flower2 } from "lucide-react";
import { apiGet } from "@/services/api";

const Navbar = () => {
  const location = useLocation();
  const [weather, setWeather] = useState<{ temp: string; location: string } | null>(null);
  const [pollen, setPollen] = useState<{ level: string; index: number } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  // Fetch weather on mount
  useEffect(() => {
    fetch("https://wttr.in/?format=%t|%l&u")
      .then((r) => r.text())
      .then((text) => {
        const [temp, loc] = text.split("|");
        if (temp && loc) {
          const cleanTemp = temp.replace(/^\+/, "");
          const parts = loc.split(",").map((s) => s.trim());
          const shortLoc = parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : parts[0];
          setWeather({ temp: cleanTemp.trim(), location: shortLoc });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch pollen using geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await apiGet<{ level: string | null; index: number | null }>(
            `/pollen?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
          );
          if (data.level && data.index !== null) {
            setPollen({ level: data.level, index: data.index });
          }
        } catch {
          // Silently fail — pollen is nice-to-have
        }
      },
      () => {} // Silently fail if user denies location
    );
  }, []);

  const year = format(new Date(), "yyyy");

  const pollenLower = pollen?.level?.toLowerCase() ?? "";
  const pollenColor =
    pollenLower.includes("high")
      ? "text-red-500"
      : pollenLower === "moderate"
        ? "text-orange-500"
        : "text-green-500";

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-3">
      <div className="mx-auto max-w-7xl rounded-xl bg-muted/60 backdrop-blur-md px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Year */}
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight hover:text-primary transition-colors"
          >
            {year}
          </Link>

          {/* Right: Pollen + Weather + Location */}
          <div className="flex items-center gap-4 text-sm">
            {pollen && (
              <div className="flex items-center gap-1.5">
                <Flower2 className={`h-3.5 w-3.5 ${pollenColor}`} />
                <span className={pollenColor}>{pollen.level}</span>
              </div>
            )}
            {weather ? (
              <div className="flex items-center gap-2">
                <span className="font-medium">{weather.temp}</span>
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{weather.location}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">Loading...</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
