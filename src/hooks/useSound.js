import { useEffect, useRef } from 'react';
import { CONFIG } from '../config';
import { useSettings } from './useSettings';

export const useSound = () => {
    const { settings } = useSettings();
    const alarmSoundRef = useRef(null);
    const endSoundRef = useRef(null);

    // Initialize sounds
    useEffect(() => {
        alarmSoundRef.current = new Audio(CONFIG.SOUNDS.ALARM_SOUND_PATH);
        endSoundRef.current = new Audio(CONFIG.SOUNDS.END_SOUND_PATH);

        return () => {
            if (alarmSoundRef.current) {
                alarmSoundRef.current.pause();
                alarmSoundRef.current = null;
            }
            if (endSoundRef.current) {
                endSoundRef.current.pause();
                endSoundRef.current = null;
            }
        };
    }, []);

    // Update volume when settings change
    useEffect(() => {
        if (alarmSoundRef.current && settings.sound) {
            alarmSoundRef.current.volume = settings.sound.volume / 100;
        }
        if (endSoundRef.current && settings.sound) {
            endSoundRef.current.volume = settings.sound.volume / 100;
        }
    }, [settings.sound]);

    const playSound = (soundType = 'alarm') => {
        if (!settings.sound?.enabled) return;

        const sound =
            soundType === 'alarm' ? alarmSoundRef.current : endSoundRef.current;
        if (sound) {
            try {
                sound.currentTime = 0; // Reset to beginning
                const playPromise = sound.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
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
        enabled: settings.sound?.enabled || true,
    };
};
