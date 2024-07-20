import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { resolve } from "path";

// Load and expand environment variables from the root .env file
const myEnv = dotenv.config({ path: resolve(__dirname, "../.env") });
dotenvExpand.expand(myEnv);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    https: false,
    host: "0.0.0.0",
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: resolve(__dirname, "./dist"),
  },
});
