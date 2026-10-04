import React, { useState } from "react";
import { Project, Scene } from "@frameforge/project-schema";
import {
  SCENE_LAYOUTS,
  MOTION_PRESETS,
  LIMITS,
} from "@frameforge/shared";
import {
  Sliders,
  Palette,
  Music,
  Image as ImageIcon,
  Type,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface PropertyInspectorProps {
  project: Project;
  selectedScene: Scene;
  onUpdateScene: (updated: Scene) => void;
  onUpdateBranding: (branding: Project["branding"]) => void;
  onUpdateAudio: (audio: Project["audio"]) => void;
  onOpenMediaPicker: () => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  project,
  selectedScene,
  onUpdateScene,
  onUpdateBranding,
  onUpdateAudio,
  onOpenMediaPicker,
}) => {
  const [activeTab, setActiveTab] = useState<"scene" | "branding" | "audio">("scene");

  return (
    <aside className="w-88 border-l border-slate-800 bg-[#0c1220]/80 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 p-1">
        <button
          onClick={() => setActiveTab("scene")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "scene"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>Scene</span>
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "branding"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>Branding</span>
        </button>

        <button
          onClick={() => setActiveTab("audio")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeTab === "audio"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Music className="w-3.5 h-3.5 text-emerald-400" />
          <span>Audio</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
        {activeTab === "scene" && (
          <>
            {/* Layout */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Scene Layout</label>
              <select
                value={selectedScene.layout}
                onChange={(e) =>
                  onUpdateScene({
                    ...selectedScene,
                    layout: e.target.value as Scene["layout"],
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {SCENE_LAYOUTS.map((lay) => (
                  <option key={lay} value={lay}>
                    {lay.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Motion Preset */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Motion Preset</label>
              <select
                value={selectedScene.motion}
                onChange={(e) =>
                  onUpdateScene({
                    ...selectedScene,
                    motion: e.target.value as Scene["motion"],
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {MOTION_PRESETS.map((mot) => (
                  <option key={mot} value={mot}>
                    {mot.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-200">Duration</label>
                <span className="font-mono text-blue-400 font-bold">
                  {selectedScene.durationSeconds}s
                </span>
              </div>
              <input
                type="range"
                min={LIMITS.MIN_SCENE_DURATION_SECONDS}
                max={LIMITS.MAX_SCENE_DURATION_SECONDS}
                step="0.5"
                value={selectedScene.durationSeconds}
                onChange={(e) =>
                  onUpdateScene({
                    ...selectedScene,
                    durationSeconds: parseFloat(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Caption Pill */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Caption / Badge</label>
              <input
                type="text"
                value={selectedScene.caption || ""}
                onChange={(e) =>
                  onUpdateScene({ ...selectedScene, caption: e.target.value })
                }
                placeholder="e.g. LIMITED TIME OFFER"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Headline Text</label>
              <textarea
                rows={2}
                value={selectedScene.headline}
                onChange={(e) =>
                  onUpdateScene({ ...selectedScene, headline: e.target.value })
                }
                placeholder="Enter catchy headline..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-medium"
              />
            </div>

            {/* Body Text */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Body Copy / Bullets</label>
              <textarea
                rows={3}
                value={selectedScene.body || ""}
                onChange={(e) =>
                  onUpdateScene({ ...selectedScene, body: e.target.value })
                }
                placeholder="Supporting description or bullet points..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Narration Voiceover Script */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Voiceover Narration Script</span>
              </label>
              <textarea
                rows={2}
                value={selectedScene.narrationText || ""}
                onChange={(e) =>
                  onUpdateScene({ ...selectedScene, narrationText: e.target.value })
                }
                placeholder="Spoken narration for this scene..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-[11px]"
              />
            </div>

            {/* Media Backdrop */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="font-semibold text-slate-200 flex items-center justify-between">
                <span>Visual Media</span>
                {selectedScene.media?.url && (
                  <button
                    onClick={() =>
                      onUpdateScene({
                        ...selectedScene,
                        media: { type: "none", url: "" },
                      })
                    }
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </label>

              {selectedScene.media?.url ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-28 group">
                  <img
                    src={selectedScene.media.url}
                    alt="Current media"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <button
                      onClick={onOpenMediaPicker}
                      className="px-3 py-1.5 bg-blue-600 rounded-md text-white font-semibold text-xs shadow-md"
                    >
                      Change Media
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onOpenMediaPicker}
                  className="w-full border-2 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition"
                >
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                  <span className="font-medium text-slate-400">
                    Add Image / Stock Asset
                  </span>
                </button>
              )}
            </div>
          </>
        )}

        {activeTab === "branding" && (
          <>
            {/* Primary Accent Color */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Primary Accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={project.branding.primaryColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      primaryColor: e.target.value,
                    })
                  }
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                />
                <input
                  type="text"
                  value={project.branding.primaryColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      primaryColor: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Secondary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={project.branding.secondaryColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                />
                <input
                  type="text"
                  value={project.branding.secondaryColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Background Canvas</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={project.branding.backgroundColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-800"
                />
                <input
                  type="text"
                  value={project.branding.backgroundColor}
                  onChange={(e) =>
                    onUpdateBranding({
                      ...project.branding,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-200"
                />
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Typography Font</label>
              <select
                value={project.branding.fontFamily}
                onChange={(e) =>
                  onUpdateBranding({
                    ...project.branding,
                    fontFamily: e.target.value,
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                <option value="'Oswald', sans-serif">Oswald (Bold Impact)</option>
                <option value="'Montserrat', sans-serif">Montserrat (Geometric)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono (Tech/Code)</option>
              </select>
            </div>

            {/* Brand Logo URL */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Logo URL (Optional)</label>
              <input
                type="text"
                value={project.branding.logoUrl || ""}
                onChange={(e) =>
                  onUpdateBranding({
                    ...project.branding,
                    logoUrl: e.target.value,
                  })
                }
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {activeTab === "audio" && (
          <>
            {/* Background Music Volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-200">Music Volume</label>
                <span className="font-mono text-blue-400 font-bold">
                  {Math.round(project.audio.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={project.audio.musicVolume}
                onChange={(e) =>
                  onUpdateAudio({
                    ...project.audio,
                    musicVolume: parseFloat(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Narration Volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-200">Narration Volume</label>
                <span className="font-mono text-blue-400 font-bold">
                  {Math.round(project.audio.narrationVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={project.audio.narrationVolume}
                onChange={(e) =>
                  onUpdateAudio({
                    ...project.audio,
                    narrationVolume: parseFloat(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Music Track URL */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Background Audio URL</label>
              <input
                type="text"
                value={project.audio.musicUrl || ""}
                onChange={(e) =>
                  onUpdateAudio({
                    ...project.audio,
                    musicUrl: e.target.value,
                  })
                }
                placeholder="https://example.com/audio.mp3"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
