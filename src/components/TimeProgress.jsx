import {  useClock } from '../hooks/useClock';
import { useDate } from '../hooks/useDate';


export default function TimeProgress() {
  const { hours, minutes } = useClock();

  const { dayOfYear } = useDate();

  const yearPercentage = Math.round(dayOfYear / 365 * 100);
  const dayPercentage = Math.round(hours / 24 * 100);
  const hourPercentage = Math.round(minutes / 60 * 100);

    return (
        <div className="flex items-center">
            <div className="flex flex-col items-center">
                <div
                    className="radial-progress"
                    style={{ '--value': yearPercentage }}
                    aria-valuenow={yearPercentage}
                    role="progressbar"
                >
                    Year
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div
                    className="radial-progress"
                    style={{ '--value': dayPercentage }}
                    aria-valuenow={dayPercentage}
                    role="progressbar"
                >
                    Day
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div
                    className="radial-progress"
                    style={{ '--value': hourPercentage }}
                    aria-valuenow={hourPercentage}
                    role="progressbar"
                >
                    Hour
                </div>
            </div>
        </div>
    );
}
