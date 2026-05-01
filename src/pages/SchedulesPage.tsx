import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import api from '../api/axios';
import { useLocalization } from '../hooks/useLocalization';

interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
}

interface Schedule {
  id: number;
  doctor_id: number;
  doctor_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
}

export const SchedulesPage = () => {
  const { t, interpolate } = useLocalization();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    doctor_id: '',
    day_of_week: '0',
    start_time: '09:00',
    end_time: '18:00',
    slot_duration: '30'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsRes, schedulesRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/schedules')
      ]);
      setDoctors(doctorsRes.data);
      setSchedules(schedulesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/schedules', {
        doctor_id: parseInt(formData.doctor_id),
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        slot_duration: parseInt(formData.slot_duration)
      });
      
      setShowForm(false);
      setFormData({
        doctor_id: '',
        day_of_week: '0',
        start_time: '09:00',
        end_time: '18:00',
        slot_duration: '30'
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.detail || t.schedules.createError);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.schedules.confirmDelete)) return;
    
    try {
      await api.delete(`/schedules/${id}`);
      loadData();
    } catch (error) {
      alert(t.schedules.deleteError);
    }
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.doctor_id]) {
      acc[schedule.doctor_id] = {
        doctor_name: schedule.doctor_name,
        schedules: []
      };
    }
    acc[schedule.doctor_id].schedules.push(schedule);
    return acc;
  }, {} as Record<number, { doctor_name: string; schedules: Schedule[] }>);

  if (loading) {
    return <div className="text-center py-8">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">{t.schedules.title}</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={20} className="mr-2" />
          {t.schedules.add}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">{t.schedules.new}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.schedules.doctor}
              </label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600"
                required
              >
                <option value="">{t.schedules.selectDoctor}</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} {doctor.specialty && `(${doctor.specialty})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.schedules.dayOfWeek}
              </label>
              <select
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600"
                required
              >
                {t.schedules.daysOfWeek.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Clock size={16} className="inline mr-1" />
                  {t.schedules.startTime}
                </label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Clock size={16} className="inline mr-1" />
                  {t.schedules.endTime}
                </label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t.schedules.slotDuration}
              </label>
              <select
                value={formData.slot_duration}
                onChange={(e) => setFormData({ ...formData, slot_duration: e.target.value })}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600"
                required
              >
                {t.schedules.slotOptions.map((label, index) => (
                  <option key={label} value={String((index + 1) * 15)}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {t.schedules.create}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {Object.keys(groupedSchedules).length === 0 ? (
        <Card>
          <div className="text-center py-8 text-text-muted">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t.schedules.emptyTitle}</p>
            <p className="text-sm mt-2">{t.schedules.emptySubtitle}</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedules).map(([doctorId, data]) => (
            <Card key={doctorId}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {data.doctor_name}
              </h3>
              <div className="space-y-3">
                {data.schedules
                  .sort((a, b) => a.day_of_week - b.day_of_week)
                  .map(schedule => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg border border-border-light"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <span className="font-medium text-text-primary">
                            {t.schedules.daysOfWeek[schedule.day_of_week]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted">
                          <Clock size={16} />
                          <span>
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                        <div className="text-sm text-text-muted">
                          {interpolate(t.schedules.slotsByDuration, { minutes: schedule.slot_duration })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
