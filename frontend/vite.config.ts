import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
});
