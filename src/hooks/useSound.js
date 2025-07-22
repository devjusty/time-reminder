import { useState, useEffect } from "react";
import { CONFIG } from "../config";

export const useSound = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        setIsMounted(true);
        const sound = new Audio(CONFIG.SOUNDS.ALARM_SOUND_PATH);
        setSound(sound);
    }, []);

    const playSound = () => {
        if (isMounted && sound) {
            sound.play();
        }
    };

    return {
        playSound,
    };
}
