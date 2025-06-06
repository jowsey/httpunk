import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// server: {
	// 	proxy: {  // would loooove to use this instead of hardcoding a string in the client but Bun doesn't support some combination of websockets and proxying yet? (1.2.15)
	// 		"/api/ws": {
	// 			target: "http://localhost:3002",
	// 			changeOrigin: true,
	// 			ws: true,
	// 		},
	// 	},
	// },
});
