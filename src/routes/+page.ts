import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch('script.txt'); // Relative to the `static` folder
    const text = await res.text();
	return {
		post: {
			text:text
		}
	};
};