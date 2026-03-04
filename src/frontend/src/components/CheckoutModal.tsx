import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateCheckoutSession, useCreateOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  priceCents: bigint;
  quantity: number;
}

export default function CheckoutModal({
  open,
  onClose,
  productId,
  productName,
  priceCents,
  quantity,
}: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();

  const totalCents = priceCents * BigInt(quantity);
  const totalDisplay = (Number(totalCents) / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsProcessing(true);
    try {
      // Create order first (with empty stripeSessionId)
      await createOrder({
        customerName: name,
        email,
        shippingAddress: address,
        productId,
        quantity: BigInt(quantity),
        totalCents,
        stripeSessionId: "",
      });

      // Create Stripe checkout session
      const successUrl = `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/products`;

      const stripeUrl = await createCheckoutSession({
        items: [
          {
            productName,
            currency: "usd",
            quantity: BigInt(quantity),
            priceInCents: priceCents,
            productDescription: `Frovely ${productName}`,
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md bg-white"
        data-ocid="checkout.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-foreground">
            Complete Your Order
          </DialogTitle>
          <DialogDescription className="font-body text-muted-foreground text-sm">
            Enter your details to proceed to secure payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Order summary */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-1">
            <p className="font-body text-sm font-semibold text-foreground">
              {productName}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-body text-xs text-muted-foreground">
                Qty: {quantity}
              </p>
              <p className="font-display font-bold text-foreground">
                ${totalDisplay}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="checkout-name"
              className="font-body text-sm font-medium"
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
              className="font-body border-border focus:ring-primary"
              data-ocid="checkout.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="checkout-email"
              className="font-body text-sm font-medium"
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
              className="font-body border-border focus:ring-primary"
              data-ocid="checkout.email_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="checkout-address"
              className="font-body text-sm font-medium"
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
              className="font-body border-border focus:ring-primary resize-none"
              data-ocid="checkout.address_input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-body rounded-full border-border"
              data-ocid="checkout.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-primary text-white hover:bg-primary/90 font-body font-semibold rounded-full shadow-pink transition-all duration-300"
              data-ocid="checkout.submit_button"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 mr-2" />
                  Pay Securely
                </>
              )}
            </Button>
          </div>

          <p className="text-xs font-body text-muted-foreground text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Secured by Stripe · SSL encrypted
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
