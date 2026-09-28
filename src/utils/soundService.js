import { NativeModules, Platform, Vibration } from "react-native";

const { NativeSoundPlayer } = NativeModules;

// Sound keys mapped to Android raw resource names
const SOUND_RESOURCE_MAP = {
  bgMusic: "bg_music",
  win: "win",
  lose: "lose",
  wordFound: "word_found",
  tap: "tap",
  coin: "coin",
};

/**
 * Plays a one-shot sound effect
 */
export function playSound(soundKey, enabled = true) {
  if (!enabled) return;

  // Haptic vibration feedback
  if (Platform.OS !== "web") {
    try {
      if (soundKey === "tap") {
        Vibration.vibrate(10);
      } else if (soundKey === "win") {
        Vibration.vibrate([0, 40, 50, 70]);
      } else if (soundKey === "lose") {
        Vibration.vibrate([0, 60, 40, 60]);
      } else {
        Vibration.vibrate(20);
      }
    } catch (e) {}
  }

  // Native Android Media playback
  if (NativeSoundPlayer && NativeSoundPlayer.playSound) {
    try {
      const resName = SOUND_RESOURCE_MAP[soundKey] || soundKey;
      NativeSoundPlayer.playSound(resName);
    } catch (err) {
      // Ignore
    }
  }
}

/**
 * Background ambient music loop - plays repeatedly
 */
export function startBgMusic(enabled = true) {
  if (!enabled) {
    stopBgMusic();
    return;
  }

  if (NativeSoundPlayer && NativeSoundPlayer.startBgMusic) {
    try {
      NativeSoundPlayer.startBgMusic(0.35);
    } catch (err) {
      // Ignore
    }
  }
}

export function stopBgMusic() {
  if (NativeSoundPlayer && NativeSoundPlayer.stopBgMusic) {
    try {
      NativeSoundPlayer.stopBgMusic();
    } catch (err) {
      // Ignore
    }
  }
}

export function playWinSound(enabled = true) {
  playSound("win", enabled);
}

export function playLoseSound(enabled = true) {
  playSound("lose", enabled);
}

export function playWordFoundSound(enabled = true) {
  playSound("wordFound", enabled);
}

export function playTapSound(enabled = true) {
  playSound("tap", enabled);
}

export function playCoinSound(enabled = true) {
  playSound("coin", enabled);
}
