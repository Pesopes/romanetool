import { readdirSync, statSync } from "fs";
import { join } from 'path';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const staticPath = 'static/scenarios'; // Adjust this path if necessary
    const items = readdirSync(staticPath);
    const subdirectories = items.filter(item =>
        statSync(join(staticPath, item)).isDirectory()
    );

    return {
        subdirectories: subdirectories,
    };
}
