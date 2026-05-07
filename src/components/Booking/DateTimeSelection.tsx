import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import type { TimeSlot } from '../../types/booking';

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  availableSlots: TimeSlot[];
  loadingSlots: boolean;
  availableDates: Record<string, number>;
  loadingDates: boolean;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  availableSlots,
  loadingSlots,
  availableDates,
  loadingDates,
  currentMonth,
  onMonthChange,
  onDateChange,
  onTimeChange,
}) => {
  const { t } = useLocalization();
  const [showCalendar, setShowCalendar] = useState(false);

  // Custom date formatter using translation data
  const formatSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = t.booking.dateTimeSelection.months[date.getMonth()];
    const year = date.getFullYear();
    const weekday = t.booking.dateTimeSelection.weekDaysFull[date.getDay() === 0 ? 6 : date.getDay() - 1];
    return { formatted: `${day} ${month.toLowerCase()} ${year} г.`, weekday };
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateAvailable(newDate)) {
      // Format date in local timezone to avoid timezone shift
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(newDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayStr}`;
      onDateChange(formattedDate);
      setShowCalendar(false);
    }
  };

  const changeMonth = (increment: number) => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = t.booking.dateTimeSelection.months;
    const weekDays = t.booking.dateTimeSelection.weekDays;

    // Adjust for Monday as first day of week
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    // Empty cells for days before month starts
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(date);
      // Format date in local timezone for comparison
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      const isSelected = selectedDate === dateString;
      const slotsCount = availableDates[dateString] || 0;
      const hasSlots = slotsCount > 0;
      
      days.push(
        <button
          key={day}
          onClick={() => isAvailable && handleDateSelect(day)}
          disabled={!isAvailable || !hasSlots}
          className={`
            relative h-12 rounded-md text-base font-medium transition-all
            ${isAvailable && hasSlots ? 'hover:bg-accent-100 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}
            ${isSelected ? 'bg-accent-600 text-white hover:bg-accent-700' : ''}
            ${!isAvailable || !hasSlots ? 'opacity-40' : ''}
          `}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span>{day}</span>
            {hasSlots && !isSelected && (
              <div className="flex gap-0.5 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-accent-600"></div>
              </div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 md:p-6 mt-2 w-full max-w-md mx-auto">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loadingDates}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            {loadingDates && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-600 border-t-transparent"></div>
            )}
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loadingDates}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-text-muted h-10 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 min-h-[300px]">
      <p className="text-lg text-text-primary mb-4">{t.booking.dateTimeSelection.title}</p>
      
      {/* Date Picker with Calendar */}
      <div>
        <label className="block text-base font-semibold text-text-primary mb-3">
          <Calendar className="inline mr-2" size={20} />
          {t.booking.dateTimeSelection.selectDate}
        </label>
        
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-left hover:border-accent-300 transition-all focus:outline-none focus:ring-2 focus:ring-accent-600"
          >
            {selectedDate ? (
              (() => {
                const { formatted, weekday } = formatSelectedDate(selectedDate);
                return (
                  <div>
                    <div className="font-medium text-text-primary">{formatted}</div>
                    <div className="text-sm text-text-muted mt-1">{weekday}</div>
                  </div>
                );
              })()
            ) : (
              <span className="text-text-muted">{t.booking.dateTimeSelection.selectDate}</span>
            )}
          </button>
          
          {showCalendar && (
            <div className="top-full left-0 mt-2 z-10">
              {renderCalendar()}
            </div>
          )}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
        <label className="block text-base font-semibold text-text-primary mb-3">
          <Clock className="inline mr-2" size={20} />
          {t.booking.dateTimeSelection.selectTime}
        </label>
          
          {loadingSlots ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
              <p className="text-sm text-text-muted mt-2">{t.booking.dateTimeSelection.loadingSlots}</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>{t.booking.dateTimeSelection.noSlots}</p>
              <p className="text-sm mt-2">{t.booking.dateTimeSelection.tryAnotherDate}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && onTimeChange(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedTime === slot.time
                      ? 'border-accent-600 bg-accent-50 text-accent-700'
                      : slot.available
                      ? 'border-gray-200 hover:border-accent-300 hover:bg-accent-50 text-text-primary'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDate && selectedTime && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ {t.booking.dateTimeSelection.selected}: {formatSelectedDate(selectedDate).formatted}, {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
}; 
