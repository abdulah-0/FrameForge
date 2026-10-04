import React, { useState, useEffect } from "react";
import {
  Project,
  Scene,
  createDefaultProject,
  calculateTotalDuration,
} from "@frameforge/project-schema";
import { MockAIProvider, GeminiAIProvider } from "@frameforge/providers";
import { Header } from "./components/Header";
import { SceneList } from "./components/SceneList";
import { PreviewPlayer } from "./components/PreviewPlayer";
import { PropertyInspector } from "./components/PropertyInspector";
import { NewProjectModal } from "./components/NewProjectModal";
import { ExportModal } from "./components/ExportModal";
import { MediaPickerModal } from "./components/MediaPickerModal";

const STORAGE_KEY = "frameforge_active_project_v1";

export const App: React.FC = () => {
  const [project, setProject] = useState<Project>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return createDefaultProject({
      title: "FrameForge Studio Demo",
      videoType: "product-ad",
      aspectRatio: "9:16",
    });
  });

  const [selectedSceneId, setSelectedSceneId] = useState<string>(() => {
    return project.scenes[0]?.id || "scene_1";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      } catch (err) {
        console.error("Autosave error:", err);
      }
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [project]);

  const selectedScene =
    project.scenes.find((s) => s.id === selectedSceneId) || project.scenes[0];

  const totalDuration = calculateTotalDuration(project.scenes);

  // Scene Operations
  const handleUpdateScene = (updated: Scene) => {
    setProject((prev) => ({
      ...prev,
      scenes: prev.scenes.map((s) => (s.id === updated.id ? updated : s)),
    }));
  };

  const handleAddScene = (layout: Scene["layout"]) => {
    const newId = `scene_${Date.now()}`;
    const newScene: Scene = {
      id: newId,
      layout,
      durationSeconds: 3.5,
      headline: "New Key Highlight",
      body: "Describe the essential takeaway or point here.",
      caption: "NEW HIGHLIGHT",
      narrationText: "Here is an important point to note.",
      media: { type: "none" },
      motion: "smooth-fade",
    };

    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setSelectedSceneId(newId);
  };

  const handleDeleteScene = (id: string) => {
    if (project.scenes.length <= 3) return; // Keep at least 3 scenes per PRD limits
    const remaining = project.scenes.filter((s) => s.id !== id);
    setProject((prev) => ({
      ...prev,
      scenes: remaining,
    }));
    if (selectedSceneId === id) {
      setSelectedSceneId(remaining[0].id);
    }
  };

  const handleDuplicateScene = (id: string) => {
    const target = project.scenes.find((s) => s.id === id);
    if (!target) return;

    const dupId = `scene_${Date.now()}`;
    const duplicate: Scene = {
      ...target,
      id: dupId,
      headline: `${target.headline} (Copy)`,
    };

    const targetIdx = project.scenes.findIndex((s) => s.id === id);
    const updated = [...project.scenes];
    updated.splice(targetIdx + 1, 0, duplicate);

    setProject((prev) => ({
      ...prev,
      scenes: updated,
    }));
    setSelectedSceneId(dupId);
  };

  const handleMoveScene = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= project.scenes.length) return;

    const updated = [...project.scenes];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setProject((prev) => ({
      ...prev,
      scenes: updated,
    }));
  };

  // Create Project from Wizard
  const handleCreateProject = async (opts: {
    title: string;
    videoType: any;
    aspectRatio: any;
    topic: string;
    useAI: boolean;
  }) => {
    if (!opts.useAI) {
      const fresh = createDefaultProject({
        title: opts.title,
        videoType: opts.videoType,
        aspectRatio: opts.aspectRatio,
        briefPrompt: opts.topic,
      });
      setProject(fresh);
      setSelectedSceneId(fresh.scenes[0].id);
      setIsNewModalOpen(false);
      return;
    }

    setIsGeneratingAI(true);
    try {
      const provider = new MockAIProvider();
      const generated = await provider.generateStoryboard({
        topic: opts.topic,
        videoType: opts.videoType,
        aspectRatio: opts.aspectRatio,
      });
      setProject(generated);
      setSelectedSceneId(generated.scenes[0].id);
      setIsNewModalOpen(false);
    } catch (err: any) {
      alert(`AI Generation error: ${err.message}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        project={project}
        onUpdateProject={setProject}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isSaving={isSaving}
        totalDuration={totalDuration}
      />

      {/* Main Studio 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Scene List */}
        <SceneList
          scenes={project.scenes}
          selectedSceneId={selectedSceneId}
          onSelectScene={setSelectedSceneId}
          onAddScene={handleAddScene}
          onDeleteScene={handleDeleteScene}
          onDuplicateScene={handleDuplicateScene}
          onMoveScene={handleMoveScene}
        />

        {/* Center: Live Video Player Preview */}
        <PreviewPlayer
          project={project}
          selectedSceneId={selectedSceneId}
          onSelectScene={setSelectedSceneId}
          totalDuration={totalDuration}
        />

        {/* Right: Scene, Branding & Audio Property Inspector */}
        <PropertyInspector
          project={project}
          selectedScene={selectedScene}
          onUpdateScene={handleUpdateScene}
          onUpdateBranding={(branding) =>
            setProject((prev) => ({ ...prev, branding }))
          }
          onUpdateAudio={(audio) =>
            setProject((prev) => ({ ...prev, audio }))
          }
          onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
        />
      </div>

      {/* Modals */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreateProject={handleCreateProject}
        isGeneratingAI={isGeneratingAI}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        totalDuration={totalDuration}
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelectMedia={(item) => {
          handleUpdateScene({
            ...selectedScene,
            media: {
              type: "image",
              url: item.url,
              alt: item.alt,
              fit: "cover",
            },
          });
        }}
      />
    </div>
  );
};
export default App;
