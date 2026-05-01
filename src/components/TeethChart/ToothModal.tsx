import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Clock, FileText, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';
import type { ToothStatus, ToothData, ToothHistoryItem, ToothImage, MKB10Item } from '../../types/teeth';
import { STATUS_COLORS, TOOTH_STATUSES } from '../../types/teeth';
import api from '../../api/axios';

interface ToothModalProps {
  isOpen: boolean;
  toothNumber: number;
  patientId: number;
  toothData: ToothData | null;
  onClose: () => void;
  onSave: (toothNumber: number, status: ToothStatus, diagnosisCode?: string, notes?: string) => void;
}

export const ToothModal: React.FC<ToothModalProps> = ({
  isOpen,
  toothNumber,
  patientId,
  toothData,
  onClose,
  onSave,
}) => {
  const { t, interpolate, formatDateValue } = useLocalization();
  const [status, setStatus] = useState<ToothStatus>('healthy');
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<ToothHistoryItem[]>([]);
  const [images, setImages] = useState<ToothImage[]>([]);
  const [mkb10List, setMkb10List] = useState<MKB10Item[]>([]);
  const [mkb10Search, setMkb10Search] = useState('');
  const [showMkb10, setShowMkb10] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'history'>('info');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && toothNumber) {
      setStatus((toothData?.status as ToothStatus) || 'healthy');
      setDiagnosisCode(toothData?.diagnosis_code || '');
      setNotes(toothData?.notes || '');
      setActiveTab('info');
      loadHistory();
      loadImages();
      loadMkb10();
    }
  }, [isOpen, toothNumber, toothData]);

  const loadHistory = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/teeth/${toothNumber}/history`);
      setHistory(res.data);
    } catch { setHistory([]); }
  };

  const loadImages = async () => {
    try {
      const res = await api.get(`/patients/${patientId}/teeth/${toothNumber}/images`);
      setImages(res.data);
    } catch { setImages([]); }
  };

  const loadMkb10 = async () => {
    try {
      const res = await api.get('/reference/mkb10/stomatology');
      setMkb10List(res.data);
    } catch { setMkb10List([]); }
  };

  const handleSave = () => {
    onSave(toothNumber, status, diagnosisCode || undefined, notes || undefined);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/patients/${patientId}/teeth/${toothNumber}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadImages();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredMkb10 = mkb10List.filter(
    (item) =>
      item.code.toLowerCase().includes(mkb10Search.toLowerCase()) ||
      item.name.toLowerCase().includes(mkb10Search.toLowerCase())
  );

  if (!isOpen) return null;

  const apiUrl = api.defaults.baseURL?.replace('/api', '') || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            >
              {toothNumber}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{interpolate(t.teeth.toothLabel, { number: toothNumber })}</h2>
              <p className="text-sm text-text-muted">{t.teeth.statuses[status]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { key: 'info' as const, label: t.teeth.tabs.info, icon: FileText },
            { key: 'images' as const, label: t.teeth.tabs.images, icon: ImageIcon },
            { key: 'history' as const, label: t.teeth.tabs.history, icon: Clock },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'text-accent-600 border-b-2 border-accent-600'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">{t.teeth.form.status}</label>
                <div className="grid grid-cols-3 gap-2">
                  {TOOTH_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
                        status === s
                          ? 'border-gray-800 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[s] }} />
                      {t.teeth.statuses[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* MKB-10 Diagnosis */}
              <div className="relative">
                <label className="block text-sm font-semibold text-text-primary mb-2">{t.teeth.form.diagnosis}</label>
                <div
                  onClick={() => setShowMkb10(!showMkb10)}
                  className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <span className={diagnosisCode ? 'text-text-primary' : 'text-text-muted'}>
                    {diagnosisCode
                      ? `${diagnosisCode} — ${mkb10List.find((m) => m.code === diagnosisCode)?.name || ''}`
                      : t.teeth.form.selectDiagnosis}
                  </span>
                  <ChevronDown size={16} className="text-text-muted" />
                </div>

                {showMkb10 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder={t.teeth.form.diagnosisSearch}
                        value={mkb10Search}
                        onChange={(e) => setMkb10Search(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-600"
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto max-h-36">
                      <button
                        onClick={() => {
                          setDiagnosisCode('');
                          setShowMkb10(false);
                          setMkb10Search('');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-text-muted hover:bg-gray-50"
                      >
                        {t.teeth.form.noDiagnosis}
                      </button>
                      {filteredMkb10.map((item) => (
                        <button
                          key={item.code}
                          onClick={() => {
                            setDiagnosisCode(item.code);
                            setShowMkb10(false);
                            setMkb10Search('');
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                            diagnosisCode === item.code ? 'bg-accent-50 text-accent-700' : ''
                          }`}
                        >
                          <span className="font-medium">{item.code}</span>
                          <span className="text-text-muted ml-2">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">{t.teeth.form.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.teeth.form.notesPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-accent-400 hover:bg-accent-50 transition-colors"
              >
                <Upload size={32} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm font-medium text-text-primary">
                  {uploading ? t.teeth.images.uploadLoading : t.teeth.images.uploadPrompt}
                </p>
                <p className="text-xs text-text-muted mt-1">{t.teeth.images.uploadHelp}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />

              {images.length === 0 ? (
                <p className="text-center text-sm text-text-muted py-4">{t.teeth.images.empty}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={`${apiUrl}${img.file_path}`}
                        alt={img.file_name || t.teeth.images.fallbackName}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5">
                        {img.file_name || t.teeth.images.fallbackName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-center text-sm text-text-muted py-4">{t.teeth.history.empty}</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock size={16} className="text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        {h.old_status && (
                          <>
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[h.old_status as ToothStatus] || '#ccc' }}
                            />
                            <span className="text-text-muted">{t.teeth.statuses[h.old_status as ToothStatus] || h.old_status}</span>
                            <span className="text-text-muted">→</span>
                          </>
                        )}
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: STATUS_COLORS[h.new_status as ToothStatus] || '#ccc' }}
                        />
                        <span className="font-medium">{t.teeth.statuses[h.new_status as ToothStatus] || h.new_status}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        {formatDateValue(h.changed_at, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'info' && (
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t.common.save}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
