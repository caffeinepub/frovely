import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  DollarSign,
  Edit2,
  Loader2,
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order, Product } from "../backend.d";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import {
  useGetAllOrders,
  useGetAllProducts,
  useUpdateProduct,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "Harisanghu000";
const ADMIN_AUTH_KEY = "frovely_admin_auth";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    failed: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-700",
  };
  const cls = colors[status.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function formatDate(nanoTs: bigint) {
  if (!nanoTs) return "—";
  const ms = Number(nanoTs) / 1_000_000;
  if (ms < 1000) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCents(cents: bigint) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function EditProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
  const [price, setPrice] = useState(
    product ? (Number(product.priceCents) / 100).toFixed(2) : "",
  );

  const handleSave = async () => {
    if (!product) return;
    const priceCents = Math.round(Number.parseFloat(price) * 100);
    if (Number.isNaN(priceCents) || priceCents <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    try {
      await updateProduct({
        id: product.id,
        name: product.name,
        description: product.description,
        priceCents: BigInt(priceCents),
        inStock: product.inStock,
        imageUrls: product.imageUrls,
      });
      toast.success("Product price updated successfully.");
      onClose();
    } catch {
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-sm bg-white"
        data-ocid="admin.product.modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold text-foreground">
            Edit Product Price
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground">
            Update the price for {product?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="font-body text-sm text-foreground/70 mb-1">Product</p>
            <p className="font-body font-medium text-foreground text-sm">
              {product?.name}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="product-price"
              className="font-body text-sm font-medium"
            >
              New Price (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-muted-foreground text-sm">
                $
              </span>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7 font-body border-border"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-body rounded-full border-border"
            data-ocid="admin.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold shadow-pink"
            data-ocid="admin.save_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Price"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrdersTab({
  orders,
  isLoading,
}: { orders: Order[] | undefined; isLoading: boolean }) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div>
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 gap-3"
          data-ocid="admin.orders_loading_state"
        >
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="font-body text-sm text-muted-foreground">
            Loading orders...
          </span>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div
          className="text-center py-16 space-y-3"
          data-ocid="admin.orders_empty_state"
        >
          <ClipboardList
            className="w-12 h-12 text-muted-foreground/40 mx-auto"
            strokeWidth={1}
          />
          <p className="font-body text-muted-foreground text-sm">
            No orders yet.
          </p>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl border border-border"
          data-ocid="admin.orders_table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60 w-8" />
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60 w-28">
                  Order ID
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Customer
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Email
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Product
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Total
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Status
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, i) => {
                const isExpanded = expandedOrderId === order.orderId;
                return (
                  <>
                    <TableRow
                      key={order.orderId}
                      className="hover:bg-muted/20 transition-colors cursor-pointer select-none"
                      onClick={() => toggleExpand(order.orderId)}
                      data-ocid={`admin.orders_table.row.${i + 1}`}
                    >
                      <TableCell className="w-8">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground max-w-28 truncate">
                        {order.orderId.slice(0, 12)}...
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground font-medium">
                        {order.customerName}
                      </TableCell>
                      <TableCell className="font-body text-sm text-muted-foreground">
                        {order.email}
                      </TableCell>
                      <TableCell className="font-body text-sm text-foreground max-w-40 truncate">
                        {order.productId}
                      </TableCell>
                      <TableCell className="font-body text-sm font-semibold text-foreground">
                        {formatCents(order.totalCents)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell className="font-body text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(order.purchaseDate)}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow
                        key={`${order.orderId}-detail`}
                        className="bg-muted/20"
                      >
                        <TableCell colSpan={8} className="py-4 px-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Order ID
                              </p>
                              <p className="font-mono text-xs text-foreground break-all">
                                {order.orderId}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Customer
                              </p>
                              <p className="font-body text-sm font-medium text-foreground">
                                {order.customerName}
                              </p>
                              <p className="font-body text-xs text-muted-foreground">
                                {order.email}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Shipping Address
                              </p>
                              <p className="font-body text-sm text-foreground whitespace-pre-line">
                                {order.shippingAddress}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Product
                              </p>
                              <p className="font-body text-sm text-foreground">
                                {order.productId}
                              </p>
                              <p className="font-body text-xs text-muted-foreground">
                                Qty: {String(order.quantity)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Payment
                              </p>
                              <p className="font-body font-semibold text-foreground">
                                {formatCents(order.totalCents)}
                              </p>
                              <StatusBadge status={order.paymentStatus} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-body text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                                Purchase Date
                              </p>
                              <p className="font-body text-sm text-foreground">
                                {formatDate(order.purchaseDate)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ProductsTab({
  products,
  isLoading,
}: {
  products: Product[] | undefined;
  isLoading: boolean;
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div>
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
      />
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 gap-3"
          data-ocid="admin.products_loading_state"
        >
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="font-body text-sm text-muted-foreground">
            Loading products...
          </span>
        </div>
      ) : !products || products.length === 0 ? (
        <div
          className="text-center py-16 space-y-3"
          data-ocid="admin.products_empty_state"
        >
          <Package
            className="w-12 h-12 text-muted-foreground/40 mx-auto"
            strokeWidth={1}
          />
          <p className="font-body text-muted-foreground text-sm">
            No products found.
          </p>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl border border-border"
          data-ocid="admin.products_table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Product
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  ID
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Price
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Status
                </TableHead>
                <TableHead className="font-body font-semibold text-xs uppercase tracking-wide text-foreground/60">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.products_table.row.${i + 1}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.imageUrls[0] && (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <span className="font-body text-sm font-medium text-foreground line-clamp-2 max-w-56">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.id}
                  </TableCell>
                  <TableCell className="font-body font-semibold text-foreground">
                    {formatCents(product.priceCents)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`font-body text-xs rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-body rounded-full text-xs border-border hover:border-primary hover:text-primary transition-all gap-1.5"
                      onClick={() => setEditingProduct(product)}
                      data-ocid={`admin.edit_product_button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Price
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function AnalyticsCards({ orders }: { orders: Order[] | undefined }) {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const stored = Number(localStorage.getItem("frovely_visit_count") ?? "0");
    const newCount = stored + 1;
    localStorage.setItem("frovely_visit_count", String(newCount));
    setVisits(newCount);
  }, []);

  const totalOrders = orders?.length ?? 0;
  const conversionRate = ((totalOrders / Math.max(visits, 1)) * 100).toFixed(1);

  const paidOrders =
    orders?.filter(
      (o) => o.paymentStatus === "paid" || o.paymentStatus === "completed",
    ) ?? [];
  const aov =
    paidOrders.length > 0
      ? (
          paidOrders.reduce((sum, o) => sum + Number(o.totalCents), 0) /
          paidOrders.length /
          100
        ).toFixed(2)
      : "0.00";

  const cards = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Page Visits",
      value: visits.toLocaleString(),
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Avg Order Value",
      value: `$${aov}`,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-border p-5 card-shadow space-y-3"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}
          >
            {card.icon}
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground leading-none">
              {card.value}
            </p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mt-1">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PasswordLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for UX feel
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        onSuccess();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/60 mb-5">
            <Lock className="w-7 h-7 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
            Frovely Admin
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1.5">
            Enter your password to access the dashboard
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-border p-8 shadow-sm space-y-5"
        >
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="font-body text-sm font-medium text-foreground"
            >
              Admin Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="font-body border-border rounded-xl h-11 focus-visible:ring-primary"
              autoComplete="current-password"
              data-ocid="admin.password_input"
            />
            {error && (
              <p
                className="font-body text-xs text-red-500 flex items-center gap-1.5 pt-0.5"
                data-ocid="admin.login_error_state"
              >
                <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold h-11 shadow-pink transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            data-ocid="admin.login_button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Enter Dashboard"
            )}
          </Button>
        </form>

        {/* Subtle brand footer */}
        <p className="text-center font-body text-xs text-muted-foreground/60 mt-6">
          Frovely &mdash; Scalp Care Redefined
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  });

  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <PasswordLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="bg-muted/40 border-b border-border py-12 mb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                  Admin Panel
                </span>
                <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Frovely Dashboard
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="font-body rounded-full border-border gap-1.5 text-sm"
                data-ocid="admin.logout_button"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin dashboard */}
          <div className="space-y-6">
            <AnalyticsCards orders={orders} />
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="bg-muted/50 border border-border rounded-full p-1 w-fit">
                <TabsTrigger
                  value="orders"
                  className="rounded-full font-body font-medium text-sm px-5 data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-primary transition-all"
                  data-ocid="admin.orders_tab"
                >
                  <ClipboardList className="w-4 h-4 mr-1.5" />
                  Orders
                  {orders && orders.length > 0 && (
                    <span className="ml-2 bg-primary text-white rounded-full text-xs px-2 py-0.5">
                      {orders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="rounded-full font-body font-medium text-sm px-5 data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-primary transition-all"
                  data-ocid="admin.products_tab"
                >
                  <Package className="w-4 h-4 mr-1.5" />
                  Products
                  {products && products.length > 0 && (
                    <span className="ml-2 bg-primary text-white rounded-full text-xs px-2 py-0.5">
                      {products.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Order History
                    </h2>
                    <span className="font-body text-xs text-muted-foreground">
                      {orders?.length ?? 0} total orders
                    </span>
                  </div>
                  <OrdersTab orders={orders} isLoading={ordersLoading} />
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Product Management
                    </h2>
                    <span className="font-body text-xs text-muted-foreground">
                      {products?.length ?? 0} products
                    </span>
                  </div>
                  <ProductsTab
                    products={products}
                    isLoading={productsLoading}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
