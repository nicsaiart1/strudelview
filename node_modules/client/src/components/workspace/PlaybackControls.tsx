import React, { useState, useEffect } from 'react';
import { Button } from '@components/ui/Button';
import { AudioEngine } from '@services/audioEngine';
import { useWorkspaceStore } from '@stores/workspaceStore';

export const PlaybackControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.8);
  const audioEngine = AudioEngine.getInstance();
  const { currentProject } = useWorkspaceStore();

  useEffect(() => {
    if (currentProject) {
      setBpm(currentProject.settings.bpm);
      setVolume(currentProject.settings.volume);
    }
  }, [currentProject]);

  const handlePlay = async () => {
    if (!isPlaying) {
      await audioEngine.initialize();
      await audioEngine.play('c3 d3 e3 f3'); // Simple test pattern
      setIsPlaying(true);
    } else {
      audioEngine.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    audioEngine.setBPM(newBpm);
    // TODO: Update project settings
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioEngine.setVolume(newVolume);
    // TODO: Update project settings
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Transport Controls */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={handlePlay}
          variant={isPlaying ? 'secondary' : 'primary'}
          size="sm"
          icon={
            isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )
          }
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          onClick={handleStop}
          variant="secondary"
          size="sm"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          }
        >
          Stop
        </Button>
      </div>

      {/* BPM Control */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-300">BPM:</label>
        <input
          type="number"
          value={bpm}
          onChange={(e) => handleBpmChange(parseInt(e.target.value))}
          min={60}
          max={200}
          className="w-16 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-300">Vol:</label>
        <input
          type="range"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          min={0}
          max={1}
          step={0.1}
          className="w-20"
        />
        <span className="text-sm text-gray-400 w-8">{Math.round(volume * 100)}%</span>
      </div>

      {/* Project Info */}
      <div className="flex-1 text-center">
        <span className="text-sm text-gray-300">
          {currentProject?.name || 'No Project'}
        </span>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center space-x-2">
        <Button variant="secondary" size="sm">
          Record
        </Button>
        <Button variant="secondary" size="sm">
          Export
        </Button>
      </div>
    </div>
  );
};