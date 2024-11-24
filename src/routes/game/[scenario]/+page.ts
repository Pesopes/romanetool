import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { parseScript } from './parser';

export const load: PageLoad = async ({ params, fetch }) => {
	const res = await fetch(`/scenarios/${params.scenario}/main.nls`);
	if (!res.ok) {
		error(404, `The scenario "${params.scenario}" couldn't be found`)
	}
	const text = await res.text();

	return {
		script: {
			name: params.scenario,
			manager: parseScript(text, params.scenario)
		}
	};
};

