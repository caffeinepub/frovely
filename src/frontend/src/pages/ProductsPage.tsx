import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useActor } from "../hooks/useActor";
import { useCreateProduct, useGetAllProducts } from "../hooks/useQueries";

const SEED_PRODUCTS = [
  {
    id: "frovely-routine-set",
    name: "Frovely PDRN + Rosemary Scalp Routine Set",
    priceCents: 6500n,
    imageUrls: ["/assets/generated/hero-product-set.dim_1200x800.jpg"],
    description:
      "Complete 3-step scalp care routine. Includes Rosemary PDRN Cooling Thickening Shampoo (400ml), Rosemary PDRN Hair & Scalp Conditioner (250ml), and Rosemary PDRN Scalp Serum (20ml). Nourishes the scalp, reduces flakes, strengthens hair roots, improves scalp circulation, hydrates the scalp, and supports healthier and thicker-looking hair.",
  },
  {
    id: "frovely-duo",
    name: "Frovely Rosemary PDRN Shampoo + Conditioner Duo",
    priceCents: 4900n,
    imageUrls: ["/assets/generated/duo-product.dim_800x800.jpg"],
    description:
      "Daily scalp-care duo designed to cleanse, hydrate, and strengthen hair. Improves volume, reduces breakage, and gives healthy shine.",
  },
];

function ProductCard({
  id,
  name,
  priceCents,
  imageUrls,
  description,
  index,
}: {
  id: string;
  name: string;
  priceCents: bigint;
  imageUrls: string[];
  description: string;
  index: number;
}) {
  const price = (Number(priceCents) / 100).toFixed(2);
  const image =
    imageUrls[0] ?? "/assets/generated/hero-product-set.dim_1200x800.jpg";
  const shortDesc =
    description.length > 100 ? `${description.slice(0, 100)}...` : description;

  return (
    <Card
      className="border border-border bg-white card-shadow card-shadow-hover transition-all duration-300 overflow-hidden group"
      data-ocid={`products.item.${index + 1}`}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-2">
            {name}
          </h3>
          <p className="text-sm font-body text-muted-foreground leading-relaxed">
            {shortDesc}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-2xl font-bold text-foreground">
            ${price}
          </span>
          <Link to="/products/$id" params={{ id }}>
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-5 font-body font-medium transition-all duration-300 hover:scale-105 shadow-pink flex items-center gap-1.5"
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

const SEEDED_KEY = "frovely_products_seeded";

export default function ProductsPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: products, isLoading, isError } = useGetAllProducts();
  const { mutateAsync: createProduct } = useCreateProduct();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!actor || actorFetching || seededRef.current) return;
    if (localStorage.getItem(SEEDED_KEY)) return;
    if (products && products.length > 0) {
      localStorage.setItem(SEEDED_KEY, "1");
      return;
    }
    if (products && products.length === 0) {
      seededRef.current = true;
      Promise.all(
        SEED_PRODUCTS.map((p) =>
          createProduct({
            id: p.id,
            name: p.name,
            description: p.description,
            priceCents: p.priceCents,
            imageUrls: p.imageUrls,
          }),
        ),
      )
        .then(() => {
          localStorage.setItem(SEEDED_KEY, "1");
        })
        .catch(() => {
          seededRef.current = false;
        });
    }
  }, [actor, actorFetching, products, createProduct]);

  const displayProducts =
    products && products.length > 0
      ? products
      : SEED_PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          priceCents: p.priceCents,
          imageUrls: p.imageUrls,
          description: p.description,
          inStock: true,
          createdAt: 0n,
        }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="bg-muted/40 border-b border-border py-14 mb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block font-body text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Frovely Collection
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Our Products
            </h1>
            <p className="mt-3 font-body text-muted-foreground max-w-md mx-auto text-base">
              Scientifically inspired scalp care formulas for healthier, fuller
              hair.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="products.loading_state"
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-body text-muted-foreground text-sm">
                Loading products...
              </p>
            </div>
          ) : isError ? (
            <div
              className="text-center py-24 space-y-3"
              data-ocid="products.error_state"
            >
              <ShoppingBag
                className="w-12 h-12 text-muted-foreground/50 mx-auto"
                strokeWidth={1}
              />
              <p className="font-body text-muted-foreground">
                Unable to load products. Please try again.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {displayProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  priceCents={product.priceCents}
                  imageUrls={product.imageUrls}
                  description={product.description}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
