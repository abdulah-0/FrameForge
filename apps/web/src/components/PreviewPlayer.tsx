import React, { useState, useEffect, useRef } from "react";
import { Project, Scene } from "@frameforge/project-schema";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";

interface PreviewPlayerProps {
  project: Project;
  selectedSceneId: string;
  onSelectScene: (id: string) => void;
  totalDuration: number;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  project,
  selectedSceneId,
  onSelectScene,
  totalDuration,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Compute scene time intervals
  const sceneIntervals = project.scenes.map((s, idx) => {
    const start = project.scenes
      .slice(0, idx)
      .reduce((acc, curr) => acc + curr.durationSeconds, 0);
    return {
      scene: s,
      start,
      end: start + s.durationSeconds,
    };
  });

  // Find active scene based on current playhead
  const activeInterval =
    sceneIntervals.find(
      (int) => currentTime >= int.start && currentTime < int.end
    ) || sceneIntervals[sceneIntervals.length - 1];

  const activeScene = activeInterval?.scene || project.scenes[0];

  // Auto-sync selected scene when user navigates
  useEffect(() => {
    if (activeScene && activeScene.id !== selectedSceneId && isPlaying) {
      onSelectScene(activeScene.id);
    }
  }, [activeScene, selectedSceneId, isPlaying, onSelectScene]);

  // Jump to selected scene start when clicked from scene list while paused
  useEffect(() => {
    if (!isPlaying) {
      const target = sceneIntervals.find((int) => int.scene.id === selectedSceneId);
      if (target) {
        setCurrentTime(target.start);
      }
    }
  }, [selectedSceneId]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      const step = (timestamp: number) => {
        if (lastTimestampRef.current !== null) {
          const delta = (timestamp - lastTimestampRef.current) / 1000;
          setCurrentTime((prev) => {
            const next = prev + delta;
            if (next >= totalDuration) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTimestampRef.current = timestamp;
        animFrameRef.current = requestAnimationFrame(step);
      };

      lastTimestampRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(step);

      return () => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        lastTimestampRef.current = null;
      };
    }
  }, [isPlaying, totalDuration]);

  const togglePlay = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const stepScene = (dir: "prev" | "next") => {
    const currIdx = sceneIntervals.findIndex(
      (int) => int.scene.id === activeScene.id
    );
    if (dir === "prev") {
      const prevIdx = Math.max(0, currIdx - 1);
      setCurrentTime(sceneIntervals[prevIdx].start);
      onSelectScene(sceneIntervals[prevIdx].scene.id);
    } else {
      const nextIdx = Math.min(sceneIntervals.length - 1, currIdx + 1);
      setCurrentTime(sceneIntervals[nextIdx].start);
      onSelectScene(sceneIntervals[nextIdx].scene.id);
    }
  };

  const isPortrait = project.aspectRatio === "9:16";

  // Compute progress through active scene for smooth in-scene CSS animation
  const sceneProgress = activeInterval
    ? Math.min(1, Math.max(0, (currentTime - activeInterval.start) / activeScene.durationSeconds))
    : 0;

  return (
    <main className="flex-1 flex flex-col bg-[#070a12] items-center justify-between p-6 select-none relative overflow-hidden">
      {/* Top player badge info */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 max-w-4xl px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Live HyperFrames Preview</span>
          <span className="text-slate-600">|</span>
          <span>Scene {project.scenes.findIndex((s) => s.id === activeScene.id) + 1} of {project.scenes.length}</span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span>{currentTime.toFixed(1)}s</span>
          <span className="text-slate-600">/</span>
          <span>{totalDuration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="flex-1 flex items-center justify-center w-full my-4">
        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-800 transition-all ${
            isPortrait
              ? "h-[540px] aspect-[9/16]"
              : "w-[720px] aspect-[16/9]"
          }`}
          style={{
            backgroundColor: project.branding.backgroundColor || "#090d16",
            fontFamily: project.branding.fontFamily || "Inter, sans-serif",
          }}
        >
          {/* Logo overlay */}
          {project.branding.logoUrl && (
            <img
              src={project.branding.logoUrl}
              alt="Logo"
              className="absolute top-4 left-4 h-8 max-w-[120px] object-contain z-20"
            />
          )}

          {/* Media Backdrop */}
          {activeScene.media?.url && (
            <img
              src={activeScene.media.url}
              alt="Scene media"
              className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-500"
            />
          )}

          {/* Scene Content Layout Container */}
          <div className="relative z-10 w-full h-full p-8 flex flex-col items-center justify-center text-center">
            {/* Caption Pill */}
            {activeScene.caption && (
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-slate-900/80 backdrop-blur-md border border-white/10 transition-all duration-300"
                style={{
                  color: project.branding.primaryColor || "#3b82f6",
                  transform: `translateY(${Math.max(0, (1 - sceneProgress * 2) * 10)}px)`,
                  opacity: Math.min(1, sceneProgress * 4),
                }}
              >
                {activeScene.caption}
              </div>
            )}

            {/* Headline */}
            {activeScene.headline && (
              <h2
                className={`font-black tracking-tight leading-tight text-white mb-3 transition-all duration-300 ${
                  isPortrait ? "text-2xl" : "text-3xl"
                }`}
                style={{
                  transform: `scale(${0.9 + Math.min(0.1, sceneProgress * 0.2)})`,
                  opacity: Math.min(1, sceneProgress * 3),
                }}
              >
                {activeScene.headline}
              </h2>
            )}

            {/* Body text */}
            {activeScene.body && (
              <p
                className={`font-normal text-slate-300 max-w-[90%] whitespace-pre-line leading-relaxed transition-all duration-300 ${
                  isPortrait ? "text-sm" : "text-base"
                }`}
                style={{
                  opacity: Math.min(1, Math.max(0, (sceneProgress - 0.2) * 3)),
                }}
              >
                {activeScene.body}
              </p>
            )}

            {/* Layout Specific Callout */}
            {activeScene.layout === "call-to-action" && (
              <div
                className="mt-6 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 text-sm transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${project.branding.primaryColor || "#3b82f6"}, ${project.branding.secondaryColor || "#1d4ed8"})`,
                  transform: `scale(${Math.min(1, Math.max(0.7, sceneProgress * 1.5))})`,
                }}
              >
                Get Started
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Transport Controls Bar */}
      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-xl shadow-black/40">
        {/* Scrubber Timeline */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 w-10 text-right">
            {currentTime.toFixed(1)}s
          </span>

          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <span className="font-mono text-xs text-slate-400 w-10">
            {totalDuration.toFixed(1)}s
          </span>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTime(0)}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-slate-400 hover:text-white transition"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Core play controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => stepScene("prev")}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Previous scene"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/30 transition transform active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => stepScene("next")}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Next scene"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
