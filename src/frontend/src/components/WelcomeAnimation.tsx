import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "frovely_welcomed";

// Petal / particle configuration — pure CSS animation, no library
const PETALS = [
  {
    id: "p1",
    size: 10,
    color: "oklch(0.87 0.06 355)",
    delay: "0s",
    left: "44%",
    duration: "1.6s",
  },
  {
    id: "p2",
    size: 8,
    color: "oklch(0.91 0.05 355)",
    delay: "0.2s",
    left: "52%",
    duration: "1.8s",
  },
  {
    id: "p3",
    size: 12,
    color: "oklch(0.82 0.08 355)",
    delay: "0.4s",
    left: "38%",
    duration: "1.4s",
  },
  {
    id: "p4",
    size: 7,
    color: "oklch(0.72 0.12 355)",
    delay: "0.1s",
    left: "60%",
    duration: "2.0s",
  },
  {
    id: "p5",
    size: 9,
    color: "oklch(0.87 0.06 355)",
    delay: "0.5s",
    left: "34%",
    duration: "1.7s",
  },
  {
    id: "p6",
    size: 11,
    color: "oklch(0.91 0.05 355)",
    delay: "0.3s",
    left: "56%",
    duration: "1.5s",
  },
  {
    id: "p7",
    size: 6,
    color: "oklch(0.72 0.12 355)",
    delay: "0.6s",
    left: "47%",
    duration: "1.9s",
  },
  {
    id: "p8",
    size: 8,
    color: "oklch(0.82 0.08 355)",
    delay: "0.15s",
    left: "41%",
    duration: "1.6s",
  },
  {
    id: "p9",
    size: 10,
    color: "oklch(0.87 0.06 355)",
    delay: "0.45s",
    left: "63%",
    duration: "2.1s",
  },
  {
    id: "p10",
    size: 7,
    color: "oklch(0.91 0.05 355)",
    delay: "0.25s",
    left: "30%",
    duration: "1.5s",
  },
];

export default function WelcomeAnimation() {
  const [phase, setPhase] = useState<"in" | "visible" | "out" | "done">("in");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check after mount so sessionStorage is always available
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyShown) {
      setPhase("done");
      return;
    }

    // Mark as shown so refreshes within session skip it
    sessionStorage.setItem(SESSION_KEY, "1");

    // Transition: in → visible after overlay appears
    timerRef.current = setTimeout(() => setPhase("visible"), 200);

    // Transition: visible → out after 2.4s
    const outTimer = setTimeout(() => setPhase("out"), 2600);

    // Transition: out → done after fade-out (0.5s)
    const doneTimer = setTimeout(() => setPhase("done"), 3100);

    // Hard safety fallback: force dismiss after 5s no matter what
    const safetyTimer = setTimeout(() => setPhase("done"), 5000);

    return () => {
      clearTimeout(timerRef.current!);
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const dismiss = () => {
    setPhase("out");
    setTimeout(() => setPhase("done"), 500);
  };

  if (phase === "done") return null;

  const isFadingOut = phase === "out";
  const isVisible = phase === "visible" || phase === "out";

  return (
    <div
      aria-hidden="true"
      onClick={dismiss}
      onKeyDown={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ffd6e2 0%, #f8c9d6 50%, #f3b8cb 100%)",
        animation: isFadingOut
          ? "splashOverlayFadeOut 0.5s ease-out forwards"
          : "splashOverlayFadeIn 0.3s ease-out forwards",
        pointerEvents: "all",
        userSelect: "none",
      }}
    >
      {/* Soft radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)",
          animation: isVisible
            ? "frovelySplashIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "none",
          opacity: 0,
        }}
      />

      {/* Floating petals — positioned relative to center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {isVisible &&
          PETALS.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                bottom: "calc(50% - 20px)",
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: p.color,
                opacity: 0,
                animation: `petalFloat ${p.duration} ${p.delay} ease-out forwards`,
              }}
            />
          ))}
      </div>

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          animation: isVisible
            ? "frovelySplashIn 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "none",
          opacity: 0,
        }}
      >
        <img
          src="/assets/uploads/Picsart_25-11-13_12-34-31-937-1.png"
          alt="Frovely"
          style={{
            width: "clamp(160px, 40vw, 280px)",
            height: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 24px rgba(200, 100, 130, 0.25))",
          }}
          onError={(e) => {
            // Fallback: show brand name text if image fails
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement("span");
              fallback.textContent = "Frovely";
              fallback.style.cssText =
                "font-family:'Playfair Display',serif;font-size:clamp(40px,10vw,72px);font-weight:700;color:oklch(0.26 0 0);letter-spacing:0.04em;font-style:italic;";
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      {/* Tagline */}
      {isVisible && (
        <p
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "20px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(12px, 3vw, 15px)",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "oklch(0.40 0.06 355)",
            opacity: 0,
            animation: "welcomeTagline 0.6s 0.6s ease-out forwards",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          Revive Your Scalp. Restore Your Hair.
        </p>
      )}

      {/* Decorative ring */}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            width: "clamp(220px, 55vw, 360px)",
            height: "clamp(220px, 55vw, 360px)",
            borderRadius: "50%",
            border: "1px solid rgba(200, 100, 130, 0.2)",
            opacity: 0,
            animation:
              "frovelySplashIn 1.1s 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
            pointerEvents: "none",
          }}
        />
      )}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            width: "clamp(280px, 70vw, 460px)",
            height: "clamp(280px, 70vw, 460px)",
            borderRadius: "50%",
            border: "1px solid rgba(200, 100, 130, 0.12)",
            opacity: 0,
            animation:
              "frovelySplashIn 1.3s 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
