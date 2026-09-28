package com.wordconnect.multilingual

import android.media.MediaPlayer
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SoundPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var bgMediaPlayer: MediaPlayer? = null

    override fun getName(): String {
        return "NativeSoundPlayer"
    }

    @ReactMethod
    fun startBgMusic(volume: Double) {
        try {
            if (bgMediaPlayer != null) {
                if (!bgMediaPlayer!!.isPlaying) {
                    bgMediaPlayer!!.start()
                }
                return
            }
            val resId = reactContext.resources.getIdentifier("bg_music", "raw", reactContext.packageName)
            if (resId != 0) {
                val player = MediaPlayer.create(reactContext, resId)
                if (player != null) {
                    val vol = volume.toFloat().coerceIn(0f, 1f)
                    player.setVolume(vol, vol)
                    player.isLooping = true
                    player.start()
                    bgMediaPlayer = player
                }
            }
        } catch (e: Exception) {
            // Ignore
        }
    }

    @ReactMethod
    fun stopBgMusic() {
        try {
            bgMediaPlayer?.let {
                if (it.isPlaying) {
                    it.stop()
                }
                it.release()
            }
            bgMediaPlayer = null
        } catch (e: Exception) {
            bgMediaPlayer = null
        }
    }

    @ReactMethod
    fun playSound(name: String) {
        try {
            val resId = reactContext.resources.getIdentifier(name, "raw", reactContext.packageName)
            if (resId != 0) {
                val player = MediaPlayer.create(reactContext, resId)
                player?.setOnCompletionListener { mp ->
                    try {
                        mp.release()
                    } catch (e: Exception) {}
                }
                player?.start()
            }
        } catch (e: Exception) {
            // Ignore
        }
    }
}
