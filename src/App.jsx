import React, { useState, useEffect, useRef } from 'react';
import ReminderSettings from './components/ReminderSettings';
import About from './components/About';
import SettingsComponent from './components/SettingsComponent';
import Clock from './components/Clock';
import ReminderInfo from './components/ReminderInfo';
import Dock from './components/Dock/Dock';
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
            <div className="flex items-center">
                <h1 className="text-2xl font-light tracking-widest">
                    TimeReminder
                </h1>
                <svg className='fill-none stroke-primary w-[32px] h-[32px]' viewBox="0 0 260 260">
                    <path className='fill-primary'
                        d="M90.203 189.427c0 2.965 1.976 4.941 4.94 4.941v4.941c-2.964 0-4.94 1.976-4.94 4.94 0 2.965 1.976 4.941 4.94 4.941 0 9.387 6.917 17.787 15.81 19.269 6.917 20.257 30.139 20.751 37.056 0 7.411-1.482 13.34-6.917 15.316-14.328 2.964.494 4.941-1.483 5.435-4.447.494-2.964-1.482-4.941-4.447-5.435v-4.94c2.965 0 4.941-1.977 4.941-4.941 0-2.965-1.976-4.941-4.941-4.941h-74.11Zm14.822-9.881h49.407v8.893l-49.407-3.459v-5.434Zm49.407-9.882h-49.407c-1.483-13.34-7.906-22.233-18.281-31.62-26.186-24.21-27.668-64.724-3.953-90.91 11.364-12.351 27.174-19.762 43.973-20.75 59.782-2.965 90.415 70.652 46.442 111.166-10.375 9.881-17.292 18.774-18.774 32.114Zm-32.609 59.289h15.81c-1.976 4.447-7.411 6.423-11.857 3.952-1.483-.988-2.965-1.976-3.953-3.952Zm22.727-9.882h-29.644c-4.941 0-9.387-3.952-9.881-8.893l48.419 3.459c-1.483 2.964-4.941 5.434-8.894 5.434Zm-39.525-19.268v-4.941l49.407 3.458v4.941l-49.407-3.458Zm59.288-20.257c0-13.834.494-20.751 15.81-34.585 30.139-27.668 32.115-74.605 4.447-104.743-27.668-30.139-74.605-32.115-104.743-4.447-30.138 27.668-32.115 74.605-4.447 104.743l4.447 4.447c14.822 13.834 15.316 20.257 15.316 34.585h69.17Z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="8"
                        d="M129.729 46.146v49.407h49.407"
                    />
                </svg>
            </div>
            <p className="text-center text-md py-4">
                An alternative to typical alarms and timers. <br /> Get
                reminders at the top of the hour, bottom of the hour, or the
                sides.
            </p>
            <Clock />
            <ReminderInfo />
            <ReminderSettings />

            {activePanel === 'settings' && (
                <div 
                    ref={settingsRef} 
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                >
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <SettingsComponent />
                    </div>
                </div>
            )}
            {activePanel === 'about' && (
                <div 
                    ref={aboutRef} 
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
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
