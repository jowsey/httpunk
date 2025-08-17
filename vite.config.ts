import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { version } from './package.json';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	define: {
		'import.meta.env.VERSION': JSON.stringify(version)
	}
});
