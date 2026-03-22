import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeGlobe from "three-globe";

const THEME_COLORS = ["#f0883e", "#38bdf8", "#4ade80"];

// Major cities with known air quality challenges — arcs represent monitored corridors
const ARC_DATA = [
  // South Asia
  { startLat: 28.6139, startLng: 77.209,   endLat: 19.076,  endLng: 72.8777,  arcAlt: 0.15, color: THEME_COLORS[0] },
  { startLat: 28.6139, startLng: 77.209,   endLat: 31.2304, endLng: 121.4737, arcAlt: 0.4,  color: THEME_COLORS[1] },
  { startLat: 19.076,  startLng: 72.8777,  endLat: 1.3521,  endLng: 103.8198, arcAlt: 0.3,  color: THEME_COLORS[2] },
  // East Asia
  { startLat: 31.2304, startLng: 121.4737, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.15, color: THEME_COLORS[0] },
  { startLat: 35.6762, startLng: 139.6503, endLat: 37.5665, endLng: 126.978,  arcAlt: 0.1,  color: THEME_COLORS[2] },
  { startLat: 39.9042, startLng: 116.4074, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2,  color: THEME_COLORS[1] },
  // Southeast Asia
  { startLat: 1.3521,  startLng: 103.8198, endLat: 13.7563, endLng: 100.5018, arcAlt: 0.2,  color: THEME_COLORS[0] },
  { startLat: 13.7563, startLng: 100.5018, endLat: 10.8231, endLng: 106.6297, arcAlt: 0.1,  color: THEME_COLORS[1] },
  // Europe
  { startLat: 51.5072, startLng: -0.1276,  endLat: 48.8566, endLng: 2.3522,   arcAlt: 0.1,  color: THEME_COLORS[2] },
  { startLat: 48.8566, startLng: 2.3522,   endLat: 52.52,   endLng: 13.405,   arcAlt: 0.1,  color: THEME_COLORS[0] },
  { startLat: 52.52,   startLng: 13.405,   endLat: 41.9028, endLng: 12.4964,  arcAlt: 0.15, color: THEME_COLORS[1] },
  { startLat: 41.9028, startLng: 12.4964,  endLat: 41.0082, endLng: 28.9784,  arcAlt: 0.1,  color: THEME_COLORS[2] },
  // North America
  { startLat: 40.7128, startLng: -74.006,  endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: THEME_COLORS[0] },
  { startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: THEME_COLORS[1] },
  { startLat: 19.4326, startLng: -99.1332, endLat: 40.7128, endLng: -74.006,  arcAlt: 0.3,  color: THEME_COLORS[2] },
  // Africa / Middle East
  { startLat: -1.2921, startLng: 36.8219,  endLat: 30.0444, endLng: 31.2357,  arcAlt: 0.25, color: THEME_COLORS[0] },
  { startLat: 30.0444, startLng: 31.2357,  endLat: 41.0082, endLng: 28.9784,  arcAlt: 0.2,  color: THEME_COLORS[1] },
  // South America
  { startLat: -23.5505, startLng: -46.6333, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.15, color: THEME_COLORS[2] },
  { startLat: -34.6037, startLng: -58.3816, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1,  color: THEME_COLORS[0] },
  // Oceania
  { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521,   endLng: 103.8198, arcAlt: 0.4,  color: THEME_COLORS[1] },
  // Intercontinental
  { startLat: 51.5072, startLng: -0.1276,  endLat: 40.7128,  endLng: -74.006,  arcAlt: 0.25, color: THEME_COLORS[2] },
  { startLat: 55.7558, startLng: 37.6173,  endLat: 39.9042,  endLng: 116.4074, arcAlt: 0.35, color: THEME_COLORS[0] },
  { startLat: 28.6139, startLng: 77.209,   endLat: 51.5072,  endLng: -0.1276,  arcAlt: 0.4,  color: THEME_COLORS[1] },
  { startLat: 34.0522, startLng: -118.2437, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.45, color: THEME_COLORS[2] },
];

export default function GlobeSection({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationId;
    let renderer;
    let controls;
    let globe;

    const init = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      // ── Scene ──────────────────────────────────────────────────────────────
      const scene = new THREE.Scene();

      // ── Camera ─────────────────────────────────────────────────────────────
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
      camera.position.z = 280;

      // ── Renderer ───────────────────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0); // transparent background
      container.appendChild(renderer.domElement);

      // ── Lighting ───────────────────────────────────────────────────────────
      const ambientLight = new THREE.AmbientLight(0x1a1a2e, 3);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
      sunLight.position.set(1, 0.5, 1);
      scene.add(sunLight);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
      fillLight.position.set(-1, -0.5, -1);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xf0883e, 0.25);
      rimLight.position.set(0, 1, -2);
      scene.add(rimLight);

      // ── Globe ──────────────────────────────────────────────────────────────
      globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true })
        .globeImageUrl(
          "/earth-blue-marble.webp"
        )
        .bumpImageUrl(
          "/earth-topology.webp"
        )
        .showAtmosphere(true)
        .atmosphereColor("#f0883e")
        .atmosphereAltitude(0.14)
        .showGraticules(false)
        // Arcs
        .arcsData(ARC_DATA)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor("color")
        .arcAltitude("arcAlt")
        .arcStroke(0.4)
        .arcDashLength(0.5)
        .arcDashGap(0.5)
        .arcDashAnimateTime(2800)
        .arcCurveResolution(64)
        .arcsTransitionDuration(800);

      // Tweak globe material for a darker, moodier look
      globe.onGlobeReady(() => {
        const globeMat = globe.globeMaterial();
        globeMat.shininess = 8;
        globeMat.bumpScale = 6;
      });

      scene.add(globe);

      // ── Orbit Controls ─────────────────────────────────────────────────────
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.6;
      controls.minPolarAngle = Math.PI * 0.3;
      controls.maxPolarAngle = Math.PI * 0.7;

      // ── Animation Loop ─────────────────────────────────────────────────────
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        globe.tick?.();
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // ── Resize Handler ─────────────────────────────────────────────────────
      const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(container);

      // Store cleanup reference
      container._resizeObserver = resizeObserver;
    };

    // Slight delay to ensure the container is painted and has dimensions
    const timeoutId = setTimeout(init, 80);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      container._resizeObserver?.disconnect();
      controls?.dispose();
      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ pointerEvents: "auto" }}
    />
  );
}
