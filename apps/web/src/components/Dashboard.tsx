import React from "react";
import { Project } from "@frameforge/project-schema";
import {
  Film,
  Plus,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Download,
  Upload,
} from "lucide-react";

interface DashboardProps {
  projects: Project[];
  activeProjectId: string;
  onOpenProject: (id: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onImportProject: (imported: Project) => void;
  onLoadFixture: (type: "faceless" | "product-ad" | "explainer") => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  activeProjectId,
  onOpenProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onImportProject,
  onLoadFixture,
}) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        onImportProject(raw);
      } catch (err) {
        alert("Invalid project JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 bg-[#090d16] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Video Projects Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Create, manage, and edit your AI storyboards and videos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>

            <button
              onClick={onNewProject}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Starter Template Shortcuts */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Engineered Starter Workflows</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={() => onLoadFixture("faceless")}
              className="group p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-orange-500/50 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider">
                  Viral Short (9:16)
                </span>
                <h3 className="text-sm font-bold text-white mt-2 group-hover:text-orange-400 transition">
                  3 Focus Secrets Faceless Short
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  High-hook vertical script with statistics and kinetic callouts.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-400 mt-4 group-hover:translate-x-1 transition">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onLoadFixture("product-ad")}
              className="group p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-blue-500/50 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Product Commercial (9:16)
                </span>
                <h3 className="text-sm font-bold text-white mt-2 group-hover:text-blue-400 transition">
                  AuraPods Max Promo Commercial
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Product showcase, benefits checklist, discount coupon, and CTA.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 mt-4 group-hover:translate-x-1 transition">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onLoadFixture("explainer")}
              className="group p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/50 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Educational Explainer (16:9)
                </span>
                <h3 className="text-sm font-bold text-white mt-2 group-hover:text-emerald-400 transition">
                  Neural Networks Visual Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Landscape lesson with split-screen graphics and key takeaways.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-4 group-hover:translate-x-1 transition">
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Existing Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Your Projects ({projects.length})</span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {projects.map((proj) => {
              const isActive = proj.projectId === activeProjectId;
              const duration = proj.scenes.reduce((a, s) => a + s.durationSeconds, 0);

              return (
                <div
                  key={proj.projectId}
                  className={`group relative rounded-2xl border p-5 flex flex-col justify-between transition cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border-blue-500 ring-1 ring-blue-500/40 shadow-xl shadow-blue-500/5"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                  onClick={() => onOpenProject(proj.projectId)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {proj.videoType} • {proj.aspectRatio}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{duration.toFixed(1)}s</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition line-clamp-1">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {proj.scenes[0]?.headline || "No scenes"}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {proj.scenes.length} scenes
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(proj.projectId);
                        }}
                        className="p-1 text-slate-400 hover:text-white transition"
                        title="Duplicate project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(proj.projectId);
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 transition"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
