import React, { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  format,
  eachDayOfInterval,
  isSameMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventInfo } from './EventDetailModal';

interface Props {
  events: EventInfo[];
  onSelectEvent: (event: EventInfo) => void;
}

const EventCalendar: React.FC<Props> = ({ events, onSelectEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) =>
    events.filter(
      (event) =>
        new Date(event.start_date) <= day && new Date(event.end_date) >= day
    );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, -1))}
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(monthStart, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-600 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, monthStart);
          return (
            <div
              key={day.toISOString()}
              className={`h-24 border rounded-lg p-1 overflow-auto ${
                inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
              }`}
            >
              <div className="text-sm mb-1">{format(day, 'd')}</div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="text-xs truncate cursor-pointer text-bhred hover:underline"
                >
                  {event.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
