import { useState, useEffect } from 'react';

export const useDate = () => {
    const [date, setDate] = useState(new Date());

    // Calculate the day of the year
    const dayOfYear = daysIntoYear(date);

    // Update the date every second
    // TODO: Consider optimizing this to update less frequently, as the day of the year only changes once per day
    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Helper function to calculate the day of the year
    function daysIntoYear(date) {
        return (
            (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
                Date.UTC(date.getFullYear(), 0, 0)) /
            24 /
            60 /
            60 /
            1000
        );
    }

    return {
        date,
        dayOfYear
    };
}

