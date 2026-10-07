/**
 * Multilingual Speech Recognition & Text-To-Speech (TTS) Service
 * Supports English ('en-IN'), Tamil ('ta-IN'), and Hindi ('hi-IN')
 * Features:
 *  - Explicit microphone permission detection & handling
 *  - Real-time Web Audio API soundwave/volume meter
 *  - Resilient auto-restart on Chrome silence / no-speech timeouts
 *  - Preservation of interim transcripts so spoken words are never lost
 *  - Multi-dialect fallbacks for Text-to-Speech (TTS)
 */

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.shouldBeListening = false;
    this.isMuted = false;
    this.voices = [];
    this.lastRecognizedTranscript = "";
    this.silenceTimer = null;
    this.listenTimeout = null;
    this.startTime = null;

    // Audio level meter instances
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.mediaStream = null;
    this.animFrameId = null;
    this.currentVolume = 0;

    // Preload speech synthesis voices
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch {
      this.voices = [];
    }
  }

  isRecognitionSupported() {
    return (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }

  isTtsSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  /**
   * Request microphone hardware permission explicitly
   */
  async requestMicPermission() {
    if (
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return { ok: true, stream };
      } catch (err) {
        return { ok: false, error: err };
      }
    }
    return { ok: true, stream: null };
  }

  /**
   * Start real-time audio volume analyzer using Web Audio API
   */
  startAudioMeter(stream, onVolume) {
    this.stopAudioMeter();
    if (!stream) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.5;

      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      this.sourceNode.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkMeter = () => {
        if (!this.shouldBeListening) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Scale 0 - 100
        const volume = Math.min(100, Math.round((avg / 128) * 100));
        this.currentVolume = volume;

        if (onVolume) {
          onVolume(volume);
        }

        this.animFrameId = requestAnimationFrame(checkMeter);
      };

      checkMeter();
    } catch (e) {
      console.warn("Audio meter setup skipped:", e);
    }
  }

  stopAudioMeter() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {}
      this.sourceNode = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((t) => t.stop());
      } catch {}
      this.mediaStream = null;
    }
    this.currentVolume = 0;
  }

  /**
   * Start microphone listening
   * @param {object} options - { lang, onResult, onError, onEnd, onStart, onVolume }
   */
  async startListening({
    lang = "en-IN",
    onResult,
    onError,
    onEnd,
    onStart,
    onVolume
  }) {
    if (!this.isRecognitionSupported()) {
      if (onError) {
        onError({
          error: "not-supported",
          message:
            "Speech Recognition is not supported in this browser. Please use Chrome or Edge."
        });
      }
      return false;
    }

    // Stop existing instance
    this.stopListening();

    // 1. Request microphone permission
    const permResult = await this.requestMicPermission();
    if (!permResult.ok) {
      const errName = permResult.error?.name || "";
      let msg = "Microphone access blocked. Please allow microphone access in your browser.";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        msg =
          "Microphone blocked. Please click the lock 🔒 or mic 🎙️ icon in your browser address bar to Allow.";
      } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
        msg = "No microphone hardware found. Please verify your microphone is plugged in.";
      }
      if (onError) {
        onError({ error: "permission-denied", message: msg });
      }
      return false;
    }

    this.mediaStream = permResult.stream;
    this.shouldBeListening = true;
    this.lastRecognizedTranscript = "";
    this.startTime = Date.now();

    // Start live audio meter if stream is available
    if (this.mediaStream) {
      this.startAudioMeter(this.mediaStream, onVolume);
    }

    // Map language code
    let targetLang = "en-IN";
    if (lang === "ta" || lang === "ta-IN") targetLang = "ta-IN";
    else if (lang === "hi" || lang === "hi-IN") targetLang = "hi-IN";
    else if (lang === "en" || lang === "en-US" || lang === "en-IN") targetLang = "en-IN";
    else targetLang = lang;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const initRecognition = () => {
      if (!this.shouldBeListening) return;

      const recognition = new SpeechRecognition();
      recognition.lang = targetLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalAccumulated = "";

      recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalAccumulated += transcriptPart + " ";
          } else {
            interim += transcriptPart;
          }
        }

        const currentSpeech = (finalAccumulated + interim).trim();

        if (currentSpeech.length > 0) {
          this.lastRecognizedTranscript = currentSpeech;

          if (onResult) {
            onResult({
              transcript: currentSpeech,
              isFinal: false,
              volume: this.currentVolume
            });
          }

          // Debounce 1.4s after user stops talking to finalize
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            if (this.shouldBeListening && this.lastRecognizedTranscript.trim()) {
              const textToSend = this.lastRecognizedTranscript.trim();
              this.stopListening();
              if (onResult) {
                onResult({
                  transcript: textToSend,
                  isFinal: true
                });
              }
            }
          }, 1400);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech Recognition Error:", event.error);

        // Chrome triggers 'no-speech' if silent for ~1.5s.
        // DO NOT kill or alert on 'no-speech' — recognition will restart via onend if shouldBeListening
        if (event.error === "no-speech") {
          return;
        }

        if (event.error === "aborted") {
          return;
        }

        if (
          event.error === "not-allowed" ||
          event.error === "permission-denied"
        ) {
          this.shouldBeListening = false;
          this.stopListening();
          if (onError) {
            onError({
              error: event.error,
              message:
                "Microphone access blocked. Click the lock/mic icon in the browser address bar to Allow."
            });
          }
          return;
        }

        if (event.error === "network") {
          // If we already have recognized text, don't throw an error
          if (this.lastRecognizedTranscript.trim()) {
            return;
          }
          if (onError) {
            onError({
              error: event.error,
              message: "Network interrupted while contacting speech service."
            });
          }
        }
      };

      recognition.onend = () => {
        this.isListening = false;

        // Case 1: If user finished speaking and we have a recognized transcript
        if (this.lastRecognizedTranscript && this.lastRecognizedTranscript.trim().length > 0) {
          const finalTrimmed = this.lastRecognizedTranscript.trim();
          this.shouldBeListening = false;
          this.stopAudioMeter();
          if (onEnd) onEnd(finalTrimmed);
          return;
        }

        // Case 2: Chrome terminated on silence ('no-speech') but user is still waiting to speak
        // Auto-restart recognition so mic doesn't abruptly die (up to 25 seconds total)
        const elapsed = Date.now() - (this.startTime || 0);
        if (this.shouldBeListening && elapsed < 25000) {
          try {
            setTimeout(() => {
              if (this.shouldBeListening) {
                initRecognition();
              }
            }, 100);
          } catch {
            this.shouldBeListening = false;
            this.stopListening();
            if (onEnd) onEnd("");
          }
          return;
        }

        // Case 3: Session ended or timed out
        this.shouldBeListening = false;
        this.stopAudioMeter();
        if (onEnd) onEnd("");
      };

      try {
        recognition.start();
        this.recognition = recognition;
      } catch (err) {
        console.warn("Recognition start failed:", err);
      }
    };

    initRecognition();

    // Global session safety timeout (25 seconds max)
    this.listenTimeout = setTimeout(() => {
      if (this.shouldBeListening) {
        const spoken = (this.lastRecognizedTranscript || "").trim();
        this.stopListening();
        if (onEnd) onEnd(spoken);
      }
    }, 25000);

    return true;
  }

  /**
   * Stop microphone listening gracefully
   */
  stopListening() {
    this.shouldBeListening = false;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.listenTimeout) {
      clearTimeout(this.listenTimeout);
      this.listenTimeout = null;
    }

    this.stopAudioMeter();

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    this.isListening = false;
  }

  /**
   * Speak text in detected language
   * @param {string} text
   * @param {string} lang - 'en' | 'ta' | 'hi'
   */
  speak(text, lang = "en") {
    if (!this.isTtsSupported() || this.isMuted || !text) return;

    try {
      window.speechSynthesis.cancel(); // cancel any active speech

      // Clean markdown, asterisks, emojis, bullet points for clean speech synthesis
      const cleanText = text
        .replace(/[*#_~`>•●]/g, "")
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
        .replace(/[\u{2600}-\u{26FF}]/gu, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices =
        this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();
      let selectedVoice = null;

      if (lang === "ta") {
        selectedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("ta") ||
            v.name.toLowerCase().includes("tamil")
        );
        if (selectedVoice) {
          utterance.lang = "ta-IN";
          utterance.voice = selectedVoice;
        } else {
          // Fallback to Indian English voice or default if Tamil voice is not installed on OS
          selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("en-in"));
          utterance.lang = selectedVoice ? "en-IN" : "en-US";
          if (selectedVoice) utterance.voice = selectedVoice;
        }
      } else if (lang === "hi") {
        selectedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi")
        );
        if (selectedVoice) {
          utterance.lang = "hi-IN";
          utterance.voice = selectedVoice;
        } else {
          selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("en-in"));
          utterance.lang = selectedVoice ? "en-IN" : "en-US";
          if (selectedVoice) utterance.voice = selectedVoice;
        }
      } else {
        selectedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().includes("en-in") ||
            v.lang.toLowerCase().includes("en-gb") ||
            v.lang.toLowerCase().includes("en-us")
        );
        utterance.lang = "en-IN";
        if (selectedVoice) utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("TTS failed:", err.message);
    }
  }

  cancelSpeech() {
    if (this.isTtsSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) this.cancelSpeech();
  }
}

export const speechService = new SpeechService();

