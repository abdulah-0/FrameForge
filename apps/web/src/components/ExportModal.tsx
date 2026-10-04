import React, { useState } from "react";
import { Project } from "@frameforge/project-schema";
import { RenderStage } from "@frameforge/shared";
import {
  X,
  Download,
  Film,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ShieldCheck,
  Cpu,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  totalDuration: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  totalDuration,
}) => {
  const [renderMode, setRenderMode] = useState<"cloud" | "local">("cloud");
  const [stage, setStage] = useState<RenderStage | "idle">("idle");
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    setStage("preparing");
    setProgress(15);
    setStageMessage("Validating composition & initializing worker...");
    setError(null);
    setDownloadUrl(null);

    try {
      // Connect to local or backend render-worker API
      const res = await fetch("http://localhost:3100/api/render-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Worker returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const jobId = data.jobId;

      // Poll job status
      const interval = setInterval(async () => {
        try {
          const pollRes = await fetch(`http://localhost:3100/api/render-jobs/${jobId}`);
          if (!pollRes.ok) return;

          const job = await pollRes.json();
          setStage(job.stage);
          setProgress(job.progressPercent);
          setStageMessage(job.stageMessage);

          if (job.stage === "complete") {
            clearInterval(interval);
            setDownloadUrl(job.downloadUrl || "#");
          } else if (job.stage === "failed") {
            clearInterval(interval);
            setError(job.error || "Render encountered an error");
          }
        } catch (err: any) {
          // Keep polling until timeout or success
        }
      }, 1000);
    } catch (err: any) {
      setStage("failed");
      setError(
        err.message?.includes("Failed to fetch")
          ? "Render worker not reachable on http://localhost:3100. Run 'npm run dev:all' or use the CLI command below."
          : err.message || "Failed to initiate render"
      );
      setStageMessage("Render service unavailable or quota exceeded");
    }
  };

  const isRendering = stage !== "idle" && stage !== "complete" && stage !== "failed";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Export Video (MP4)</h2>
              <p className="text-xs text-slate-400">Deterministic HyperFrames rendering engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRendering}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRenderMode("cloud")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                renderMode === "cloud"
                  ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="font-bold">Cloud Export (MVP Quota)</span>
              <span className="text-[10px] text-slate-400">720p @ 30fps (2 / mo)</span>
            </button>

            <button
              onClick={() => setRenderMode("local")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                renderMode === "local"
                  ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/50"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">Local Desktop Render</span>
              <span className="text-[10px] text-slate-400">Unlimited via CLI/Worker</span>
            </button>
          </div>

          {/* Render Specifications Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Aspect Ratio:</span>
              <span className="font-semibold text-white">{project.aspectRatio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Duration:</span>
              <span className="font-mono font-semibold text-white">{totalDuration}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frame Rate:</span>
              <span className="font-mono font-semibold text-white">{project.fps || 30} FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video Codec:</span>
              <span className="font-mono font-semibold text-white">H.264 / AAC (MP4)</span>
            </div>
          </div>

          {/* Render Status & Honest Progress */}
          {stage !== "idle" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-blue-400">
                  Stage: {stage}
                </span>
                <span className="font-mono text-white font-bold">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-medium">{stageMessage}</p>

              {stage === "complete" && downloadUrl && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Video ready for download
                  </span>
                  <a
                    href={downloadUrl}
                    download={`${project.title.replace(/\s+/g, "_")}.mp4`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download MP4
                  </a>
                </div>
              )}

              {stage === "failed" && (
                <div className="text-red-400 flex items-center gap-1.5 pt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error || "Export failed"}</span>
                </div>
              )}
            </div>
          )}

          {/* CLI Instructions for Local Render */}
          {renderMode === "local" && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Run in terminal:</span>
              </div>
              <div className="bg-slate-900 p-2 rounded text-blue-400 select-all">
                npm run render-worker -- --project project.json --output render.mp4
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/30 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isRendering}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition disabled:opacity-30"
          >
            Close
          </button>

          {stage !== "complete" && (
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Start MP4 Export</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
