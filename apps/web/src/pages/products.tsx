import { useState } from "react";
import { Link } from "react-router-dom";
import { useProductsQuery } from "@flx-front/shared/data-access";
import {
  Container,
  Card,
  Loading,
  ErrorMessage,
  Button,
} from "@flx-front/ui-web";
import { apiClient } from "../lib/api-client";

export function ProductsPage() {
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data, isLoading, error, refetch } = useProductsQuery(apiClient, {
    limit,
    skip: page * limit,
  });

  if (isLoading) {
    return (
      <Container>
        <Loading message="Loading products..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage
          title="Failed to load products"
          message={error.message}
          onRetry={() => refetch()}
        />
      </Container>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <Container>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Products Catalog
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Showing {data?.products.length} of {data?.total} products
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              Page {page + 1} of {totalPages}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {data?.products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="h-full flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {product.stock < 10 && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      Low Stock
                    </span>
                  )}
                  {product.rating >= 4.5 && (
                    <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      ⭐ Top Rated
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                {product.description}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Stock: {product.stock}</span>
                  <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  );
}
