import React from 'react';
import { useDrag } from 'react-dnd';

interface BlockTypeProps {
  type: string;
  name: string;
  description: string;
  category: string;
}

const BlockType: React.FC<BlockTypeProps> = ({ type, name, description, category }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'block-type',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 bg-gray-700 rounded-lg cursor-move transition-opacity ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } hover:bg-gray-600`}
    >
      <div className="font-medium text-sm">{name}</div>
      <div className="text-xs text-gray-400 mt-1">{description}</div>
      <div className="text-xs text-blue-400 mt-1">{category}</div>
    </div>
  );
};

const blockTypes = [
  {
    type: 'oscillator',
    name: 'Oscillator',
    description: 'Basic sound generator',
    category: 'Sources'
  },
  {
    type: 'filter',
    name: 'Filter',
    description: 'Audio filter for sound shaping',
    category: 'Effects'
  },
  {
    type: 'sequencer',
    name: 'Sequencer',
    description: 'Pattern sequencer',
    category: 'Sequencing'
  },
  {
    type: 'envelope',
    name: 'Envelope',
    description: 'ADSR envelope generator',
    category: 'Modulation'
  },
  {
    type: 'lfo',
    name: 'LFO',
    description: 'Low frequency oscillator',
    category: 'Modulation'
  },
  {
    type: 'reverb',
    name: 'Reverb',
    description: 'Reverb effect',
    category: 'Effects'
  },
  {
    type: 'delay',
    name: 'Delay',
    description: 'Delay/echo effect',
    category: 'Effects'
  },
  {
    type: 'mixer',
    name: 'Mixer',
    description: 'Audio mixer',
    category: 'Utility'
  }
];

const categories = ['Sources', 'Effects', 'Sequencing', 'Modulation', 'Utility'];

export const BlockLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredBlocks = selectedCategory
    ? blockTypes.filter(block => block.category === selectedCategory)
    : blockTypes;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Block Library</h2>
      
      {/* Category filter */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Categories</div>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left px-2 py-1 text-xs rounded ${
              selectedCategory === null ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-2 py-1 text-xs rounded ${
                selectedCategory === category ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Block types */}
      <div className="space-y-2">
        {filteredBlocks.map(block => (
          <BlockType
            key={block.type}
            type={block.type}
            name={block.name}
            description={block.description}
            category={block.category}
          />
        ))}
      </div>
    </div>
  );
};