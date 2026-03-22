import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Flag,
  ArrowRight,
  Wind,
  TrendingUp,
  VolumeX,
  LocateFixed,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { fetchRoutesData } from "../../api/routeApi";
import { geocodeAddress } from "../../api/geocodeApi";
import MapModal from "../MapView/MapModal";

gsap.registerPlugin(ScrollTrigger);

const FEATURE_PILLS = [
  {
    id: "air",
    icon: Wind,
    label: "Air quality",
    color: "#f0883e",
    bg: "rgba(240,136,62,0.08)",
    activeBg: "rgba(240,136,62,0.16)",
  },
  {
    id: "elevation",
    icon: TrendingUp,
    label: "Elevation",
    color: "#58a6ff",
    bg: "rgba(88,166,255,0.08)",
    activeBg: "rgba(88,166,255,0.16)",
  },
  {
    id: "quiet",
    icon: VolumeX,
    label: "Quiet streets",
    color: "#3fb950",
    bg: "rgba(63,185,80,0.08)",
    activeBg: "rgba(63,185,80,0.16)",
  },
];

export default function RoutePlannerSection() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const inputARef = useRef(null);
  const inputBRef = useRef(null);
  const buttonRef = useRef(null);
  const pillsRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  const [startingPoint, setStartingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null); // null | 'success'
  const [activeFilters, setActiveFilters] = useState([
    "air",
    "elevation",
    "quiet",
  ]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [mapCoords, setMapCoords] = useState(null); // { lat, lng }
  const [showMap, setShowMap] = useState(false);
  const geoCoords = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const title = titleRef.current;
    const inputA = inputARef.current;
    const inputB = inputBRef.current;
    const button = buttonRef.current;
    const pills = pillsRef.current;
    const blob1 = blob1Ref.current;
    const blob2 = blob2Ref.current;

    if (!section || !card || !title || !inputA || !inputB || !button) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.5,
        },
      });

      scrollTl
        .fromTo(
          card,
          { y: "60vh", scale: 0.92, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        )
        .fromTo(
          title,
          { x: "-8vw", opacity: 0 },
          { x: 0, opacity: 1, ease: "none" },
          0.05,
        )
        .fromTo(
          inputA,
          { x: "-10vw", opacity: 0 },
          { x: 0, opacity: 1, ease: "none" },
          0.08,
        )
        .fromTo(
          inputB,
          { x: "10vw", opacity: 0 },
          { x: 0, opacity: 1, ease: "none" },
          0.1,
        )
        .fromTo(
          button,
          { y: "10vh", scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: "none" },
          0.12,
        )
        .fromTo(
          pills,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, ease: "none" },
          0.15,
        )
        .fromTo(
          [blob1, blob2],
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 0.35, ease: "none" },
          0,
        );

      scrollTl
        .to(
          card,
          { y: "-55vh", scale: 0.96, opacity: 0.25, ease: "power2.in" },
          0.7,
        )
        .to(title, { x: "-6vw", opacity: 0.2, ease: "power2.in" }, 0.7)
        .to(inputA, { x: "-8vw", opacity: 0.2, ease: "power2.in" }, 0.7)
        .to(inputB, { x: "8vw", opacity: 0.2, ease: "power2.in" }, 0.7)
        .to(button, { y: "-8vh", opacity: 0.2, ease: "power2.in" }, 0.7)
        .to(pills, { opacity: 0.2, ease: "power2.in" }, 0.7)
        .to([blob1, blob2], { scale: 1.1, opacity: 0, ease: "power2.in" }, 0.7);

      gsap.to(blob1, {
        y: "+=10",
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(blob2, {
        y: "-=10",
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleFilter = (id) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        geoCoords.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setStartingPoint("My current location");
        setLocating(false);
      },
      () => {
        setStartingPoint("Location unavailable");
        setLocating(false);
      },
      { timeout: 6000 },
    );
  };

  const handleFindRoute = async () => {
    if (!startingPoint || !destination) return;
    setIsSearching(true);
    setResult(null);
    setError(null);
    setRoutes(null);
    setMapCoords(null);

    try {
      // Resolve origin coords
      let origin;
      if (geoCoords.current && startingPoint === "My current location") {
        origin = geoCoords.current;
      } else {
        origin = await geocodeAddress(startingPoint);
      }

      // Resolve destination coords
      const dest = await geocodeAddress(destination);

      const data = await fetchRoutesData({
        originLat: origin.lat,
        originLng: origin.lng,
        destLat: dest.lat,
        destLng: dest.lng,
      });

      setRoutes(data);
      setMapCoords(origin);
      setResult("success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStartingPoint("");
    setDestination("");
    setError(null);
    setRoutes(null);
    setMapCoords(null);
    geoCoords.current = null;
  };

  return (
    <section
      ref={sectionRef}
      id="route-planner"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20"
      style={{ backgroundColor: "var(--breathe-bg-primary)" }}
    >
      <div
        ref={blob1Ref}
        className="absolute -left-[10vw] -top-[10vh] w-[34vw] h-[34vw] blob breathe-gradient opacity-0"
      />
      <div
        ref={blob2Ref}
        className="absolute -right-[10vw] -bottom-[12vh] w-[38vw] h-[38vw] blob breathe-gradient opacity-0"
      />

      <div
        ref={cardRef}
        className="relative w-[min(90vw,640px)] breathe-card overflow-hidden"
        style={{ padding: 0 }}
      >
        {/* Top accent bar */}
        <div
          className="w-full h-0.5"
          style={{
            background: "var(--breathe-accent)",
            borderRadius: "8px 8px 0 0",
          }}
        />

        <div className="px-8 pt-7 pb-8 lg:px-10 lg:pt-8 lg:pb-10">
          {/* ── SUCCESS STATE ── */}
          {result === "success" ? (
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: "rgba(45,180,215,0.12)" }}
              >
                <CheckCircle2
                  className="w-7 h-7"
                  style={{ color: "var(--breathe-accent)" }}
                />
              </div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: "var(--breathe-accent)" }}
              >
                Route found
              </p>
              <h2
                className="font-heading font-bold text-breathe-text-primary mb-1"
                style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
              >
                {startingPoint} → {destination}
              </h2>
              <p className="text-breathe-text-secondary text-sm mb-6">
                Optimised for{" "}
                {activeFilters
                  .map((id) => FEATURE_PILLS.find((p) => p.id === id)?.label)
                  .join(", ")}
                .
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleReset}
                  className="flex-1 h-12 rounded-full border-2 text-sm font-medium transition-all duration-300 hover:bg-breathe-border/20"
                  style={{
                    borderColor: "var(--breathe-border)",
                    color: "var(--breathe-text-secondary)",
                  }}
                >
                  Plan another
                </button>
                <button
                  className="flex-1 h-12 breathe-button flex items-center justify-center gap-2 text-sm font-semibold"
                  onClick={() => setShowMap(true)}
                >
                  <span>Open in map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div ref={titleRef} className="mb-5">
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-1"
                  style={{ color: "var(--breathe-accent)" }}
                >
                  Route Planner
                </p>
                <h2
                  className="font-heading font-bold text-breathe-text-primary leading-tight"
                  style={{ fontSize: "clamp(18px, 2.2vw, 26px)" }}
                >
                  Plan a low-pollution route
                </h2>
              </div>

              {/* Inputs */}
              <div className="space-y-2 mb-5">
                {/* From */}
                <div ref={inputARef} className="relative">
                  <div
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--breathe-accent)" }}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Starting point"
                    value={startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    className="w-full pl-11 pr-24 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60 text-sm"
                    style={{ height: "46px" }}
                  />
                  {/* Use my location */}
                  <button
                    onClick={handleUseLocation}
                    disabled={locating}
                    title="Use my location"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                    style={{
                      background: "rgba(240,136,62,0.12)",
                      color: "var(--breathe-accent)",
                      border: "1px solid rgba(240,136,62,0.25)",
                    }}
                  >
                    <LocateFixed
                      className={`w-3 h-3 ${locating ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">
                      {locating ? "Locating…" : "Locate"}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 px-5">
                  <div
                    className="w-px flex-1"
                    style={{ background: "var(--breathe-border)" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "var(--breathe-accent)",
                      opacity: 0.4,
                    }}
                  />
                  <div
                    className="w-px flex-1"
                    style={{ background: "var(--breathe-border)" }}
                  />
                </div>

                {/* To */}
                <div ref={inputBRef} className="relative">
                  <div
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#58a6ff" }}
                  >
                    <Flag className="w-4 h-4" />
                  </div>
                  {destination && (
                    <button
                      onClick={() => setDestination("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-breathe-text-secondary/50 hover:text-breathe-text-secondary transition-colors"
                      aria-label="Clear destination"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-11 pr-10 breathe-input text-breathe-text-primary placeholder:text-breathe-text-secondary/60 text-sm"
                    style={{ height: "46px" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                ref={buttonRef}
                onClick={handleFindRoute}
                disabled={isSearching || !startingPoint || !destination}
                className="w-full breathe-button flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none"
                style={{ height: "46px" }}
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Finding route…</span>
                  </>
                ) : (
                  <>
                    <span>Find the safest route</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Error message */}
              {error && (
                <div
                  className="mt-3 flex items-start gap-2 px-4 py-3 rounded-2xl text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    color: "#f87171",
                  }}
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Filter pills */}
              <div ref={pillsRef} className="mt-5">
                <p className="text-center text-xs text-breathe-text-secondary mb-3">
                  Optimise for
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {FEATURE_PILLS.map(
                    ({ id, icon: Icon, label, color, bg, activeBg }) => {
                      const active = activeFilters.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleFilter(id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                          style={{
                            background: active ? activeBg : bg,
                            color,
                            border: active
                              ? `1px solid ${color}`
                              : "1px solid transparent",
                          }}
                          aria-pressed={active}
                        >
                          <Icon className="w-3 h-3" />
                          {label}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Map modal */}
      {showMap && mapCoords && routes && (
        <MapModal
          routes={routes}
          latitude={mapCoords.lat}
          longitude={mapCoords.lng}
          onClose={() => setShowMap(false)}
        />
      )}
    </section>
  );
}
