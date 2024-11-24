import type { PageLoad } from './$types';
import { parseScript } from './parser';

export const load: PageLoad = async ({ params, fetch }) => {
	const res = await fetch(`/scenarios/${params.scenario}/main.nls`);
	const text = await res.text();

	return {
		script: {
			name: params.scenario,
			manager: parseScript(text, params.scenario)
		}
	};
};

