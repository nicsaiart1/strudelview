import React from 'react';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { ParameterEditor } from '@components/blocks/ParameterEditor';

export const PropertiesPanel: React.FC = () => {
  const { currentProject, selectedBlocks, updateBlock } = useWorkspaceStore();

  if (!currentProject) {
    return (
      <div className="p-4 h-full">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="text-gray-400 text-sm">No project loaded</div>
      </div>
    );
  }

  const selectedBlock = selectedBlocks.length === 1 
    ? currentProject.blocks.find(block => block.id === selectedBlocks[0])
    : null;

  if (!selectedBlock) {
    return (
      <div className="p-4 h-full">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="text-gray-400 text-sm">
          {selectedBlocks.length === 0 
            ? 'No block selected' 
            : 'Multiple blocks selected'
          }
        </div>
      </div>
    );
  }

  const handleParameterChange = (parameterId: string, value: any) => {
    const updatedParameters = selectedBlock.parameters.map(param =>
      param.id === parameterId ? { ...param, value } : param
    );
    
    updateBlock(selectedBlock.id, { parameters: updatedParameters });
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      
      {/* Block info */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">{selectedBlock.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{selectedBlock.description}</p>
        <div className="text-xs text-gray-500">
          Type: {selectedBlock.type} | ID: {selectedBlock.id.slice(0, 8)}...
        </div>
      </div>

      {/* Parameters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Parameters</h4>
        {selectedBlock.parameters.length > 0 ? (
          <div className="space-y-3">
            {selectedBlock.parameters.map(parameter => (
              <ParameterEditor
                key={parameter.id}
                parameter={parameter}
                onChange={(value) => handleParameterChange(parameter.id, value)}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400">No parameters available</div>
        )}
      </div>

      {/* Position */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Position</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">X</label>
            <input
              type="number"
              value={selectedBlock.position.x.toFixed(2)}
              onChange={(e) => updateBlock(selectedBlock.id, {
                position: { ...selectedBlock.position, x: parseFloat(e.target.value) }
              })}
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Y</label>
            <input
              type="number"
              value={selectedBlock.position.y.toFixed(2)}
              onChange={(e) => updateBlock(selectedBlock.id, {
                position: { ...selectedBlock.position, y: parseFloat(e.target.value) }
              })}
              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Connections */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Connections</h4>
        
        {/* Inputs */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-400 mb-1">Inputs</div>
          {selectedBlock.inputs.length > 0 ? (
            <div className="space-y-1">
              {selectedBlock.inputs.map(input => (
                <div key={input.id} className="text-xs text-gray-300 px-2 py-1 bg-gray-700 rounded">
                  {input.name} ({input.type})
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500">No inputs</div>
          )}
        </div>

        {/* Outputs */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-400 mb-1">Outputs</div>
          {selectedBlock.outputs.length > 0 ? (
            <div className="space-y-1">
              {selectedBlock.outputs.map(output => (
                <div key={output.id} className="text-xs text-gray-300 px-2 py-1 bg-gray-700 rounded">
                  {output.name} ({output.type})
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500">No outputs</div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Tags</h4>
        <div className="flex flex-wrap gap-1">
          {selectedBlock.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};