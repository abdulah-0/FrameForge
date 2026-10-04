import React, { useState, useEffect, useCallback } from "react";
import {
  Project,
  Scene,
  createDefaultProject,
  calculateTotalDuration,
  validateProject,
} from "@frameforge/project-schema";
import { MockAIProvider } from "@frameforge/providers";
import { Header } from "./components/Header";
import { SceneList } from "./components/SceneList";
import { PreviewPlayer } from "./components/PreviewPlayer";
import { PropertyInspector } from "./components/PropertyInspector";
import { NewProjectModal } from "./components/NewProjectModal";
import { ExportModal } from "./components/ExportModal";
import { MediaPickerModal } from "./components/MediaPickerModal";
import { Dashboard } from "./components/Dashboard";

const PROJECTS_STORAGE_KEY = "frameforge_projects_collection_v1";
const ACTIVE_ID_STORAGE_KEY = "frameforge_active_project_id_v1";

export const App: React.FC = () => {
  // Load saved projects list or initialize with starter demo
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      createDefaultProject({
        title: "AuraPods Commercial",
        videoType: "product-ad",
        aspectRatio: "9:16",
      }),
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_STORAGE_KEY);
      if (savedId) return savedId;
    } catch {}
    return projects[0]?.projectId || "proj_1";
  });

  const [currentView, setCurrentView] = useState<"editor" | "dashboard">("editor");

  // History stack for Undo / Redo
  const [history, setHistory] = useState<{
    past: Project[];
    future: Project[];
  }>({ past: [], future: [] });

  const activeProject =
    projects.find((p) => p.projectId === activeProjectId) || projects[0];

  const [selectedSceneId, setSelectedSceneId] = useState<string>(() => {
    return activeProject?.scenes[0]?.id || "scene_1";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Sync projects to localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
        localStorage.setItem(ACTIVE_ID_STORAGE_KEY, activeProjectId);
      } catch (err) {
        console.error("Storage save error:", err);
      }
      setIsSaving(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [projects, activeProjectId]);

  const updateCurrentProject = useCallback(
    (updater: (prev: Project) => Project) => {
      setProjects((allProjects) => {
        const curr = allProjects.find((p) => p.projectId === activeProjectId);
        if (!curr) return allProjects;

        const next = updater(curr);

        // Record history
        setHistory((h) => ({
          past: [...h.past.slice(-25), curr],
          future: [],
        }));

        return allProjects.map((p) => (p.projectId === activeProjectId ? next : p));
      });
    },
    [activeProjectId]
  );

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);

    setHistory((h) => ({
      past: newPast,
      future: [activeProject, ...h.future],
    }));

    setProjects((all) =>
      all.map((p) => (p.projectId === activeProjectId ? previous : p))
    );
  }, [history, activeProject, activeProjectId]);

  const handleRedo = useCallback(() => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    setHistory((h) => ({
      past: [...h.past, activeProject],
      future: newFuture,
    }));

    setProjects((all) =>
      all.map((p) => (p.projectId === activeProjectId ? next : p))
    );
  }, [history, activeProject, activeProjectId]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  const selectedScene =
    activeProject.scenes.find((s) => s.id === selectedSceneId) ||
    activeProject.scenes[0];

  const totalDuration = calculateTotalDuration(activeProject.scenes);

  // Scene Operations
  const handleUpdateScene = (updated: Scene) => {
    updateCurrentProject((prev) => ({
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
      headline: "New Key Point",
      body: "Describe the essential details or benefits here.",
      caption: "KEY HIGHLIGHT",
      narrationText: "Here is an important point to remember.",
      media: { type: "none" },
      motion: "smooth-fade",
    };

    updateCurrentProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setSelectedSceneId(newId);
  };

  const handleDeleteScene = (id: string) => {
    if (activeProject.scenes.length <= 3) return;
    const remaining = activeProject.scenes.filter((s) => s.id !== id);
    updateCurrentProject((prev) => ({
      ...prev,
      scenes: remaining,
    }));
    if (selectedSceneId === id) {
      setSelectedSceneId(remaining[0].id);
    }
  };

  const handleDuplicateScene = (id: string) => {
    const target = activeProject.scenes.find((s) => s.id === id);
    if (!target) return;

    const dupId = `scene_${Date.now()}`;
    const duplicate: Scene = {
      ...target,
      id: dupId,
      headline: `${target.headline} (Copy)`,
    };

    const targetIdx = activeProject.scenes.findIndex((s) => s.id === id);
    const updated = [...activeProject.scenes];
    updated.splice(targetIdx + 1, 0, duplicate);

    updateCurrentProject((prev) => ({
      ...prev,
      scenes: updated,
    }));
    setSelectedSceneId(dupId);
  };

  const handleMoveScene = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeProject.scenes.length) return;

    const updated = [...activeProject.scenes];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    updateCurrentProject((prev) => ({
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
      setProjects((all) => [fresh, ...all]);
      setActiveProjectId(fresh.projectId);
      setSelectedSceneId(fresh.scenes[0].id);
      setIsNewModalOpen(false);
      setCurrentView("editor");
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
      setProjects((all) => [generated, ...all]);
      setActiveProjectId(generated.projectId);
      setSelectedSceneId(generated.scenes[0].id);
      setIsNewModalOpen(false);
      setCurrentView("editor");
    } catch (err: any) {
      alert(`AI Generation error: ${err.message}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find((p) => p.projectId === id);
    if (!target) return;

    const copyId = `proj_${Date.now()}`;
    const copy: Project = {
      ...target,
      projectId: copyId,
      title: `${target.title} (Copy)`,
    };

    setProjects((all) => [copy, ...all]);
    setActiveProjectId(copyId);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter((p) => p.projectId !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].projectId);
      setSelectedSceneId(remaining[0].scenes[0]?.id || "scene_1");
    }
  };

  const handleImportProject = (imported: unknown) => {
    const val = validateProject(imported);
    if (!val.success) {
      alert(`Invalid project JSON: ${val.errors?.join(", ")}`);
      return;
    }
    const clean = val.data!;
    clean.projectId = `proj_imported_${Date.now()}`;
    setProjects((all) => [clean, ...all]);
    setActiveProjectId(clean.projectId);
    setSelectedSceneId(clean.scenes[0].id);
    setCurrentView("editor");
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(activeProject, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProject.title.replace(/\s+/g, "_")}_project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadFixture = (type: "faceless" | "product-ad" | "explainer") => {
    const fresh = createDefaultProject({
      title: `${type === "faceless" ? "3 Focus Secrets" : type === "product-ad" ? "AuraPods Commercial" : "Neural Networks Explainer"}`,
      videoType: type,
      aspectRatio: type === "explainer" ? "16:9" : "9:16",
    });
    setProjects((all) => [fresh, ...all]);
    setActiveProjectId(fresh.projectId);
    setSelectedSceneId(fresh.scenes[0].id);
    setCurrentView("editor");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        project={activeProject}
        onUpdateProject={updateCurrentProject}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isSaving={isSaving}
        totalDuration={totalDuration}
        currentView={currentView}
        onToggleView={() =>
          setCurrentView((v) => (v === "editor" ? "dashboard" : "editor"))
        }
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExportJSON={handleExportJSON}
      />

      {/* Main View: Dashboard vs Studio Editor */}
      {currentView === "dashboard" ? (
        <Dashboard
          projects={projects}
          activeProjectId={activeProjectId}
          onOpenProject={(id) => {
            setActiveProjectId(id);
            setCurrentView("editor");
          }}
          onNewProject={() => setIsNewModalOpen(true)}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onImportProject={handleImportProject}
          onLoadFixture={handleLoadFixture}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Scene List */}
          <SceneList
            scenes={activeProject.scenes}
            selectedSceneId={selectedSceneId}
            onSelectScene={setSelectedSceneId}
            onAddScene={handleAddScene}
            onDeleteScene={handleDeleteScene}
            onDuplicateScene={handleDuplicateScene}
            onMoveScene={handleMoveScene}
          />

          {/* Center: Live Video Player Preview */}
          <PreviewPlayer
            project={activeProject}
            selectedSceneId={selectedSceneId}
            onSelectScene={setSelectedSceneId}
            totalDuration={totalDuration}
          />

          {/* Right: Property Inspector */}
          <PropertyInspector
            project={activeProject}
            selectedScene={selectedScene}
            onUpdateScene={handleUpdateScene}
            onUpdateBranding={(branding) =>
              updateCurrentProject((prev) => ({ ...prev, branding }))
            }
            onUpdateAudio={(audio) =>
              updateCurrentProject((prev) => ({ ...prev, audio }))
            }
            onOpenMediaPicker={() => setIsMediaPickerOpen(true)}
          />
        </div>
      )}

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
        project={activeProject}
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
