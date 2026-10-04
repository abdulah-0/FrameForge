import React from "react";
import { Project } from "@frameforge/project-schema";
import { AspectRatio } from "@frameforge/shared";
import {
  Film,
  Sparkles,
  Download,
  Plus,
  Smartphone,
  Monitor,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface HeaderProps {
  project: Project;
  onUpdateProject: (updater: (prev: Project) => Project) => void;
  onOpenNewModal: () => void;
  onOpenExportModal: () => void;
  isSaving: boolean;
  totalDuration: number;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateProject,
  onOpenNewModal,
  onOpenExportModal,
  isSaving,
  totalDuration,
}) => {
  const toggleAspectRatio = (ratio: AspectRatio) => {
    onUpdateProject((prev) => ({
      ...prev,
      aspectRatio: ratio,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    onUpdateProject((prev) => ({
      ...prev,
      title: newTitle,
    }));
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0c1220]/90 backdrop-blur-md px-6 flex items-center justify-between z-30 select-none">
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-black tracking-tight text-xl text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Film className="w-5 h-5" />
          </div>
          <span>FrameForge</span>
        </div>

        <div className="h-5 w-px bg-slate-800" />

        <input
          type="text"
          value={project.title}
          onChange={handleTitleChange}
          className="bg-transparent hover:bg-slate-800/40 focus:bg-slate-800/80 px-2.5 py-1 rounded text-sm font-semibold text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition max-w-[260px] truncate"
        />

        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
          {project.videoType}
        </span>
      </div>

      {/* Center: Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Aspect Ratio Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-medium text-slate-400">
          <button
            onClick={() => toggleAspectRatio("9:16")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              project.aspectRatio === "9:16"
                ? "bg-blue-600 text-white shadow-sm"
                : "hover:text-slate-200"
            }`}
            title="Vertical 9:16 (Shorts / Reels / TikTok)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16</span>
          </button>
          <button
            onClick={() => toggleAspectRatio("16:9")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
              project.aspectRatio === "16:9"
                ? "bg-blue-600 text-white shadow-sm"
                : "hover:text-slate-200"
            }`}
            title="Horizontal 16:9 (YouTube / Web)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>
        </div>

        {/* Duration badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{totalDuration}s total</span>
        </div>

        {/* Save indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
          {isSaving ? (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400/80">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export MP4</span>
        </button>
      </div>
    </header>
  );
};
