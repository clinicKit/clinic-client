import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { type Appointment, createAppointment, updateAppointment, updateStatus } from '../../api/appointments';
import api from '../../api/axios';
import { useLocalization } from '../../hooks/useLocalization';
import { Trash2, CheckCircle } from 'lucide-react';

interface Patient { id: number; first_name: string; phone: string; }
interface Doctor { id: number; name: string; }
interface Service { id: number; name: string; duration_minutes: number; }

interface Props {
  isOpen: boolean;
  onClose: (updated?: boolean) => void;
  appointment: Appointment | null;
  preselectedDate: string | null;
}

export const AppointmentModal = ({ isOpen, onClose, appointment, preselectedDate }: Props) => {
  const isEditing = !!appointment;
  const { t } = useLocalization();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    service_id: '',
    start_time: '',
    notes: '',
  });

  // Загрузка справочников
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([
      api.get<Patient[]>('/patients').then(r => r.data),
      api.get<Doctor[]>('/doctors').then(r => r.data),
      api.get<Service[]>('/services').then(r => r.data),
    ]).then(([p, d, s]) => {
      setPatients(p);
      setDoctors(d);
      setServices(s);
    }).finally(() => setLoading(false));
  }, [isOpen]);

  // Заполнение формы
  useEffect(() => {
    if (appointment) {
      setForm({
        patient_id: String(appointment.patient_id),
        doctor_id: String(appointment.doctor_id),
        service_id: String(appointment.service_id),
        start_time: appointment.start_time.slice(0, 16),
        notes: appointment.notes || '',
      });
    } else if (preselectedDate) {
      const now = new Date();
      const defaultTime = `${preselectedDate}T${String(now.getHours()).padStart(2, '0')}:${String(Math.ceil(now.getMinutes() / 30) * 30).padStart(2, '0')}`;
      setForm({ patient_id: '', doctor_id: '', service_id: '', start_time: defaultTime, notes: '' });
    }
  }, [appointment, preselectedDate]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getEndTime = (): string => {
    if (!form.service_id || !form.start_time) return '';
    const service = services.find(s => s.id === Number(form.service_id));
    if (!service) return '';
    const start = new Date(form.start_time);
    start.setMinutes(start.getMinutes() + service.duration_minutes);
    // Format as YYYY-MM-DDTHH:MM:SS (local time, not UTC)
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const day = String(start.getDate()).padStart(2, '0');
    const hours = String(start.getHours()).padStart(2, '0');
    const minutes = String(start.getMinutes()).padStart(2, '0');
    const seconds = String(start.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        patient_id: Number(form.patient_id),
        doctor_id: Number(form.doctor_id),
        service_id: Number(form.service_id),
        // Send as Almaty timezone (UTC+5) - no conversion to UTC
        start_time: form.start_time + ':00',
        end_time: getEndTime(),
        notes: form.notes,
      };

      if (appointment) {
        await updateAppointment(appointment.id, payload);
      } else {
        await createAppointment(payload as any);
      }
      onClose(true);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!appointment) return;
    try {
      await updateStatus(appointment.id, status);
      onClose(true);
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()} title={isEditing ? t.calendar.modal.editTitle : t.calendar.modal.createTitle} size="lg">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-accent-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Пациент */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t.calendar.modal.patient}</label>
            <select
              value={form.patient_id}
              onChange={e => handleChange('patient_id', e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition-all"
            >
              <option value="">{t.calendar.modal.selectPatient}</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.first_name} · {p.phone}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Врач */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t.calendar.modal.doctor}</label>
              <select
                value={form.doctor_id}
                onChange={e => handleChange('doctor_id', e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition-all"
              >
                <option value="">{t.calendar.modal.selectDoctor}</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Услуга */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">{t.calendar.modal.service}</label>
              <select
                value={form.service_id}
                onChange={e => handleChange('service_id', e.target.value)}
                className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition-all"
              >
                <option value="">{t.calendar.modal.selectService}</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} {t.common.minutesShort})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Дата и время */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t.calendar.modal.startDateTime}</label>
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={e => handleChange('start_time', e.target.value)}
              className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition-all"
            />
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t.calendar.modal.notes}</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              rows={2}
              placeholder={t.calendar.modal.notesPlaceholder}
              className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition-all resize-none"
            />
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-between pt-2 border-t border-border-light">
            <div>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusChange('confirmed')}
                    disabled={appointment?.status === 'confirmed'}
                  >
                    <CheckCircle size={16} className="mr-1.5" />
                    {t.calendar.modal.confirm}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={appointment?.status === 'cancelled'}
                  >
                    <Trash2 size={16} className="mr-1.5" />
                    {t.calendar.modal.cancelAppointment}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => onClose()}>{t.common.cancel}</Button>
              <Button onClick={handleSubmit} loading={saving}>
                {isEditing ? t.common.save : t.common.create}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
