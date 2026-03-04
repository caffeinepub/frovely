import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ChevronLeft,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useCreateCheckoutSession, useCreateOrder } from "../hooks/useQueries";

const PRODUCT_MAP: Record<
  string,
  { name: string; priceCents: bigint; image: string; description: string }
> = {
  "frovely-routine-set": {
    name: "Frovely PDRN + Rosemary Scalp Routine Set",
    priceCents: 6500n,
    image: "/assets/generated/hero-product-set.dim_1200x800.jpg",
    description:
      "Includes Rosemary PDRN Cooling Thickening Shampoo (400ml), Rosemary PDRN Hair & Scalp Conditioner (250ml), and Rosemary PDRN Scalp Serum (20ml).",
  },
  "frovely-duo": {
    name: "Frovely Rosemary PDRN Shampoo + Conditioner Duo",
    priceCents: 4900n,
    image: "/assets/generated/duo-product.dim_800x800.jpg",
    description:
      "Daily scalp-care duo — Rosemary PDRN Shampoo (400ml) + Conditioner (250ml).",
  },
};

export default function CheckoutPage() {
  const search = useSearch({ from: "/checkout" }) as Record<string, string>;
  const navigate = useNavigate();

  const productId = search?.productId ?? "frovely-routine-set";
  const quantity = Math.max(1, Number(search?.quantity ?? "1"));

  const product = PRODUCT_MAP[productId] ?? PRODUCT_MAP["frovely-routine-set"];
  const totalCents = product.priceCents * BigInt(quantity);
  const totalDisplay = (Number(totalCents) / 100).toFixed(2);
  const unitPrice = (Number(product.priceCents) / 100).toFixed(2);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsProcessing(true);
    try {
      await createOrder({
        customerName: name,
        email,
        shippingAddress: address,
        productId,
        quantity: BigInt(quantity),
        totalCents,
        stripeSessionId: "",
      });

      const successUrl = `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/products`;

      const stripeUrl = await createCheckoutSession({
        items: [
          {
            productName: product.name,
            currency: "usd",
            quantity: BigInt(quantity),
            priceInCents: product.priceCents,
            productDescription: `Frovely ${product.name}`,
          },
        ],
        successUrl,
        cancelUrl,
      });

      if (stripeUrl?.startsWith("http")) {
        window.location.href = stripeUrl;
      } else {
        toast.error("Unable to create checkout session. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div
          className="py-12 mb-10 border-b border-border"
          style={{
            background: "linear-gradient(135deg, #fff5f8 0%, #ffeef4 100%)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/products/$id"
              params={{ id: productId }}
              className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-5"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Product
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Secure Checkout
            </h1>
            <p className="mt-2 font-body text-muted-foreground text-sm">
              Complete your order below. Payment is secured by Stripe.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Form -- left col */}
            <div className="lg:col-span-3">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-border p-8 space-y-6 card-shadow"
                data-ocid="checkout.form"
              >
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                    Your Information
                  </h2>
                  <p className="font-body text-sm text-muted-foreground">
                    We'll send your order confirmation to your email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="checkout-name"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="checkout-name"
                      type="text"
                      placeholder="Jane Kim"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.name_input"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="checkout-email"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="font-body border-border focus:ring-primary rounded-xl"
                      data-ocid="checkout.email_input"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label
                      htmlFor="checkout-address"
                      className="font-body text-sm font-medium text-foreground"
                    >
                      Shipping Address
                    </Label>
                    <Textarea
                      id="checkout-address"
                      placeholder="123 Beauty Lane, Seoul, South Korea"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="font-body border-border focus:ring-primary resize-none rounded-xl"
                      data-ocid="checkout.address_input"
                    />
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    SSL Encrypted
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <Lock className="w-4 h-4 text-primary" />
                    Secured by Stripe
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <RotateCcw className="w-4 h-4 text-blue-500" />
                    30-day returns
                  </span>
                  <span className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary" />
                    Free shipping $75+
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate({ to: `/products/${productId}` })}
                    className="font-body rounded-full border-border px-6"
                    data-ocid="checkout.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-primary text-white hover:bg-primary/90 font-body font-semibold rounded-full shadow-pink transition-all duration-300 hover:scale-[1.02] py-5 text-base"
                    data-ocid="checkout.submit_button"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${totalDisplay} Securely
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order summary -- right col */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-border p-6 card-shadow space-y-5">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Order Summary
                </h2>

                {/* Product */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-accent">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground leading-snug">
                      {product.name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
                      {product.description}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Qty: {quantity}
                    </p>
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">
                      Subtotal ({quantity}x)
                    </span>
                    <span className="text-foreground">${unitPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">
                      Calculated at next step
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="font-body font-semibold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    ${totalDisplay}
                  </span>
                </div>

                <div className="text-xs font-body text-muted-foreground text-center">
                  Taxes and shipping calculated at checkout
                </div>
              </div>

              {/* Why buy */}
              <div
                className="rounded-2xl p-5 space-y-3"
                style={{
                  background:
                    "linear-gradient(135deg, #fff5f8 0%, #ffeef4 100%)",
                  border: "1px solid #f8c9d6",
                }}
              >
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
                  Why Frovely?
                </p>
                {[
                  "PDRN + Rosemary scientifically inspired formula",
                  "Korean beauty brand quality",
                  "Cruelty-free & dermatologist-tested",
                  "30-day satisfaction guarantee",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="font-body text-xs text-foreground/75 leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
