import React, { useState } from 'react';
import ReminderSettings from './components/ReminderSettings';
import About from './components/About';
import SettingsComponent from './components/SettingsComponent';
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
            icon: <LuSettings size={18} />,
            label: 'Settings',
            onClick: () => activePanel === 'settings' ? setActivePanel(null) : handlePanelActivation('settings'),
        },
        {
            icon: <LuMessageCircleQuestion size={18} />,
            label: 'About',
            onClick: () => activePanel === 'about' ? setActivePanel(null) : handlePanelActivation('about'),
        },
    ];

    return (
        <div className='flex flex-col justify-center items-center h-screen max-w-[600px] mx-auto'>
            <div className='flex items-center'>
          <h1 className='text-2xl font-light tracking-widest'>TimeReminder</h1>
          <img src="./src/assets/time-reminder-icon.png" alt="TimeReminder" width={32} height={32}  />
          </div>
          <p className='text-center text-md py-4'>
            An alternative to typical alarms and timers. <br />Get reminders at the top of the hour, bottom of the hour, or the sides.
            </p>
          <Clock />
          <ReminderSettings />
          {activePanel === 'settings' && <SettingsComponent />}
          {activePanel === 'about' && <About />}
          <div className="absolute bottom-2">
          <Dock items={dockItems} className=''/>
          </div>
        </div>
    );
};

export default App;
