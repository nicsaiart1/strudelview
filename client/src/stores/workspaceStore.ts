import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Block, Connection, Project, CanvasState } from '@types';

interface WorkspaceState {
  // State
  currentProject: Project | null;
  selectedBlocks: string[];
  selectedConnections: string[];
  canvas: CanvasState;
  
  // Actions
  createBlock: (type: string, position: { x: number; y: number }) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  createConnection: (source: { blockId: string; outputId: string }, target: { blockId: string; inputId: string }) => void;
  deleteConnection: (id: string) => void;
  selectBlocks: (ids: string[]) => void;
  updateCanvas: (updates: Partial<CanvasState>) => void;
  loadProject: (project: Project) => void;
  saveProject: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: null,
      selectedBlocks: [],
      selectedConnections: [],
      canvas: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        viewport: { width: 1920, height: 1080 }
      },

      // Actions
      createBlock: (type, position) => {
        const state = get();
        if (!state.currentProject) return;

        const newBlock: Block = {
          id: crypto.randomUUID(),
          type,
          name: type,
          description: `${type} block`,
          category: [type],
          tags: [type],
          position,
          parameters: [],
          inputs: [],
          outputs: [],
          metadata: {
            version: '1.0.0',
            author: 'StrudelView',
            documentation: ''
          }
        };

        set((state) => ({
          currentProject: state.currentProject ? {
            ...state.currentProject,
            blocks: [...state.currentProject.blocks, newBlock],
            modified: new Date()
          } : null
        }));
      },
      
      updateBlock: (id, updates) => {
        const state = get();
        if (!state.currentProject) return;

        set((state) => ({
          currentProject: state.currentProject ? {
            ...state.currentProject,
            blocks: state.currentProject.blocks.map(block =>
              block.id === id ? { ...block, ...updates } : block
            ),
            modified: new Date()
          } : null
        }));
      },

      deleteBlock: (id) => {
        const state = get();
        if (!state.currentProject) return;

        set((state) => ({
          currentProject: state.currentProject ? {
            ...state.currentProject,
            blocks: state.currentProject.blocks.filter(block => block.id !== id),
            connections: state.currentProject.connections.filter(
              conn => conn.source.blockId !== id && conn.target.blockId !== id
            ),
            modified: new Date()
          } : null
        }));
      },

      createConnection: (source, target) => {
        const state = get();
        if (!state.currentProject) return;

        const newConnection: Connection = {
          id: crypto.randomUUID(),
          source,
          target
        };

        set((state) => ({
          currentProject: state.currentProject ? {
            ...state.currentProject,
            connections: [...state.currentProject.connections, newConnection],
            modified: new Date()
          } : null
        }));
      },

      deleteConnection: (id) => {
        const state = get();
        if (!state.currentProject) return;

        set((state) => ({
          currentProject: state.currentProject ? {
            ...state.currentProject,
            connections: state.currentProject.connections.filter(conn => conn.id !== id),
            modified: new Date()
          } : null
        }));
      },

      selectBlocks: (ids) => {
        set({ selectedBlocks: ids });
      },

      updateCanvas: (updates) => {
        set((state) => ({
          canvas: { ...state.canvas, ...updates }
        }));
      },

      loadProject: (project) => {
        set({
          currentProject: project,
          selectedBlocks: [],
          selectedConnections: []
        });
      },

      saveProject: () => {
        const state = get();
        if (!state.currentProject) return;
        
        // TODO: Implement project saving logic
        console.log('Saving project:', state.currentProject.name);
      }
    }),
    { name: 'workspace-store' }
  )
);