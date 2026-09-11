// Web Speech API wrapper for Text-to-Speech

export class TTSService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  
  static speak(
    text: string, 
    lang = 'en-US', 
    rate = 1.0, 
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.synth) return false;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best natural voice if available
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  static pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  static resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  static isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking && !this.synth.paused;
  }

  static isPaused(): boolean {
    return !!this.synth && this.synth.paused;
  }
}
