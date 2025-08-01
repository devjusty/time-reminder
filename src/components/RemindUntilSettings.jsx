import React, { useState } from 'react';
import { useRemindUntil } from '../hooks/useRemindUntil';

const RemindUntilSettings = () => {
    const {
        remindUntil,
        updateRemindUntilTime,
        toggleRemindUntil,
        isValidTime,
    } = useRemindUntil();

    const [timeInput, setTimeInput] = useState(remindUntil.time);
    const [timeError, setTimeError] = useState('');

    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setTimeInput(newTime);

        // Clear error when user starts typing
        if (timeError) {
            setTimeError('');
        }
    };

    const handleTimeBlur = () => {
        if (timeInput !== remindUntil.time) {
            if (isValidTime(timeInput)) {
                updateRemindUntilTime(timeInput);
                setTimeError('');
            } else {
                setTimeError('Invalid time format. Use HH:MM (24-hour format)');
                // Reset to last valid time
                setTimeInput(remindUntil.time);
            }
        }
    };

    const handleToggle = () => {
        // Validate time before enabling
        // if (!remindUntil.enabled && !isValidTime(timeInput)) {
        //     setTimeError('Please enter a valid time before enabling');
        //     return;
        // }

        // Update time if it's different and valid
        if (timeInput !== remindUntil.time && isValidTime(timeInput)) {
            updateRemindUntilTime(timeInput);
        }

        toggleRemindUntil();
        setTimeError('');
    };

    return (
        <div className="p-4 border-t border-base-300">
            <div className="flex flex-col gap-4">
                <fieldset className="fieldset">

                        <legend className="fieldset-legend">
                            <div className="tooltip" data-tip="Automatically disable all reminders at a specific time">Remind Until</div>
                        </legend>

                    <label className="label cursor-pointer text-sm">
                        {remindUntil.enabled && (
                            <span className="ml-2 badge badge-accent badge-sm">
                                Active until {remindUntil.time}
                            </span>
                        )}
                        <input
                            type="checkbox"
                            checked={remindUntil.enabled}
                            onChange={handleToggle}
                            className="toggle toggle-primary"
                            />
                            {remindUntil.enabled ? 'Enabled' : 'Disabled'}
                    </label>
                </fieldset>

                {remindUntil.enabled && (
                    <div className="">
                        <label
                            className={`input ${timeError ? 'input-error' : ''}`}
                        >
                            <span className="label">Stop reminders at:</span>
                            <input
                                type="time"
                                value={timeInput}
                                onChange={handleTimeChange}
                                onBlur={handleTimeBlur}
                                placeholder="17:00"
                            />
                        </label>

                        {/* <span className="text-xs text-base-content opacity-50">
                            (24h format)
                        </span> */}
                    </div>
                )}
                {timeError && (
                    <label className="label text-sm">
                        <span className="label-text-alt text-error">
                            {timeError}
                        </span>
                    </label>
                )}

                {/* Status Information */}
                {remindUntil.enabled && (
                    <div className="toast toast-top toast-right">
                        <div className="alert alert-soft">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="stroke-current shrink-0 w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <span className="text-sm">
                                All reminders will automatically stop at{' '}
                                <strong>{remindUntil.time}</strong>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RemindUntilSettings;
