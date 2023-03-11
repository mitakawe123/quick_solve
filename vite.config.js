// // vite.config.js
// import { defineConfig } from "vite";

// export default defineConfig({
//   build: {
//     lib: {
//       entry: "src/main.jsx",
//       name: "MyLibrary",
//       fileName: "my-library",
//     },
//     rollupOptions: {
//       output: {
//         format: "es",
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    Module: {},
  },
});
