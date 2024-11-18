import type { PageLoad } from './$types';
import { parseScript } from './parser';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('script.txt');
	const text = await res.text();


	return {
		script: {
			manager: parseScript(text)
		}
	};
};

