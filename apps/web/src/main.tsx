import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@flx-front/shared/data-access";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);
