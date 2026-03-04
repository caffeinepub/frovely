import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Droplets,
  FlaskConical,
  Leaf,
  Sparkles,
  Star,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const ingredients = [
  {
    icon: <Sparkles className="w-7 h-7 text-primary" />,
    name: "PDRN",
    subtitle: "Polydeoxyribonucleotide",
    description:
      "A next-generation bio-active molecule that supports scalp repair, dramatically improves hydration, and promotes an environment for healthier, stronger hair growth.",
    badge: "Clinically Inspired",
  },
  {
    icon: <Leaf className="w-7 h-7 text-primary" />,
    name: "Rosemary Extract",
    subtitle: "Rosmarinus Officinalis",
    description:
      "A time-honoured botanical powerhouse that stimulates scalp micro-circulation, reinforces hair follicle anchoring, and helps visibly reduce hair thinning over time.",
    badge: "Botanically Derived",
  },
  {
    icon: <FlaskConical className="w-7 h-7 text-primary" />,
    name: "19 Amino Acid Complex",
    subtitle: "Full-spectrum protein blend",
    description:
      "A complete spectrum of 19 essential amino acids that reconstruct the hair's protein matrix from within — strengthening structure, improving elasticity, and adding luminous shine.",
    badge: "Advanced Formula",
  },
];

const benefits = [
  { icon: <Wind className="w-6 h-6" />, label: "Reduce Scalp Flakes" },
  { icon: <Droplets className="w-6 h-6" />, label: "Deep Scalp Hydration" },
  { icon: <Zap className="w-6 h-6" />, label: "Stimulate Hair Growth" },
  { icon: <Sparkles className="w-6 h-6" />, label: "Strengthen Follicles" },
  { icon: <Leaf className="w-6 h-6" />, label: "Cooling Scalp Refresh" },
  {
    icon: <FlaskConical className="w-6 h-6" />,
    label: "Lightweight Daily Formula",
  },
];

