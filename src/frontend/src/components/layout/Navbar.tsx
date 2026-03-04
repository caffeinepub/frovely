import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <ShoppingBag
              className="w-5 h-5 text-primary transition-transform group-hover:scale-110"
              strokeWidth={1.5}
            />
            <span className="font-display italic text-xl md:text-2xl font-semibold text-foreground tracking-wide">
              Frovely
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide"
              data-ocid="nav.home_link"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide"
              data-ocid="nav.products_link"
            >
              Products
            </Link>
            <Link
              to="/admin"
              className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide"
              data-ocid="nav.admin_link"
            >
              Admin
            </Link>
            <Link to="/products">
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 font-body font-medium px-5 rounded-full text-sm shadow-pink transition-all duration-300"
              >
                Shop Now
              </Button>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 py-4 px-2 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-sm font-body font-medium text-foreground/70 hover:text-primary hover:bg-muted rounded-lg transition-all"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.home_link"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-sm font-body font-medium text-foreground/70 hover:text-primary hover:bg-muted rounded-lg transition-all"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.products_link"
            >
              Products
            </Link>
            <Link
              to="/admin"
              className="block px-4 py-3 text-sm font-body font-medium text-foreground/70 hover:text-primary hover:bg-muted rounded-lg transition-all"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.admin_link"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
