const defaultTheme = require('tailwindcss/defaultTheme');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			mono: ['"Noto Sans Mono"', ...defaultTheme.fontFamily.mono]
		}
	},
	plugins: []
};
