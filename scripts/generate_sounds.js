const fs = require("fs");
const path = require("path");

function createWavBuffer(sampleRate, samples) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    // Clamp to 16-bit signed range [-32768, 32767]
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const intSample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  return buffer;
}

const SAMPLE_RATE = 44100;

// 1. Victory / Winning Fanfare Sound (1.5 seconds)
function generateWinSound() {
  const duration = 1.6;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  // 4 ascending notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.3 },
    { freq: 659.25, start: 0.22, dur: 0.3 },
    { freq: 783.99, start: 0.44, dur: 0.35 },
    { freq: 1046.5, start: 0.70, dur: 0.85 },
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const endIdx = Math.min(totalSamples, Math.floor((n.start + n.dur) * SAMPLE_RATE));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const env = Math.exp(-t * 3.5) * Math.sin(Math.min(1, t * 80) * (Math.PI / 2));
      // fundamental + harmonic
      const val = (Math.sin(2 * Math.PI * n.freq * t) * 0.7 +
                   Math.sin(2 * Math.PI * n.freq * 2 * t) * 0.25 +
                   Math.sin(2 * Math.PI * n.freq * 3 * t) * 0.05) * env;
      samples[i] += val * 0.45;
    }
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

// 2. Losing / Defeat Sound (1.2 seconds)
function generateLoseSound() {
  const duration = 1.2;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  // 3 descending notes: E4 (329Hz), D4 (293Hz), C4 (261Hz) with gentle vibrato
  const notes = [
    { freq: 329.63, start: 0.0, dur: 0.35 },
    { freq: 293.66, start: 0.3, dur: 0.35 },
    { freq: 261.63, start: 0.6, dur: 0.55 },
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const endIdx = Math.min(totalSamples, Math.floor((n.start + n.dur) * SAMPLE_RATE));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const env = Math.exp(-t * 4.0);
      const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 6 * t);
      const val = (Math.sin(2 * Math.PI * n.freq * vibrato * t) * 0.75 +
                   Math.sin(2 * Math.PI * n.freq * 2 * t) * 0.2) * env;
      samples[i] += val * 0.4;
    }
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

// 3. Word Found / Match Sound (0.6 seconds)
function generateWordFoundSound() {
  const duration = 0.65;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  const notes = [
    { freq: 659.25, start: 0.0, dur: 0.3 },   // E5
    { freq: 987.77, start: 0.12, dur: 0.48 }, // B5
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const endIdx = Math.min(totalSamples, Math.floor((n.start + n.dur) * SAMPLE_RATE));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const env = Math.exp(-t * 5.5) * Math.sin(Math.min(1, t * 100) * (Math.PI / 2));
      const val = (Math.sin(2 * Math.PI * n.freq * t) * 0.6 +
                   Math.sin(2 * Math.PI * n.freq * 2 * t) * 0.3 +
                   Math.sin(2 * Math.PI * n.freq * 3 * t) * 0.1) * env;
      samples[i] += val * 0.45;
    }
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

// 4. Letter / Tap Click Sound (0.08 seconds)
function generateTapSound() {
  const duration = 0.09;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 600 - t * 4000;
    const env = Math.exp(-t * 60);
    samples[i] = Math.sin(2 * Math.PI * Math.max(80, freq) * t) * env * 0.5;
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

// 5. Coin Jingling Sound (0.5 seconds)
function generateCoinSound() {
  const duration = 0.55;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  const notes = [
    { freq: 1318.51, start: 0.0, dur: 0.25 }, // E6
    { freq: 1760.00, start: 0.08, dur: 0.45 }, // A6
  ];

  for (const n of notes) {
    const startIdx = Math.floor(n.start * SAMPLE_RATE);
    const endIdx = Math.min(totalSamples, Math.floor((n.start + n.dur) * SAMPLE_RATE));
    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      const env = Math.exp(-t * 7.5);
      const val = (Math.sin(2 * Math.PI * n.freq * t) * 0.7 +
                   Math.sin(2 * Math.PI * n.freq * 2.76 * t) * 0.2) * env;
      samples[i] += val * 0.4;
    }
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

// 6. Ambient / Background Relaxing Sound Loop (8.0 seconds)
function generateBgMusic() {
  const duration = 8.0;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);

  // Relaxing harmonic chord sequence (Fmaj9 -> Cmaj7 -> Dm7 -> Am7)
  const chords = [
    { time: 0.0, freqs: [174.61, 220.00, 261.63, 329.63] }, // F3, A3, C4, E4
    { time: 2.0, freqs: [130.81, 196.00, 246.94, 329.63] }, // C3, G3, B3, E4
    { time: 4.0, freqs: [146.83, 220.00, 261.63, 349.23] }, // D3, A3, C4, F4
    { time: 6.0, freqs: [110.00, 164.81, 220.00, 261.63] }, // A2, E3, A3, C4
  ];

  for (let c = 0; c < chords.length; c++) {
    const chord = chords[c];
    const startIdx = Math.floor(chord.time * SAMPLE_RATE);
    const endIdx = Math.floor((chord.time + 2.0) * SAMPLE_RATE);

    for (let i = startIdx; i < endIdx; i++) {
      const t = (i - startIdx) / SAMPLE_RATE;
      // Smooth attack and release envelope to seamlessly loop
      const env = Math.sin((t / 2.0) * Math.PI);

      let chordVal = 0;
      for (const f of chord.freqs) {
        // Soft warm sine tones
        chordVal += Math.sin(2 * Math.PI * f * t) * 0.22;
        chordVal += Math.sin(2 * Math.PI * f * 2 * t) * 0.06;
      }
      samples[i] += chordVal * env * 0.35;
    }
  }

  return createWavBuffer(SAMPLE_RATE, samples);
}

const outDir = path.join(__dirname, "../assets/sounds");
fs.writeFileSync(path.join(outDir, "win.wav"), generateWinSound());
fs.writeFileSync(path.join(outDir, "lose.wav"), generateLoseSound());
fs.writeFileSync(path.join(outDir, "word_found.wav"), generateWordFoundSound());
fs.writeFileSync(path.join(outDir, "tap.wav"), generateTapSound());
fs.writeFileSync(path.join(outDir, "coin.wav"), generateCoinSound());
fs.writeFileSync(path.join(outDir, "bg_music.wav"), generateBgMusic());

console.log("✓ Successfully generated all 6 game audio files in assets/sounds!");
