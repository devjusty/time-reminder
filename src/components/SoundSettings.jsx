import { useState } from "react";

const SoundSettings = () => {
    const [currentVolume, setCurrentVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);    
    
    return (
        <div>
            <h2>Sound Settings</h2>
            <p>Current Volume: {currentVolume}</p>
            <input type="range" min="0" max="100" value={currentVolume} onChange={(e) => setCurrentVolume(e.target.value)} />
            <p>Is Muted: {isMuted ? "Yes" : "No"}</p>
            <button onClick={() => setIsMuted(!isMuted)}>Toggle Mute</button>
        </div>
    );
};  

export default SoundSettings;