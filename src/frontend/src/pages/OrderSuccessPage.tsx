import { Button } from "@/components/ui/button";
import { useSearch } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Loader2, ShoppingBag, XCircle } from "lucide-react";
import { useEffect } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useGetStripeSessionStatus } from "../hooks/useQueries";

export default function OrderSuccessPage() {
  const search = useSearch({ from: "/order-success" });
  const sessionId = (search as Record<string, string>)?.session_id ?? "";

  const { data: sessionStatus, isLoading } =
    useGetStripeSessionStatus(sessionId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isCompleted = sessionStatus?.__kind__ === "completed";
  const isFailed = sessionStatus?.__kind__ === "failed";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
          {isLoading && sessionId ? (
            <div className="space-y-4" data-ocid="order.loading_state">
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Confirming your order...
              </h1>
              <p className="font-body text-muted-foreground text-sm">
                We're verifying your payment. This just takes a moment.
              </p>
            </div>
          ) : isFailed ? (
            <div className="space-y-4" data-ocid="order.error_state">
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="font-display text-2xl font-semibold text-foreground">
                Payment Could Not Be Completed
              </h1>
              <p className="font-body text-muted-foreground text-sm">
                {sessionStatus?.failed?.error ??
                  "Your payment was not processed. Please try again."}
              </p>
              <Link to="/products">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold px-8 shadow-pink">
                  Return to Shop
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6" data-ocid="order.success_state">
              {/* Success icon */}
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                <CheckCircle className="w-14 h-14 text-green-500" />
              </div>

              <div className="space-y-3">
                <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold">
                  Order Confirmed
                </span>
                <h1 className="font-display text-3xl font-semibold text-foreground">
                  Thank You for Your Order!
                </h1>
                <p className="font-body text-muted-foreground text-base leading-relaxed">
                  Your Frovely order has been placed successfully. You'll
                  receive a confirmation email with your order details and
                  tracking information shortly.
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-muted/40 rounded-2xl p-6 text-left space-y-4 border border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag
                    className="w-5 h-5 text-primary"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-body font-semibold text-foreground text-sm">
                    Order Summary
                  </h3>
                </div>
                {sessionId && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-muted-foreground">
                        Session ID
                      </span>
                      <span className="font-body text-foreground font-mono text-xs bg-white px-2 py-1 rounded-md border border-border max-w-48 truncate">
                        {sessionId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-muted-foreground">
                        Payment Status
                      </span>
                      {isCompleted ? (
                        <span className="font-body text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : (
                        <span className="font-body text-amber-600 font-medium">
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* What to expect */}
              <div className="bg-white rounded-2xl p-6 text-left space-y-3 border border-border card-shadow">
                <h3 className="font-body font-semibold text-foreground text-sm">
                  What Happens Next
                </h3>
                <ul className="space-y-2 text-sm font-body text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-semibold">1.</span>
                    You'll receive an order confirmation email within minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-semibold">2.</span>
                    Your Frovely products are carefully packed and shipped
                    within 1-2 business days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-semibold">3.</span>
                    Expect delivery in 3-7 business days with tracking updates
                  </li>
                </ul>
              </div>

              <Link to="/products">
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold px-10 py-3 text-base shadow-pink transition-all duration-300 hover:scale-105">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
