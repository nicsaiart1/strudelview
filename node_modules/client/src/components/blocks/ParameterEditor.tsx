import React from 'react';
import type { Parameter } from '@types';

interface ParameterEditorProps {
  parameter: Parameter;
  onChange: (value: any) => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameter,
  onChange,
}) => {
  const renderInput = () => {
    switch (parameter.type) {
      case 'number':
        return (
          <input
            type="number"
            value={parameter.value}
            min={parameter.constraints?.min}
            max={parameter.constraints?.max}
            step={parameter.constraints?.step || 0.1}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        );
      
      case 'range':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              value={parameter.value}
              min={parameter.constraints?.min || 0}
              max={parameter.constraints?.max || 100}
              step={parameter.constraints?.step || 1}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 w-8">{parameter.value}</span>
          </div>
        );
      
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={parameter.value}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        );
      
      case 'select':
        return (
          <select
            value={parameter.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {parameter.constraints?.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'string':
      default:
        return (
          <input
            type="text"
            value={parameter.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-gray-700 w-1/3">
        {parameter.name}
      </label>
      <div className="w-2/3">
        {renderInput()}
      </div>
    </div>
  );
};