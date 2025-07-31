// Core data types
export interface Block {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string[];
  tags: string[];
  position: { x: number; y: number };
  parameters: Parameter[];
  inputs: ConnectionPoint[];
  outputs: ConnectionPoint[];
  metadata: BlockMetadata;
}

export interface Parameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select' | 'range';
  value: any;
  default: any;
  constraints?: ParameterConstraints;
  modulation?: ModulationSource;
}

export interface ParameterConstraints {
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface ModulationSource {
  blockId: string;
  parameterId: string;
  amount: number;
}

export interface ConnectionPoint {
  id: string;
  name: string;
  type: 'audio' | 'control' | 'pattern';
}

export interface Connection {
  id: string;
  source: { blockId: string; outputId: string };
  target: { blockId: string; inputId: string };
  color?: string;
  weight?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  created: Date;
  modified: Date;
  canvas: CanvasState;
  blocks: Block[];
  connections: Connection[];
  settings: ProjectSettings;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  viewport: { width: number; height: number };
}

export interface ProjectSettings {
  bpm: number;
  volume: number;
  theme: string;
}

export interface BlockMetadata {
  version: string;
  author: string;
  documentation: string;
}