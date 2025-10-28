import { useState, useEffect } from 'react';

export const useDate = () => {
    const [date, setDate] = useState(new Date());

    const dayOfYear = daysIntoYear(date);

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

