import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	server: {
		watch: {
			usePolling: true
		}
	}
};

export default config;
