import { Routes, Route } from "react-router-dom";
import { Layout } from "@flx-front/ui-web";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { ProductsPage } from "./pages/products";
import { ProductDetailPage } from "./pages/product-detail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </Layout>
  );
}
