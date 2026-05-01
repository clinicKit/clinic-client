import { useState, useCallback, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { type DateClickArg, Draggable } from '@fullcalendar/interaction';
import { type EventClickArg, type DatesSetArg } from '@fullcalendar/core';
import { AppointmentModal } from './AppointmentModal';
import api from '../../api/axios';
import { type Appointment } from '../../api/appointments';
import { createAppointment, updateAppointment } from '../../api/appointments';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

interface Patient { id: number; first_name: string; phone: string; }
interface Service { id: number; name: string; duration_minutes: number; color: string; }

export const AppointmentCalendar = () => {
  const { t, formatTime, calendarLocale } = useLocalization();
  const calendarRef = useRef<FullCalendar>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [currentRange, setCurrentRange] = useState<{ start: string; end: string } | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  

  // Load patients, doctors, services for dragging
  useEffect(() => {
    Promise.all([
      api.get<Patient[]>('/patients').then(r => r.data),
      api.get<Service[]>('/services').then(r => r.data),
    ]).then(([p, /* d, */ s]) => {
      setPatients(p);
      // setDoctors(d);
      setServices(s);
    }).catch(err => console.error('Failed to load data', err));
  }, []);

  // Initialize draggable
  useEffect(() => {
    if (draggableRef.current) {
      new Draggable(draggableRef.current, {
        itemSelector: '.draggable-item',
        eventData: function (eventEl) {
          const data = JSON.parse(eventEl.getAttribute('data-event') || '{}');
          return data;
        }
      });
    }
  }, [patients, services]);

  const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    scheduled: { label: t.appointmentStatuses.scheduled, color: '#4A9A7C', bg: '#D4EDE3' },
    confirmed:  { label: t.appointmentStatuses.confirmed, color: '#3D7A64', bg: '#A8DBC8' },
    cancelled:  { label: t.appointmentStatuses.cancelled, color: '#C05555', bg: '#FDF0F0' },
    no_show:    { label: t.appointmentStatuses.no_show, color: '#7A5C3A', bg: '#FFF3E0' },
  };

  const fetchEvents = useCallback(async (start: string, end: string) => {
    try {
      const data = await api.get<Appointment[]>('/appointments', { params: { start, end } }).then(r => r.data);
      setEvents(data.map(a => ({
        id: a.id.toString(),
        title: `${a.patient_name || t.common.dash} · ${a.service_name || ''}`,
        start: a.start_time,
        end: a.end_time,
        backgroundColor:
          a.status === 'cancelled' ? '#E8A0A0' :
          a.status === 'no_show'   ? '#C4A0A0' :
          a.service_color || '#5BAA8E',
        borderColor: 'transparent',
        textColor: '#fff',
        extendedProps: a,
      })));
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  }, []);

  const handleDatesSet = (arg: DatesSetArg) => {
    const start = arg.start.toISOString();
    const end = arg.end.toISOString();
    setCurrentRange({ start, end });
    fetchEvents(start, end);
  };

  const handleDateClick = (arg: DateClickArg) => {
    setEditingAppointment(null);
    setSelectedDate(arg.dateStr);
    setModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    setEditingAppointment(arg.event.extendedProps as Appointment);
    setSelectedDate(null);
    setModalOpen(true);
  };

  const handleCloseModal = (updated?: boolean) => {
    setModalOpen(false);
    setEditingAppointment(null);
    setSelectedDate(null);
    if (updated && currentRange) {
      fetchEvents(currentRange.start, currentRange.end);
    }
  };

  const handleDrop = async (info: any) => {
    try {
      const draggedEl = info.draggedEl;
      const eventData = JSON.parse(draggedEl.getAttribute('data-event') || '{}');
      const { patient_id, doctor_id, service_id } = eventData;
      const start = info.date;

      // Format start time as local time string
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, '0');
      const day = String(start.getDate()).padStart(2, '0');
      const hours = String(start.getHours()).padStart(2, '0');
      const minutes = String(start.getMinutes()).padStart(2, '0');
      const startStr = `${year}-${month}-${day}T${hours}:${minutes}:00`;

      await createAppointment({
        patient_id,
        doctor_id,
        service_id,
        start_time: startStr,
        notes: '',
      } as any);

      // Refetch to show the real event from database
      if (currentRange) {
        fetchEvents(currentRange.start, currentRange.end);
      }
    } catch (err) {
      console.error('Failed to create appointment from drag', err);
    }
  };

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleEventDrop = async (info: any) => {
    try {
      const event = info.event;
      const appointmentId = Number(event.id);
      const newStart = event.start;
      const newEnd = event.end;

      await updateAppointment(appointmentId, {
        start_time: formatDateTime(newStart),
        end_time: formatDateTime(newEnd),
      });

      // Refetch to ensure consistency
      if (currentRange) {
        fetchEvents(currentRange.start, currentRange.end);
      }
    } catch (err) {
      console.error('Failed to update appointment', err);
      info.revert(); // Revert the event to its original position on error
    }
  };

  const handleEventResize = async (info: any) => {
    try {
      const event = info.event;
      const appointmentId = Number(event.id);
      const newStart = event.start;
      const newEnd = event.end;

      await updateAppointment(appointmentId, {
        start_time: formatDateTime(newStart),
        end_time: formatDateTime(newEnd),
      });

      // Refetch to ensure consistency
      if (currentRange) {
        fetchEvents(currentRange.start, currentRange.end);
      }
    } catch (err) {
      console.error('Failed to resize appointment', err);
      info.revert(); // Revert the event to its original size on error
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;
      if (window.innerWidth < 768) {
        calendarApi.changeView('listDay');
      } else {
        calendarApi.changeView('timeGridWeek');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial view
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewClick = () => {
    setEditingAppointment(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Calendar */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">{t.calendar.title}</h2>
          <div className="flex gap-2">
            <Button onClick={handleNewClick} size="sm" className="flex-1 sm:flex-none">
              <Plus size={16} className="mr-1.5" />
              {t.calendar.newAppointment}
            </Button>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-xl border border-border-light shadow-sm">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
            initialView={window.innerWidth < 768 ? 'listDay' : 'timeGridWeek'}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: window.innerWidth < 768 ? 'listDay,dayGridMonth' : 'listDay,timeGridWeek,dayGridMonth',
            }}
            buttonText={{
              today: t.calendar.buttons.today,
              month: t.calendar.buttons.month,
              week: t.calendar.buttons.week,
              listDay: t.calendar.buttons.day,
            }}
            listDayFormat={{ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }}
            height="auto"
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            locale={calendarLocale}
            firstDay={1}
            events={events}
            editable={true}
            droppable={true}
            dayMaxEvents={3}
            datesSet={handleDatesSet}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            drop={handleDrop}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={(arg) => {
              const isListView  = arg.view.type.startsWith('list');
              const isWeekView  = arg.view.type.startsWith('timeGrid');
              const isMonthView = arg.view.type === 'dayGridMonth';
              const status      = arg.event.extendedProps?.status as string | undefined;
              const statusMeta  = status ? STATUS_LABELS[status] : null;
              const isCancelled = status === 'cancelled';

              if (isListView) {
                return (
                  <div className="flex items-center gap-2 py-0.5 w-full cursor-pointer">
                    <span
                      className="font-medium truncate flex-1"
                      style={{ textDecoration: isCancelled ? 'line-through' : 'none', color: '#2C3E3A' }}
                    >
                      {arg.event.title}
                    </span>
                    {statusMeta && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          color: statusMeta.color,
                          background: statusMeta.bg,
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div className="text-xs leading-tight cursor-pointer overflow-hidden">
                  <div
                    className={`font-medium truncate ${isWeekView ? 'text-white' : 'text-black'}`}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      textDecoration: isCancelled ? 'line-through' : 'none',
                      opacity: isCancelled ? 0.75 : 1,
                    }}
                  >
                    {isMonthView && statusMeta && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: statusMeta.color,
                          marginRight: 4,
                          flexShrink: 0,
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                    {arg.event.title}
                  </div>
                  {!isListView && (
                    <div
                      className={`truncate ${isWeekView ? 'text-white/90' : 'text-text-muted-version-2'}`}
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.7rem'
                      }}
                    >
                      {formatTime(arg.event.start!.toISOString())} – {formatTime(arg.event.end!.toISOString())}
                    </div>
                  )}
                </div>
              );
            }}
            eventMinHeight={30}
            eventShortHeight={20}
            slotEventOverlap={false}
            nowIndicator={true}
            displayEventTime={true}
          />
        </div>

        <AppointmentModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          appointment={editingAppointment}
          preselectedDate={selectedDate}
        />
      </div>
    </div>
  );
};
