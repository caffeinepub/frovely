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
  ClipboardList,
  Edit2,
  Loader2,
  LogIn,
  LogOut,
  Package,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, Product } from "../backend.d";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllOrders,
  useGetAllProducts,
  useIsCallerAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

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
              {orders.map((order, i) => (
                <TableRow
                  key={order.orderId}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.orders_table.row.${i + 1}`}
                >
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
              ))}
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

export default function AdminPage() {
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal().toString();

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
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-body text-xs text-muted-foreground">
                      Logged in as
                    </p>
                    <p className="font-mono text-xs text-foreground font-medium max-w-36 truncate">
                      {principal}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clear}
                    className="font-body rounded-full border-border gap-1.5 text-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Not authenticated */}
          {!isAuthenticated ? (
            <div className="text-center py-20 space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-accent/60 flex items-center justify-center mx-auto">
                <ShieldAlert
                  className="w-10 h-10 text-primary"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Admin Access Required
                </h2>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  Please sign in with Internet Identity to access the Frovely
                  admin dashboard. Only authorized administrators can view
                  orders and manage products.
                </p>
              </div>
              <Button
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                className="bg-primary text-white hover:bg-primary/90 rounded-full font-body font-semibold px-8 shadow-pink transition-all duration-300 hover:scale-105"
              >
                {isLoggingIn || isInitializing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          ) : adminLoading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="font-body text-sm text-muted-foreground">
                Checking admin access...
              </span>
            </div>
          ) : !isAdmin ? (
            <div className="text-center py-20 space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <ShieldAlert
                  className="w-10 h-10 text-red-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Access Denied
                </h2>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  Your account does not have administrator privileges. Please
                  contact the store owner if you believe this is an error.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={clear}
                className="font-body rounded-full border-border gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            /* Admin dashboard */
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
