import { MediaItem, MediaProvider, MediaSearchOptions } from "../types.js";
export declare class CuratedMediaProvider implements MediaProvider {
    name: string;
    search(query: string, options?: MediaSearchOptions): Promise<MediaItem[]>;
}
