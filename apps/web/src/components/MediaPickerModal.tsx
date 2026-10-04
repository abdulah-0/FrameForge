import React, { useState, useEffect } from "react";
import { CuratedMediaProvider, MediaItem } from "@frameforge/providers";
import { X, Search, Image as ImageIcon, Link as LinkIcon, Check } from "lucide-react";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (item: { url: string; alt?: string }) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
}) => {
  const [query, setQuery] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"curated" | "url">("curated");

  const provider = new CuratedMediaProvider();

  useEffect(() => {
    if (isOpen) {
      provider.search("").then(setMediaItems);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    provider.search(query).then(setMediaItems);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Select Scene Media</h2>
              <p className="text-xs text-slate-400">Curated royalty-free assets and safe custom URLs</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 px-6 pt-2 bg-slate-900/40">
          <button
            onClick={() => setActiveTab("curated")}
            className={`pb-3 text-xs font-semibold border-b-2 mr-6 transition ${
              activeTab === "curated"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Curated Stock Library
          </button>

          <button
            onClick={() => setActiveTab("url")}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              activeTab === "url"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Custom Image URL
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "curated" ? (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tech, business, abstract, product..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Search
                </button>
              </form>

              {/* Grid of images */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectMedia({ url: item.url, alt: item.alt });
                      onClose();
                    }}
                    className="group relative rounded-xl overflow-hidden border border-slate-800 cursor-pointer h-36 bg-slate-900"
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 opacity-90 group-hover:opacity-100 transition">
                      <span className="text-[11px] font-semibold text-white line-clamp-1">
                        {item.alt}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {item.attribution.author} ({item.attribution.license})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Image Direct URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    disabled={!customUrl.startsWith("http")}
                    onClick={() => {
                      onSelectMedia({ url: customUrl });
                      onClose();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>

              {customUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 h-48 bg-slate-900 flex items-center justify-center">
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
