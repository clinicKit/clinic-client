import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { type Doctor, createDoctor, updateDoctor, deleteDoctor } from '../../api/doctors';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';

export const DoctorsTable = () => {
  const { t } = useLocalization();
  const { data: doctors, loading, refetch } = useApi<Doctor[]>('/doctors');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({ name: '', specialty: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (doctor?: Doctor) => {
    if (doctor) {
      setEditing(doctor);
      setFormData({ name: doctor.name, specialty: doctor.specialty || '' });
    } else {
      setEditing(null);
      setFormData({ name: '', specialty: '' });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
    setFormData({ name: '', specialty: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateDoctor(editing.id, formData);
      } else {
        await createDoctor(formData);
      }
      refetch();
      handleClose();
    } catch (err) {
      console.error('Failed to save doctor', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.tables.doctors.deleteConfirm)) return;
    try {
      await deleteDoctor(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete doctor', err);
    }
  };

  if (loading) {
    return <Card><div className="text-center py-8 text-text-muted">{t.common.loading}</div></Card>;
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{t.tables.doctors.title}</h2>
          <Button onClick={() => handleOpen()} size="sm">
            <Plus size={16} className="mr-1.5" />
            {t.tables.doctors.add}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.doctors.columns.name}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.doctors.columns.specialty}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.doctors.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {doctors?.map(doctor => (
                <tr key={doctor.id} className="border-b border-border-light hover:bg-bg-secondary transition-colors">
                  <td className="py-3 px-4 text-sm text-text-primary">{doctor.name}</td>
                  <td className="py-3 px-4 text-sm text-text-muted">{doctor.specialty || t.common.dash}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpen(doctor)}
                        className="p-1.5 text-accent-600 hover:bg-accent-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!doctors?.length && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-text-muted">
                    {t.tables.doctors.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? t.tables.doctors.edit : t.tables.doctors.add}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.tables.doctors.form.name}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t.tables.doctors.form.specialty}
            value={formData.specialty}
            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" loading={submitting}>
              {editing ? t.common.save : t.common.add}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
