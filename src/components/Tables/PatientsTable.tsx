import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { type Patient, createPatient, updatePatient, deletePatient } from '../../api/patients';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';

export const PatientsTable = () => {
  const { t } = useLocalization();
  const { data: patients, loading, refetch } = useApi<Patient[]>('/patients');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({ 
    phone: '', 
    first_name: '', 
    last_name: '', 
    consent_given: true 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (patient?: Patient) => {
    if (patient) {
      setEditing(patient);
      setFormData({ 
        phone: patient.phone, 
        first_name: patient.first_name, 
        last_name: patient.last_name || '', 
        consent_given: patient.consent_given 
      });
    } else {
      setEditing(null);
      setFormData({ phone: '', first_name: '', last_name: '', consent_given: true });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
    setFormData({ phone: '', first_name: '', last_name: '', consent_given: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updatePatient(editing.id, formData);
      } else {
        await createPatient(formData);
      }
      refetch();
      handleClose();
    } catch (err) {
      console.error('Failed to save patient', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.tables.patients.deleteConfirm)) return;
    try {
      await deletePatient(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete patient', err);
    }
  };

  if (loading) {
    return <Card><div className="text-center py-8 text-text-muted">{t.common.loading}</div></Card>;
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{t.tables.patients.title}</h2>
          <Button onClick={() => handleOpen()} size="sm">
            <Plus size={16} className="mr-1.5" />
            {t.tables.patients.add}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.patients.columns.firstName}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.patients.columns.lastName}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.patients.columns.phone}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.patients.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {patients?.map(patient => (
                <tr key={patient.id} className="border-b border-border-light hover:bg-bg-secondary transition-colors">
                  <td className="py-3 px-4 text-sm text-text-primary">{patient.first_name}</td>
                  <td className="py-3 px-4 text-sm text-text-primary">{patient.last_name || t.common.dash}</td>
                  <td className="py-3 px-4 text-sm text-text-muted">{patient.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpen(patient)}
                        className="p-1.5 text-accent-600 hover:bg-accent-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!patients?.length && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">
                    {t.tables.patients.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? t.tables.patients.edit : t.tables.patients.add}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.tables.patients.form.phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="79991234567"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.tables.patients.form.firstName}
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <Input
              label={t.tables.patients.form.lastName}
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="consent"
              checked={formData.consent_given}
              onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
              className="w-4 h-4 text-accent-600 border-border-light rounded focus:ring-accent-500"
            />
            <label htmlFor="consent" className="text-sm text-text-primary">
              {t.tables.patients.form.consent}
            </label>
          </div>
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
