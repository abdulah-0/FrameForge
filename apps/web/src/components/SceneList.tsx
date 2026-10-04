import React from "react";
import { Scene } from "@frameforge/project-schema";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Copy,
  Clock,
  Sparkles,
} from "lucide-react";
import { SCENE_LAYOUTS } from "@frameforge/shared";

interface SceneListProps {
  scenes: Scene[];
  selectedSceneId: string;
  onSelectScene: (id: string) => void;
  onAddScene: (layout: Scene["layout"]) => void;
  onDeleteScene: (id: string) => void;
  onDuplicateScene: (id: string) => void;
  onMoveScene: (index: number, direction: "up" | "down") => void;
}

export const SceneList: React.FC<SceneListProps> = ({
  scenes,
  selectedSceneId,
  onSelectScene,
  onAddScene,
  onDeleteScene,
  onDuplicateScene,
  onMoveScene,
}) => {
  return (
    <aside className="w-80 border-r border-slate-800 bg-[#0c1220]/60 flex flex-col h-[calc(100vh-4rem)] select-none">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Storyboard Scenes ({scenes.length})</span>
        </div>

        <button
          onClick={() => onAddScene("text-over-media")}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {scenes.map((scene, index) => {
          const isSelected = scene.id === selectedSceneId;
          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(scene.id)}
              className={`group relative rounded-xl border p-3 cursor-pointer transition flex flex-col gap-2 ${
                isSelected
                  ? "bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {/* Scene top meta bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                    {index + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                    {scene.layout.replace(/-/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{scene.durationSeconds}s</span>
                </div>
              </div>

              {/* Headline snippet */}
              <p className="text-xs font-medium text-slate-200 line-clamp-2">
                {scene.headline || "Untitled scene"}
              </p>

              {/* Subtitle / body snippet */}
              {scene.body && (
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {scene.body}
                </p>
              )}

              {/* Scene Action Toolbar */}
              <div
                className={`pt-1 border-t border-slate-800/80 flex items-center justify-between text-slate-400 ${
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition`}
              >
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveScene(index, "up");
                    }}
                    className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === scenes.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveScene(index, "down");
                    }}
                    className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateScene(scene.id);
                    }}
                    className="p-1 hover:text-white transition"
                    title="Duplicate scene"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {scenes.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene(scene.id);
                      }}
                      className="p-1 hover:text-red-400 transition"
                      title="Delete scene"
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
    </aside>
  );
};