const reviews = [
  {
    name: "Mia Chen",
    location: "Seoul-inspired routine",
    rating: 5,
    date: "February 2026",
    review:
      "I've been using the Frovely Scalp Routine Set for 3 weeks and I'm genuinely shocked at the difference. My scalp feels hydrated for the first time ever, and I've noticed so much less flaking. The serum gives this beautiful cooling sensation that I look forward to every morning.",
    verified: true,
  },
  {
    name: "Jisoo Park",
    location: "K-beauty devotee",
    rating: 5,
    date: "January 2026",
    review:
      "I've tried countless haircare products from Korean brands but Frovely is something else entirely. The PDRN formula actually works — my hair fall reduced noticeably in the first two weeks. The entire set feels luxurious from the packaging to the texture.",
    verified: true,
  },
  {
    name: "Sophia Williams",
    location: "Haircare enthusiast",
    rating: 5,
    date: "January 2026",
    review:
      "Worth every penny. My stylist literally commented that my hair looked thicker and shinier before I even told her I'd started a new routine. The conditioner has this silky texture that doesn't weigh your hair down. I'm genuinely impressed.",
    verified: true,
  },
  {
    name: "Emma Rodriguez",
    location: "Beauty editor",
    rating: 5,
    date: "December 2025",
    review:
      "I write about beauty products for a living and Frovely stands up to any premium Korean brand I've reviewed. The rosemary scent is fresh and clean — not overpowering. After 4 weeks I can see new baby hairs along my hairline. This is the real deal.",
    verified: true,
  },
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_KEYS.slice(0, count).map((k) => (
        <Star key={k} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ffd6e2 0%, #f8c9d6 40%, #f3b8cb 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 -z-0"
        style={{
          background: "radial-gradient(circle, #f3b8cb 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 -z-0"
        style={{
          background: "radial-gradient(circle, #ffd6e2 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Decorative circles (2D elements) */}
      <div className="absolute top-20 right-[10%] w-16 h-16 rounded-full border-2 border-white/40 animate-pulse" />
      <div
        className="absolute top-40 right-[20%] w-8 h-8 rounded-full border border-white/30"
        style={{ animation: "float 4s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-40 left-[8%] w-12 h-12 rounded-full bg-white/20"
        style={{ animation: "float 5s ease-in-out infinite reverse" }}
      />
      <div className="absolute top-[30%] left-[5%] w-6 h-6 rounded-full bg-white/30 animate-bounce" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text -- animate in with CSS */}
          <div
            className="space-y-7"
            style={{ animation: "fadeInUp 0.8s ease-out forwards" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full px-4 py-1.5">
              <Leaf className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-body font-semibold tracking-widest uppercase text-primary">
                K-Beauty Science
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-[#333333]">
              Revive Your Scalp.
              <br />
              <em className="italic font-medium text-primary">
                Restore Your Hair.
              </em>
            </h1>

            <p className="font-body text-base sm:text-lg text-[#555555] leading-relaxed max-w-md">
              Frovely's PDRN + Rosemary scalp care routine harnesses
              scientifically inspired ingredients to strengthen hair, stimulate
              growth, and restore scalp health from the root up.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 font-body font-semibold px-8 rounded-full shadow-lg text-base transition-all duration-300 hover:scale-105"
                  data-ocid="hero.primary_button"
                >
                  Shop Now
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/40 text-primary bg-white/60 hover:bg-white/80 backdrop-blur-sm font-body font-medium px-8 rounded-full text-base transition-all duration-300"
                >
                  Explore Routine
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              {["PDRN Formula", "Rosemary Extract", "19 Amino Acids"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="text-xs font-body text-[#555555] flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Product image with float */}
          <div
            className="flex items-center justify-center"
            style={{ animation: "fadeInUp 1s ease-out 0.2s both" }}
          >
            <div className="relative w-full max-w-lg">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(248,201,214,0.8) 0%, transparent 70%)",
                  transform: "scale(1.1)",
                  filter: "blur(20px)",
                }}
              />
              <img
                src="/assets/generated/hero-product-set.dim_1200x800.jpg"
                alt="Frovely PDRN + Rosemary Scalp Routine Set"
                className="relative z-10 w-full rounded-2xl shadow-2xl"
                style={{ animation: "float 3s ease-in-out infinite" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 z-20"
                style={{ animation: "float 4s ease-in-out infinite reverse" }}
              >
                <p className="font-display text-xs font-semibold text-primary">
                  Best Seller
                </p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 z-20"
                style={{ animation: "float 3.5s ease-in-out 1s infinite" }}
              >
                <p className="font-body text-xs text-muted-foreground">
                  PDRN + Rosemary
                </p>
                <p className="font-display text-sm font-bold text-foreground">
                  $65 · 3-Step Set
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave / fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          background:
            "linear-gradient(to top, oklch(0.98 0.01 355), transparent)",
        }}
      />
    </section>
  );
}

function IngredientsSection() {
  const ref = useScrollReveal();
  return (
    <section className="py-20 md:py-28 bg-white">
      <div
        ref={ref}
        style={{
          opacity: 0,
          transform: "translateY(32px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            The Science Behind
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Key Ingredient Highlights
          </h2>
          <p className="mt-4 font-body text-muted-foreground max-w-xl mx-auto text-base">
            Three powerful actives work in harmony to address scalp health from
            every angle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {ingredients.map((item) => (
            <Card
              key={item.name}
              className="border border-border card-shadow transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-pink"
            >
              <CardContent className="p-7 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <span className="text-xs font-body font-medium px-2.5 py-1 bg-accent rounded-full text-primary whitespace-nowrap flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground italic mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm font-body text-foreground/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const ref = useScrollReveal();
  return (
    <section
      className="py-20 md:py-28"
      style={{
        background: "linear-gradient(135deg, #fff5f8 0%, #ffeef4 100%)",
      }}
    >
      <div
        ref={ref}
        style={{
          opacity: 0,
          transform: "translateY(32px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            What You'll Experience
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Your Complete Hair Revival
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {benefits.map((b, i) => (
            <div
              key={b.label}
              className="flex flex-col items-center text-center gap-3 p-5 bg-white rounded-2xl card-shadow hover:scale-105 transition-all duration-300 cursor-default"
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
              }}
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary">
                {b.icon}
              </div>
              <p className="text-xs font-body font-medium text-foreground leading-snug">
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductHighlight() {
  const ref = useScrollReveal();
  return (
    <section className="py-20 md:py-28 bg-white">
      <div
        ref={ref}
        style={{
          opacity: 0,
          transform: "translateY(32px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-accent/40 rounded-full blur-3xl -z-10" />
            <img
              src="/assets/generated/hero-product-set.dim_1200x800.jpg"
              alt="Frovely Routine Set"
              className="rounded-2xl shadow-pink-lg w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold">
              Best Seller
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-snug">
              The Complete Scalp Routine
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed text-base">
              Our signature 3-step routine pairs PDRN technology with rosemary's
              restorative power to create a scalp environment where hair can
              truly thrive. Includes everything you need for a complete daily
              ritual.
            </p>
            <ul className="space-y-3">
              {[
                "Rosemary PDRN Cooling Thickening Shampoo (400ml)",
                "Rosemary PDRN Hair & Scalp Conditioner (250ml)",
                "Rosemary PDRN Scalp Serum (20ml)",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-body text-foreground"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-foreground">
                $65
              </span>
              <Link to="/products/$id" params={{ id: "frovely-routine-set" }}>
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-7 font-body font-medium transition-all duration-300 hover:scale-105 shadow-pink">
                  Shop the Set
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const ref = useScrollReveal();
  return (
    <section
      className="py-20 md:py-28"
      style={{
        background: "linear-gradient(135deg, #fff0f5 0%, #ffeef4 100%)",
      }}
    >
      <div
        ref={ref}
        style={{
          opacity: 0,
          transform: "translateY(32px)",
          transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
        }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-14">
          <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            Real Results
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            From Our Community
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <StarRating count={5} />
            <span className="font-body text-sm text-muted-foreground">
              4.9/5 · 200+ verified reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <Card
              key={r.name}
              className="border border-border bg-white card-shadow transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-display font-semibold text-base flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground text-sm">
                        {r.name}
                      </p>
                      <p className="text-xs font-body text-muted-foreground">
                        {r.location}
                      </p>
                    </div>
                  </div>
                  {r.verified && (
                    <span className="text-xs font-body font-medium px-2 py-0.5 bg-green-50 text-green-600 rounded-full flex-shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <StarRating count={r.rating} />
                <p className="font-body text-sm text-foreground/80 leading-relaxed">
                  "{r.review}"
                </p>
                <p className="text-xs font-body text-muted-foreground">
                  {r.date}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandStripSection() {
  const items = [
    "PDRN Technology",
    "Korean Beauty Science",
    "Rosemary Extract",
    "Cruelty Free",
    "19 Amino Acids",
    "Clinically Inspired",
    "PDRN Technology",
    "Korean Beauty Science",
    "Rosemary Extract",
    "Cruelty Free",
  ];
  return (
    <div
      className="py-4 overflow-hidden border-y border-border"
      style={{ background: "linear-gradient(90deg, #ffd6e2, #f8c9d6)" }}
    >
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "marquee 20s linear infinite" }}
      >
        {items.map((item, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: marquee items
            key={i}
            className="font-body text-sm font-medium text-primary flex items-center gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <BrandStripSection />
        <IngredientsSection />
        <BenefitsSection />
        <ProductHighlight />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}
