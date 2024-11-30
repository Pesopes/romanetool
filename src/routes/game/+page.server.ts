import { readdirSync, readFileSync, statSync } from "fs";
import { join } from 'path';
import type { PageServerLoad } from "./$types";
export interface ScenarioMetadata {
    name: string,
    description: string,
    entrypoint: string,
    icon: string,
    author: string,
    year: number,
    hidden: boolean
}
export interface Scenario {
    dirName: string,
    metadata: ScenarioMetadata
}
export const load: PageServerLoad = async () => {
    const staticPath = 'static/scenarios';
    const metadataFileName = "metadata.json"
    const items = readdirSync(staticPath);
    const scenarios: Scenario[] = items.filter(item =>
        statSync(join(staticPath, item)).isDirectory()
    ).map((dir) => {
        const dirPath = join(staticPath, dir)

        try {
            const metadataPath = join(dirPath, metadataFileName);
            const metadataFile = readFileSync(metadataPath, "utf-8");
            const metadata: ScenarioMetadata = JSON.parse(metadataFile);
            // Ignore scenarios that are hidden
            if (metadata.hidden) {
                return null;
            }
            return {
                dirName: dir,
                metadata: metadata
            }
        } catch (error) {
            console.error(`Failed to read metadata for ${dir}: ${error}`);
            return null; // Return null if the file is missing or unreadable
        }
    }).filter((obj) => obj != null);

    return { scenarios };
}
