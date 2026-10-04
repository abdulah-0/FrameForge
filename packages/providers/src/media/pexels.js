export class PexelsMediaProvider {
    name = "pexels";
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.PEXELS_API_KEY || "";
    }
    async search(query, options) {
        if (!this.apiKey) {
            console.warn("Pexels API key not configured; returning empty list.");
            return [];
        }
        const orientation = options?.orientation === "portrait" ? "portrait" : "landscape";
        const perPage = options?.limit || 10;
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}`;
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: this.apiKey,
                },
            });
            if (!res.ok) {
                throw new Error(`Pexels API responded with status ${res.status}`);
            }
            const data = await res.json();
            return (data.photos || []).map((photo) => ({
                id: `pexels_${photo.id}`,
                type: "image",
                url: photo.src?.large2x || photo.src?.large || photo.src?.original,
                previewUrl: photo.src?.medium || photo.src?.small,
                width: photo.width,
                height: photo.height,
                alt: photo.alt || query,
                attribution: {
                    author: photo.photographer,
                    source: "Pexels",
                    license: "Pexels Free Commercial License",
                },
            }));
        }
        catch (err) {
            console.error("Pexels search error:", err.message);
            return [];
        }
    }
}
