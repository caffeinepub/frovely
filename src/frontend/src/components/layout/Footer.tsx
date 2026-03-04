import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="font-display italic text-2xl font-semibold text-foreground">
                Frovely
              </span>
            </div>
            <p className="text-sm font-body text-muted-foreground leading-relaxed max-w-xs">
              Advanced scalp care inspired by Korean beauty science. Revive your
              scalp, restore your hair.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest text-foreground/60">
              Quick Links
            </h4>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                to="/admin"
                className="block text-sm font-body text-foreground/70 hover:text-primary transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-body font-semibold text-sm uppercase tracking-widest text-foreground/60">
              Our Promise
            </h4>
            <div className="space-y-2 text-sm font-body text-foreground/70">
              <p>✓ Scientifically inspired formulas</p>
              <p>✓ Free shipping on orders over $75</p>
              <p>✓ 30-day satisfaction guarantee</p>
              <p>✓ Cruelty-free & vegan ingredients</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground">
            © {currentYear} Frovely. All rights reserved.
          </p>
          <p className="text-xs font-body text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
