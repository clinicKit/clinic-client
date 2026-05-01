import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { type Service, createService, updateService, deleteService } from '../../api/services';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';

const COLORS = ['#5BAA8E', '#7BA3D9', '#E8A0A0', '#F4C95D', '#9B87C7', '#F28B82'];

export const ServicesTable = () => {
  const { t } = useLocalization();
  const { data: services, loading, refetch } = useApi<Service[]>('/services');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: '', duration_minutes: 30, color: COLORS[0] });
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (service?: Service) => {
    if (service) {
      setEditing(service);
      setFormData({ name: service.name, duration_minutes: service.duration_minutes, color: service.color });
    } else {
      setEditing(null);
      setFormData({ name: '', duration_minutes: 30, color: COLORS[0] });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditing(null);
    setFormData({ name: '', duration_minutes: 30, color: COLORS[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateService(editing.id, formData);
      } else {
        await createService(formData);
      }
      refetch();
      handleClose();
    } catch (err) {
      console.error('Failed to save service', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t.tables.services.deleteConfirm)) return;
    try {
      await deleteService(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete service', err);
    }
  };

  if (loading) {
    return <Card><div className="text-center py-8 text-text-muted">{t.common.loading}</div></Card>;
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{t.tables.services.title}</h2>
          <Button onClick={() => handleOpen()} size="sm">
            <Plus size={16} className="mr-1.5" />
            {t.tables.services.add}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.services.columns.name}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.services.columns.duration}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.services.columns.color}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">{t.tables.services.columns.actions}</th>
              </tr>
            </thead>
            <tbody>
              {services?.map(service => (
                <tr key={service.id} className="border-b border-border-light hover:bg-bg-secondary transition-colors">
                  <td className="py-3 px-4 text-sm text-text-primary">{service.name}</td>
                  <td className="py-3 px-4 text-sm text-text-muted">{service.duration_minutes} {t.common.minutesShort}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: service.color }} />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpen(service)}
                        className="p-1.5 text-accent-600 hover:bg-accent-50 rounded transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!services?.length && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">
                    {t.tables.services.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={handleClose} title={editing ? t.tables.services.edit : t.tables.services.add}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t.tables.services.form.name}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label={t.tables.services.form.duration}
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.tables.services.form.color}</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded border-2 transition-all ${formData.color === color ? 'border-accent-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
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
