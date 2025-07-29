import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./input.css";
import "animate.css/animate.compat.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);