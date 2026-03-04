import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Droplets,
  FlaskConical,
  Leaf,
  Minus,
  Plus,
  Sparkles,
  Star,
  Wind,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

// All product data is static — no backend call needed, instant load
const STATIC_PRODUCTS: Record<
  string,
  {
    name: string;
    price: string;
    priceCents: number;
    image: string;
    description: string;
    includes?: string[];
    ingredients?: {
      icon: React.ReactNode;
      name: string;
      description: string;
    }[];
    benefits?: { icon: React.ReactNode; label: string }[];
    reviews?: { name: string; rating: number; text: string; date: string }[];
  }
> = {
  "frovely-routine-set": {
    name: "Frovely PDRN + Rosemary Scalp Routine Set",
    price: "65.00",
    priceCents: 6500,
    image: "/assets/generated/hero-product-set.dim_1200x800.jpg",
    description:
      "Transform your scalp health with our complete 3-step PDRN + Rosemary Routine. This expertly curated set addresses scalp concerns from every angle — nourishing dry, flaky scalps, strengthening weakened hair roots, improving micro-circulation for better nutrient delivery, and creating the ideal environment for thick, lustrous hair growth.",
    includes: [
      "Rosemary PDRN Cooling Thickening Shampoo (400ml)",
      "Rosemary PDRN Hair & Scalp Conditioner (250ml)",
      "Rosemary PDRN Scalp Serum (20ml)",
    ],
    ingredients: [
      {
        icon: <Sparkles className="w-5 h-5 text-primary" />,
        name: "PDRN (Polydeoxyribonucleotide)",
        description:
          "Supports scalp cellular repair, improves hydration retention, and promotes a healthy scalp environment for stronger hair growth.",
      },
      {
        icon: <Leaf className="w-5 h-5 text-primary" />,
        name: "Rosemary Extract",
        description:
          "Stimulates scalp micro-circulation, supports stronger hair follicle anchoring, and helps visibly reduce seasonal hair thinning.",
      },
      {
        icon: <FlaskConical className="w-5 h-5 text-primary" />,
        name: "19 Amino Acid Complex",
        description:
          "Reconstructs hair's protein structure, improves elasticity, reduces breakage, and restores natural softness and luminous shine.",
      },
    ],
    benefits: [
      { icon: <Wind className="w-5 h-5" />, label: "Reduces Scalp Flakes" },
      { icon: <Droplets className="w-5 h-5" />, label: "Deep Scalp Hydration" },
      { icon: <Zap className="w-5 h-5" />, label: "Stimulates Hair Growth" },
      {
        icon: <Sparkles className="w-5 h-5" />,
        label: "Strengthens Follicles",
      },
      { icon: <Leaf className="w-5 h-5" />, label: "Cooling Scalp Refresh" },
      {
        icon: <FlaskConical className="w-5 h-5" />,
        label: "Lightweight Daily Formula",
      },
    ],
    reviews: [
      {
        name: "Mia C.",
        rating: 5,
        text: "My scalp feels completely transformed. Less flaking, more moisture, and I've noticed new baby hairs appearing after just 4 weeks.",
        date: "February 2026",
      },
      {
        name: "Jisoo P.",
        rating: 5,
        text: "This set genuinely rivals the best Korean salon treatments I've had. The cooling serum is absolutely divine.",
        date: "January 2026",
      },
      {
        name: "Emma R.",
        rating: 5,
        text: "I was skeptical about the price but it's completely worth it. My hair stylist noticed the difference before I even mentioned I'd started a new routine.",
        date: "January 2026",
      },
      {
        name: "Hana K.",
        rating: 5,
        text: "After two weeks of use I already saw less hair in the shower drain. The shampoo lathers beautifully and leaves my scalp feeling so clean without dryness.",
        date: "December 2025",
      },
      {
        name: "Sora L.",
        rating: 5,
        text: "The rosemary cooling sensation is unlike anything I've felt in a shampoo. Feels like a spa treatment every morning. My hair is visibly thicker.",
        date: "December 2025",
      },
      {
        name: "Priya N.",
        rating: 5,
        text: "Worth every penny. I've tried so many Korean haircare brands and this is honestly the best scalp serum I've used. My scalp is no longer oily by midday.",
        date: "November 2025",
      },
    ],
  },
  "frovely-duo": {
    name: "Frovely Rosemary PDRN Shampoo + Conditioner Duo",
    price: "49.00",
    priceCents: 4900,
    image: "/assets/generated/duo-product.dim_800x800.jpg",
    description:
      "An ideal entry into the Frovely ecosystem, the Rosemary PDRN Duo pairs our bestselling shampoo and conditioner for a streamlined daily ritual. Perfect for those seeking daily scalp care without the full routine, or as a complement to your existing hair care regimen.",
    benefits: [
      { icon: <Droplets className="w-5 h-5" />, label: "Deep Hydration" },
      { icon: <Zap className="w-5 h-5" />, label: "Improves Volume" },
      { icon: <Sparkles className="w-5 h-5" />, label: "Reduces Breakage" },
      { icon: <Leaf className="w-5 h-5" />, label: "Healthy Shine" },
      { icon: <Wind className="w-5 h-5" />, label: "Scalp Balance" },
      { icon: <FlaskConical className="w-5 h-5" />, label: "Strengthens Hair" },
    ],
    reviews: [
      {
        name: "Sophie K.",
        rating: 5,
        text: "The duo is perfect for my morning routine. My hair has never felt this soft and the volume improvement is real.",
        date: "February 2026",
      },
      {
        name: "Lily T.",
        rating: 5,
        text: "I started with the duo before investing in the full set. Absolutely worth it — my hair is noticeably shinier and less prone to breakage.",
        date: "January 2026",
      },
      {
        name: "Yuna M.",
        rating: 5,
        text: "Finally found a shampoo and conditioner that work together perfectly. My scalp feels balanced and my ends are no longer dry.",
        date: "January 2026",
      },
      {
        name: "Chloe B.",
        rating: 5,
        text: "The conditioner is so lightweight yet so moisturizing. No more heavy product buildup. Hair feels clean and bouncy all day.",
        date: "December 2025",
      },
    ],
  },
};

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((idx) => (
        <Star
          key={idx}
          className={`w-4 h-4 ${idx < count ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = STATIC_PRODUCTS[id];
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <div className="text-center" data-ocid="product.error_state">
            <p className="font-body text-muted-foreground">
              Product not found.
            </p>
            <Link
              to="/products"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalPrice = ((product.priceCents * quantity) / 100).toFixed(2);

  const handleBuyNow = () => {
    navigate({
      to: "/checkout",
      search: { productId: id, quantity: String(quantity) },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            data-ocid="product.back.link"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Hero — sticky image + scrollable info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Sticky image column — sticky container must NOT have transform applied
                directly to it. The float animation lives on the inner wrapper instead. */}
            <div className="lg:sticky lg:top-24 self-start">
              {/* Inner wrapper carries the float so sticky positioning is unaffected */}
              <div style={{ animation: "float 4s ease-in-out infinite" }}>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-64 h-64 bg-accent/30 rounded-full blur-3xl -z-10 pointer-events-none" />
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full rounded-2xl shadow-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ffd6e2'/%3E%3Ctext x='200' y='210' text-anchor='middle' fill='%23c97d9e' font-size='20' font-family='sans-serif'%3EFrovely%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full border-2 border-primary/20 -z-10" />
                </div>
              </div>

              {/* Trust badges below image on desktop */}
              <div className="hidden lg:flex flex-wrap gap-3 mt-5 text-xs font-body text-muted-foreground justify-center">
                <span className="flex items-center gap-1">
                  🔒 Secure Stripe Checkout
                </span>
                <span className="flex items-center gap-1">🌿 Cruelty-free</span>
                <span className="flex items-center gap-1">
                  ↩ 30-day returns
                </span>
              </div>
            </div>

            {/* Scrollable info column */}
            <div className="space-y-6">
              <div>
                <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                  Frovely
                </span>
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating count={5} />
                <span className="text-sm font-body text-muted-foreground">
                  (4.9) · 200+ reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-foreground">
                  ${product.price}
                </span>
                <span className="text-sm font-body text-muted-foreground">
                  Free shipping on orders over $75
                </span>
              </div>

              {/* Description */}
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Includes */}
              {product.includes && (
                <div className="bg-muted/50 rounded-xl p-5 space-y-3">
                  <h3 className="font-body text-sm font-semibold uppercase tracking-widest text-foreground/60">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {product.includes.map((item) => (
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
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-body text-sm font-medium text-foreground">
                  Quantity
                </span>
                <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label="Decrease quantity"
                    data-ocid="product.quantity.secondary_button"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span
                    className="w-8 text-center font-body font-medium text-foreground text-sm"
                    data-ocid="product.quantity.input"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                    data-ocid="product.quantity.primary_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold text-base shadow-pink transition-all duration-300 hover:scale-105 py-5"
                onClick={handleBuyNow}
                data-ocid="product.buy.primary_button"
              >
                Buy Now — ${totalPrice}
              </Button>

              {/* Trust badges on mobile */}
              <div className="flex lg:hidden flex-wrap gap-3 text-xs font-body text-muted-foreground">
                <span className="flex items-center gap-1">
                  🔒 Secure Stripe Checkout
                </span>
                <span className="flex items-center gap-1">🌿 Cruelty-free</span>
                <span className="flex items-center gap-1">
                  ↩ 30-day returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        {product.ingredients && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="text-center mb-10">
              <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Active Ingredients
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                What's Inside
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-3 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    {ing.icon}
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                    {ing.name}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {ing.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {product.benefits && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="text-center mb-10">
              <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Benefits
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Experience the Difference
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {product.benefits.map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center text-center gap-3 p-4 bg-white rounded-2xl card-shadow hover:scale-105 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-primary">
                    {b.icon}
                  </div>
                  <p className="text-xs font-body font-medium text-foreground leading-snug">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {product.reviews && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="text-center mb-10">
              <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Customer Reviews
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                What Our Customers Say
              </h2>
              {/* Aggregate rating bar */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <StarRating count={5} />
                <span className="font-display text-2xl font-bold text-foreground">
                  4.9
                </span>
                <span className="text-sm font-body text-muted-foreground">
                  / 5 · {product.reviews.length * 33}+ reviews
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.reviews.map((r, i) => (
                <div
                  key={r.name}
                  className="bg-white rounded-2xl p-6 border border-border card-shadow space-y-3 hover:scale-[1.01] transition-all duration-300"
                  data-ocid={`product.reviews.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent flex items-center justify-center text-primary font-display font-bold text-sm flex-shrink-0">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-foreground text-sm">
                        {r.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <StarRating count={r.rating} />
                        <span className="text-xs text-muted-foreground">
                          {r.date}
                        </span>
                      </div>
                    </div>
                    {/* Verified badge */}
                    <span className="ml-auto text-xs bg-green-50 text-green-600 font-body font-medium px-2 py-0.5 rounded-full border border-green-100 flex-shrink-0">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-sm font-body text-foreground/80 leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom CTA after reviews */}
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-accent/40 to-muted/60 rounded-2xl">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Ready to transform your scalp?
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-5">
                Join thousands of customers who've restored their hair health
                with Frovely.
              </p>
              <Button
                className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold px-8 py-5 shadow-pink transition-all duration-300 hover:scale-105"
                onClick={handleBuyNow}
                data-ocid="product.bottom.primary_button"
              >
                Buy Now — ${product.price}
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Sticky Buy Now Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg transition-all duration-300"
        style={{
          transform: showStickyBar ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-body text-xs text-muted-foreground">Frovely</p>
            <p className="font-body font-semibold text-foreground text-sm truncate max-w-[180px] sm:max-w-xs">
              {product.name}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-display font-bold text-foreground text-base">
              ${product.price}
            </span>
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-medium shadow-pink transition-all duration-300 hover:scale-105 px-5"
              onClick={handleBuyNow}
              data-ocid="product.sticky.primary_button"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
