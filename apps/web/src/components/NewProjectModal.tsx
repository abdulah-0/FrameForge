import React, { useState } from "react";
import { VideoWorkflow, AspectRatio } from "@frameforge/shared";
import {
  X,
  Sparkles,
  Layers,
  ShoppingBag,
  Flame,
  GraduationCap,
  Smartphone,
  Monitor,
} from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (options: {
    title: string;
    videoType: VideoWorkflow;
    aspectRatio: AspectRatio;
    topic: string;
    useAI: boolean;
  }) => void;
  isGeneratingAI: boolean;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  isGeneratingAI,
}) => {
  const [videoType, setVideoType] = useState<VideoWorkflow>("product-ad");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [title, setTitle] = useState("New Video Project");
  const [topic, setTopic] = useState("");
  const [useAI, setUseAI] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProject({
      title,
      videoType,
      aspectRatio,
      topic: topic.trim() || title,
      useAI,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New Video Project</h2>
              <p className="text-xs text-slate-400">Describe your video or start from a template</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Workflow Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Choose Video Workflow</label>
            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setVideoType("product-ad")}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-2 ${
                  videoType === "product-ad"
                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs font-bold">Product Ad</div>
                  <div className="text-[10px] text-slate-400">Promos & sales</div>
                </div>
              </div>

              <div
                onClick={() => setVideoType("faceless")}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-2 ${
                  videoType === "faceless"
                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Flame className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-xs font-bold">Faceless Short</div>
                  <div className="text-[10px] text-slate-400">TikTok & Shorts</div>
                </div>
              </div>

              <div
                onClick={() => setVideoType("explainer")}
                className={`p-3 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-2 ${
                  videoType === "explainer"
                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold">Explainer</div>
                  <div className="text-[10px] text-slate-400">Lessons & concepts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio("9:16")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition text-xs font-semibold ${
                  aspectRatio === "9:16"
                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Vertical 9:16 (Shorts / Reels)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("16:9")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition text-xs font-semibold ${
                  aspectRatio === "16:9"
                    ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Monitor className="w-4 h-4 text-blue-400" />
                <span>Horizontal 16:9 (YouTube)</span>
              </button>
            </div>
          </div>

          {/* Prompt / Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Video Topic or Product Brief
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A 15-second promo for noise-cancelling headphones featuring 40-hour battery life and 50% summer discount"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-medium"
            />
          </div>

          {/* AI vs Manual Template Mode Switch */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Generate with AI</div>
                <div className="text-[10px] text-slate-400">
                  {useAI ? "Generates scripted hooks & scenes" : "Starts with clean manual template"}
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGeneratingAI}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
