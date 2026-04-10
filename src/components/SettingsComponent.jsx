import { useSettings } from "../hooks/useSettings";
import { useSound } from "../hooks/useSound";
import ElasticSlider from "./ElasticSlider/ElasticSlider";
import RemindUntilSettings from "./RemindUntilSettings";

const SettingsComponent = () => {
    const { settings, updateSetting } = useSettings();
    const { previewSound } = useSound();

    // Theme handlers
    const toggleDarkMode = () => {
        updateSetting('darkMode', !settings.darkMode);
    };

    const toggleHourFormat = () => {
        const newFormat = settings.hourFormat === '12h' ? '24h' : '12h';
        updateSetting('hourFormat', newFormat);
    };

    // Sound handlers
    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        updateSetting('sound', {
            ...settings.sound,
            volume: newVolume
        });
    };

    const handleSoundToggle = () => {
        updateSetting('sound', {
            ...settings.sound,
            enabled: !settings.sound.enabled
        });
    };

    // const handleSoundSelection = (soundName) => {
    //     updateSetting('sound', {
    //         ...settings.sound,
    //         selectedSound: soundName
    //     });
    // };

    const handlePreviewSound = () => {
        previewSound();
    };

    return (
        <div className="bg-secondary p-4 rounded-md space-y-6">
            {/* Theme Settings Section */}
            <div className="space-y-3">
                <p className="text-md font-bold opacity-80">Display:</p>
                <label className="swap swap-rotate">
                    <input
                        type="checkbox"
                        className="theme-controller"
                        checked={settings.darkMode}
                        onChange={toggleDarkMode}
                    />
                    {/* sun icon */}
                    <svg
                        className="swap-on h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    {/* moon icon */}
                    <svg
                        className="swap-off h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>

                {/* Hour Format Toggle */}
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Time Format</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${settings.hourFormat === '12h' ? 'font-bold' : 'opacity-60'}`}>12h</span>
                            <input
                                type="checkbox"
                                checked={settings.hourFormat === '24h'}
                                onChange={toggleHourFormat}
                                className="toggle toggle-sm"
                            />
                            <span className={`text-sm ${settings.hourFormat === '24h' ? 'font-bold' : 'opacity-60'}`}>24h</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Divider */}
            <div className="divider my-2"></div>

            {/* Sound Settings Section */}
            <div className="space-y-3">
                <h2 className="text-md font-bold opacity-80">Sound:</h2>

                {/* Sound Enable/Disable Toggle */}
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Enable Sound</span>
                        <input
                            type="checkbox"
                            checked={settings.sound.enabled}
                            onChange={handleSoundToggle}
                            className="toggle toggle-primary"
                        />
                    </label>
                </div>

                {/* Volume Control */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Volume:</span>
                    </label>
                    <ElasticSlider
                        value={settings.sound.volume}
                        onChange={handleVolumeChange}
                        min="0"
                        max="100"
                        step="5"
                        disabled={!settings.sound.enabled}
                    />
                </div>

                {/* Sound Selection */}
                {/* <div className="form-control">
                    <label className="label">
                        <span className="label-text">Alarm Sound</span>
                    </label>
                    <div className="flex gap-2">
                        <button
                            className={`btn btn-sm ${
                                settings.sound.selectedSound === 'chime1'
                                    ? 'btn-primary'
                                    : 'btn-outline'
                            }`}
                            onClick={() => handleSoundSelection('chime1')}
                            disabled={!settings.sound.enabled}
                        >
                            Chime 1
                        </button>
                        <button
                            className={`btn btn-sm ${
                                settings.sound.selectedSound === 'double-chime'
                                    ? 'btn-primary'
                                    : 'btn-outline'
                            }`}
                            onClick={() => handleSoundSelection('double-chime')}
                            disabled={!settings.sound.enabled}
                        >
                            Double Chime
                        </button>
                    </div>
                </div> */}

                {/* Preview Button */}

                    <button
                        className="btn btn-outline btn-sm"
                        onClick={handlePreviewSound}
                        disabled={!settings.sound.enabled}
                    >
                        🔊 Test Sound
                    </button>

            </div>

            {/* Remind Until Settings */}
            <RemindUntilSettings />
        </div>
    );
};

export default SettingsComponent;
