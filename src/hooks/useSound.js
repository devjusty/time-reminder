import { useState, useEffect } from "react";
import { CONFIG } from "../config";
import { useSettings } from "./useSettings";

export const useSound = () => {
    const { settings } = useSettings();
    const [isMounted, setIsMounted] = useState(false);
    const [alarmSound, setAlarmSound] = useState(null);
    const [endSound, setEndSound] = useState(null);

    // Initialize sounds
    useEffect(() => {
        setIsMounted(true);
        const alarm = new Audio(CONFIG.SOUNDS.ALARM_SOUND_PATH);
        const end = new Audio(CONFIG.SOUNDS.END_SOUND_PATH);
        setAlarmSound(alarm);
        setEndSound(end);
    }, []);

    // Update volume when settings change
    useEffect(() => {
        if (alarmSound && settings.sound) {
            alarmSound.volume = settings.sound.volume / 100;
        }
        if (endSound && settings.sound) {
            endSound.volume = settings.sound.volume / 100;
        }
    }, [alarmSound, endSound, settings.sound]);

    const playSound = (soundType = 'alarm') => {
        if (!isMounted || !settings.sound.enabled) return;
        
        const sound = soundType === 'alarm' ? alarmSound : endSound;
        if (sound) {
            try {
                sound.currentTime = 0; // Reset to beginning
                const playPromise = sound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing sound:', error);
                    });
                }
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        }
    };

    const previewSound = () => {
        playSound('alarm');
    };

    return {
        playSound,
        previewSound,
        volume: settings.sound?.volume || 50,
        enabled: settings.sound?.enabled || true
    };
}
