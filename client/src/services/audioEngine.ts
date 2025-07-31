import * as Tone from 'tone';

export class AudioEngine {
  private static instance: AudioEngine;
  private context: AudioContext | null = null;
  private isInitialized = false;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();
    this.context = Tone.context.rawContext;
    this.isInitialized = true;
    console.log('Audio engine initialized');
  }

  async play(pattern: string): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    // TODO: Implement Strudel pattern playback
    console.log('Playing pattern:', pattern);
    
    // Example: Simple tone playback
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C4", "8n");
  }

  stop(): void {
    Tone.Transport.stop();
    console.log('Audio engine stopped');
  }

  pause(): void {
    Tone.Transport.pause();
    console.log('Audio engine paused');
  }

  setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Tone.Destination.volume.value = Tone.gainToDb(clampedVolume);
  }

  setBPM(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
  }

  isPlaying(): boolean {
    return Tone.Transport.state === 'started';
  }

  getContext(): AudioContext | null {
    return this.context;
  }

  dispose(): void {
    if (this.context) {
      Tone.Transport.stop();
      Tone.context.dispose();
      this.isInitialized = false;
      this.context = null;
    }
  }
}