import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	base: './',
	build: {
		outDir: 'dist',
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./', import.meta.url)),
		},
	},
	plugins: [
		tailwindcss(),
		AutoImport({
			imports:{
				'@/components/modal.js': ['Modal'],
				'@/components/toast.js': ['Toast'],
			},
			dts: false,
		}),
	],
});