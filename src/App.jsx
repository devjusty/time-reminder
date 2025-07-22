import React, { useState } from 'react';
import ReminderSettings from './components/ReminderSettings';
import About from './components/About';
import DisplaySettings from './components/DisplaySettings';
import SoundSettings from './components/SoundSettings';
import Clock from './components/Clock';
import Dock from './components/Dock/Dock';
import {
    LuWallpaper,
    LuSettings,
    LuMessageCircleQuestion,
} from 'react-icons/lu';

const App = () => {
    const [activePanel, setActivePanel] = useState(null);

    const handlePanelActivation = (panel) => {
        setActivePanel(panel);
    };

    const dockItems = [
        {
            icon: <LuWallpaper size={18} />,
            label: 'Display Settings',
            onClick: () => activePanel === 'display' ? setActivePanel(null) : handlePanelActivation('display'),
        },
        {
            icon: <LuSettings size={18} />,
            label: 'Sound Settings',
            onClick: () => activePanel === 'sound' ? setActivePanel(null) : handlePanelActivation('sound'),
        },
        {
            icon: <LuMessageCircleQuestion size={18} />,
            label: 'About',
            onClick: () => activePanel === 'about' ? setActivePanel(null) : handlePanelActivation('about'),
        },
    ];

    return (
        <div className='flex flex-col justify-center items-center h-screen max-w-[600px] mx-auto'>
          <h1 className='text-2xl font-bold text-center'>TimeReminder</h1>
          <p className='text-center'>An alternative to typical alarms and timers. Get reminders at the top of the hour, bottom of the hour, or the sides.</p>
          <ReminderSettings />
          <Clock />
          {activePanel === 'display' && <DisplaySettings />}
          {activePanel === 'sound' && <SoundSettings />}
          {activePanel === 'about' && <About />}
          <Dock items={dockItems} />
        </div>
    );
};

export default App;
