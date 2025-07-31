import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MultiBackend, getBackendOptions } from 'react-dnd-multi-backend';
import { StrudelCanvas } from '@components/canvas/StrudelCanvas';
import { BlockLibrary } from './BlockLibrary';
import { PropertiesPanel } from './PropertiesPanel';
import { PlaybackControls } from './PlaybackControls';
import { useWorkspaceStore } from '@stores/workspaceStore';
import type { Project } from '@types';

const dndOptions = getBackendOptions({
  html5: HTML5Backend,
  touch: { backend: TouchBackend, options: { enableMouseEvents: true } },
});

export const Workspace: React.FC = () => {
  const { currentProject, loadProject } = useWorkspaceStore();

  useEffect(() => {
    // Create default project if none exists
    if (!currentProject) {
      const defaultProject: Project = {
        id: crypto.randomUUID(),
        name: 'Untitled Project',
        description: 'A new StrudelView project',
        version: '1.0.0',
        created: new Date(),
        modified: new Date(),
        canvas: {
          zoom: 1,
          pan: { x: 0, y: 0 },
          viewport: { width: 1920, height: 1080 }
        },
        blocks: [],
        connections: [],
        settings: {
          bpm: 120,
          volume: 0.8,
          theme: 'dark'
        }
      };
      loadProject(defaultProject);
    }
  }, [currentProject, loadProject]);

  return (
    <DndProvider backend={MultiBackend} options={dndOptions}>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Left sidebar - Block Library */}
        <div className="w-64 bg-gray-800 border-r border-gray-700">
          <BlockLibrary />
        </div>

        {/* Main canvas area */}
        <div className="flex-1 flex flex-col">
          {/* Top bar - Playback Controls */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-center">
            <PlaybackControls />
          </div>

          {/* Canvas */}
          <div className="flex-1">
            <StrudelCanvas />
          </div>
        </div>

        {/* Right sidebar - Properties Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <PropertiesPanel />
        </div>
      </div>
    </DndProvider>
  );
};