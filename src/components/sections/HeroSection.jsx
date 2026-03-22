import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import GlobeSection from "./GlobeSection";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const blobRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const scrollHintRef = useRef(null);                               
  const breathingCircleRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const blob = blobRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const scrollHint = scrollHintRef.current;
    const breathingCircle = breathingCircleRef.current;

    if (!section || !blob || !headline || !subheadline || !scrollHint) return;

    const ctx = gsap.context(() => {
      gsap.set(blob, { scale: 0.85, opacity: 0 });
      gsap.set(headline, { y: 24, opacity: 0 });
      gsap.set(subheadline, { y: 16, opacity: 0 });
      gsap.set(scrollHint, { opacity: 0, y: 10 });

      const entranceTl = gsap.timeline({ delay: 0.2 });
      entranceTl
        .to(blob, { scale: 1, opacity: 1, duration: 0.9, ease: "power2.out" })
        .to(
          headline,
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.5",
        )
        .to(
          subheadline,
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.4",
        )
        .to(
          scrollHint,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3",
        );

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: false,
          scrub: 0.5,
        },
      });

      scrollTl
        .fromTo(
          blob,
          { y: 0, scale: 1, opacity: 1 },
          { y: "-18vh", scale: 1.08, opacity: 0.25, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          [headline, subheadline],
          { y: 0, opacity: 1 },
          { y: "-10vh", opacity: 0.2, ease: "power2.in" },
          0.7,
        )
        .fromTo(
          scrollHint,
          { opacity: 1 },
          { opacity: 0, ease: "power2.in" },
          0.7,
        );

      if (breathingCircle) {
        gsap.to(breathingCircle, {
          scale: 1.2,
          opacity: 0.5,
          duration: 4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--breathe-bg-primary)" }}
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(240,136,62,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Outer glow ring — breathing pulse */}
      <div
        ref={breathingCircleRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-275 max-h-255 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(240,136,62,0.07) 0%, transparent 65%)",
          opacity: 0.3,
        }}
      />

      <div
        ref={blobRef}
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[54vw] h-[54vw] max-w-195 max-h-195"
      >
        <GlobeSection className="w-full h-full" />
      </div>

      {/* Decorative corner blobs */}
      <div
        className="absolute -left-[8vw] -top-[8vh] w-[28vw] h-[28vw] blob animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(240,136,62,0.12) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="absolute -right-[6vw] top-[18vh] w-[18vw] h-[18vw] blob animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(88,166,255,0.10) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute left-[12vw] -bottom-[4vh] w-[22vw] h-[22vw] blob animate-float-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(63,185,80,0.08) 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-275 mx-auto">
        <h1
          ref={headlineRef}
          className="font-heading font-bold text-breathe-text-primary mb-6"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.1,
          }}
        >
          Breathe Better,{" "}
          <span style={{ color: "var(--breathe-accent)" }}>Live Better.</span>
        </h1>

        <p
          ref={subheadlineRef}
          className="text-breathe-text-secondary max-w-180 mx-auto"
          style={{
            fontSize: "clamp(16px, 1.5vw, 20px)",
            lineHeight: 1.65,
          }}
        >
          A gentler way to get around — cleaner air, calmer streets, and
          guidance built for sensitive lungs.
        </p>
      </div>

      {/* Scroll hint */}
      <button
        ref={scrollHintRef}
        onClick={() =>
          document
            .querySelector("#route-planner")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group bg-transparent border-0 p-2"
        aria-label="Scroll to route planner"
      >
        <span
          className="text-sm transition-colors duration-300"
          style={{ color: "var(--breathe-text-secondary)" }}
        >
          Scroll to plan your route
        </span>
        <ChevronDown
          className="w-5 h-5 animate-bounce"
          style={{ color: "var(--breathe-accent)" }}
        />
      </button>
    </section>
  );
}
