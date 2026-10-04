const SAMPLE_MEDIA_LIBRARY = [
    {
        id: "med_tech_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
        width: 1200,
        height: 800,
        alt: "Circuit board and futuristic computing",
        attribution: {
            author: "Alexandre Debiève",
            source: "Unsplash",
            license: "Unsplash Free License",
        },
    },
    {
        id: "med_biz_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
        width: 1200,
        height: 800,
        alt: "Modern skyscraper and business architecture",
        attribution: {
            author: "Sean Pollock",
            source: "Unsplash",
            license: "Unsplash Free License",
        },
    },
    {
        id: "med_abstract_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
        previewUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80",
        width: 1200,
        height: 800,
        alt: "Neon gradient waves abstract background",
        attribution: {
            author: "Google DeepMind",
            source: "Unsplash",
            license: "Unsplash Free License",
        },
    },
    {
        id: "med_product_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        width: 1200,
        height: 800,
        alt: "Premium wireless headphones product photo",
        attribution: {
            author: "C-Garner",
            source: "Unsplash",
            license: "Unsplash Free License",
        },
    },
    {
        id: "med_edu_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        previewUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
        width: 1200,
        height: 800,
        alt: "Global network planet connection graphic",
        attribution: {
            author: "NASA / Unsplash",
            source: "Unsplash",
            license: "Public Domain / Unsplash",
        },
    },
];
export class CuratedMediaProvider {
    name = "curated";
    async search(query, options) {
        const q = (query || "").toLowerCase();
        const limit = options?.limit || 10;
        if (!q) {
            return SAMPLE_MEDIA_LIBRARY.slice(0, limit);
        }
        const matches = SAMPLE_MEDIA_LIBRARY.filter((m) => m.alt.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
        return (matches.length > 0 ? matches : SAMPLE_MEDIA_LIBRARY).slice(0, limit);
    }
}
