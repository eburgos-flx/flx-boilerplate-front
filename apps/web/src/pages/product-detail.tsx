import { useParams, useNavigate } from "react-router-dom";
import {
  useProductQuery,
  useDeleteProduct,
} from "@flx-front/shared/data-access";
import {
  Container,
  Card,
  Loading,
  ErrorMessage,
  Button,
} from "@flx-front/ui-web";
import { apiClient } from "../lib/api-client";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    error,
  } = useProductQuery(apiClient, parseInt(id || "0"));

  const deleteMutation = useDeleteProduct(apiClient, {
    onSuccess: () => {
      navigate("/products");
    },
  });

  if (isLoading) {
    return (
      <Container>
        <Loading message="Loading product..." />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <ErrorMessage
          title="Product not found"
          message={error?.message || "This product does not exist"}
        />
        <Button onClick={() => navigate("/products")} className="mt-4">
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        onClick={() => navigate("/products")}
        variant="secondary"
        className="mb-6 group"
      >
        <span className="group-hover:-translate-x-1 inline-block transition-transform">
          ←
        </span>{" "}
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={product.images[0] || product.thumbnail}
              alt={product.title}
              className="w-full aspect-square object-cover"
            />
            {product.stock < 10 && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
                Only {product.stock} left!
              </div>
            )}
            {product.rating >= 4.5 && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full shadow-lg">
                ⭐ {product.rating}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={img}
                  alt={`${product.title} ${idx + 2}`}
                  className="w-full h-20 object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 text-sm px-4 py-1.5 rounded-full font-medium mb-4">
              {product.category}
            </span>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {product.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
              {product.discountPercentage > 0 && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 line-through">
                    $
                    {(
                      product.price /
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold text-gray-700">
                  {product.rating} / 5
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-semibold text-green-700">
                      In Stock ({product.stock} units)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="font-semibold text-red-600">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>📦</span> Product Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Brand</span>
                <span className="font-semibold">{product.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">SKU</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.sku}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Weight</span>
                <span className="font-semibold">{product.weight}g</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Dimensions</span>
                <span className="font-semibold">
                  {product.dimensions.width} × {product.dimensions.height} ×{" "}
                  {product.dimensions.depth} cm
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Warranty</span>
                <span className="font-semibold">
                  {product.warrantyInformation}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span>🚚</span> Shipping & Returns
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {product.shippingInformation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-xl">↩</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {product.returnPolicy}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-500 text-xl">🛡</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Minimum Order: {product.minimumOrderQuantity} units
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1 py-4 text-lg font-semibold"
            >
              🛒 Add to Cart
            </Button>
            <Button
              variant="danger"
              className="py-4"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this product?",
                  )
                ) {
                  deleteMutation.mutate(product.id);
                }
              }}
              isLoading={deleteMutation.isPending}
            >
              🗑️ Delete
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
