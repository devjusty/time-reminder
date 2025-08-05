import React, { useState, useEffect, useRef } from 'react';
import ReminderSettings from './components/ReminderSettings';
import About from './components/About';
import SettingsComponent from './components/SettingsComponent';
import Clock from './components/Clock';
import Header from './components/Header';
import ReminderInfo from './components/ReminderInfo';
import Dock from './components/Dock/Dock';
import RemindUntilSettings from './components/RemindUntilSettings';
import { LuSettings, LuMessageCircleQuestion } from 'react-icons/lu';

const App = () => {
    const [activePanel, setActivePanel] = useState(null);
    const settingsRef = useRef(null);
    const aboutRef = useRef(null);

    const handlePanelActivation = (panel) => {
        setActivePanel(panel);
    };

    const dockItems = [
        {
            icon: <LuSettings size={18} />,
            label: 'Settings',
            onClick: () =>
                activePanel === 'settings'
                    ? setActivePanel(null)
                    : handlePanelActivation('settings'),
        },
        {
            icon: <LuMessageCircleQuestion size={18} />,
            label: 'About',
            onClick: () =>
                activePanel === 'about'
                    ? setActivePanel(null)
                    : handlePanelActivation('about'),
        },
    ];

    // Handle keypress to open and close settings panel using 's' and 'esc' keys
    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === 's') {
                handlePanelActivation('settings');
            } else if (event.key === 'Escape') {
                setActivePanel(null);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    // Handle click outside to close panels
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only handle clicks if a panel is open
            if (!activePanel) return;

            // Check if click is on the backdrop (not on the panel content)
            if (activePanel === 'settings' && settingsRef.current && event.target === settingsRef.current) {
                setActivePanel(null);
            }
            // Check if click is on the backdrop (not on the panel content)
            else if (activePanel === 'about' && aboutRef.current && event.target === aboutRef.current) {
                setActivePanel(null);
            }
        };

        // Add event listener when a panel is open
        if (activePanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activePanel]);



    return (
        <div className="flex flex-col justify-center items-center h-screen max-w-[600px] mx-auto">
            <Header />
            <Clock />
            <ReminderSettings />
            <RemindUntilSettings />
            <ReminderInfo />

            {activePanel === 'settings' && (
                <div
                    ref={settingsRef}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <SettingsComponent />
                    </div>
                </div>
            )}
            {activePanel === 'about' && (
                <div
                    ref={aboutRef}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto p-6">
                        <About />
                    </div>
                </div>
            )}

            <div className="absolute bottom-2">
                <Dock items={dockItems} className="" />
            </div>
        </div>
    );
};

export default App;
