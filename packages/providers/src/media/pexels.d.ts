import { MediaItem, MediaProvider, MediaSearchOptions } from "../types.js";
export declare class PexelsMediaProvider implements MediaProvider {
    name: string;
    private apiKey;
    constructor(apiKey?: string);
    search(query: string, options?: MediaSearchOptions): Promise<MediaItem[]>;
}
