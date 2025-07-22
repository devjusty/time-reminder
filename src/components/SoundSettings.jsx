import { useState } from "react";
import ElasticSlider from "../components/ElasticSlider/ElasticSlider";

const SoundSettings = () => {
    const [currentVolume, setCurrentVolume] = useState(50);
     
    return (
        <div>
            <h2>Sound Settings</h2>
            <p>Current Volume: {currentVolume}</p>
            <ElasticSlider defaultValue={currentVolume} onChange={(e) => setCurrentVolume(e.target.value)} />
        </div>
    );
};  

export default SoundSettings;