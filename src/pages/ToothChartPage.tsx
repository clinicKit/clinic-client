import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/axios';
import { Input } from '../components/ui/Input';
import { ToothSVG } from '../components/TeethChart/ToothSVG';
import { ToothModal } from '../components/TeethChart/ToothModal';
import { ToothContextMenu } from '../components/TeethChart/ToothContextMenu';
import { ToothLegend } from '../components/TeethChart/ToothLegend';
import { useLocalization } from '../hooks/useLocalization';
import type { ToothStatus, TeethMap } from '../types/teeth';

interface Patient {
  id: number;
  first_name: string;
  last_name: string | null;
  phone: string;
}

export const ToothChartPage = () => {
  const { t } = useLocalization();
  const [searchParams, setSearchParams] = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [teethData, setTeethData] = useState<TeethMap>({});
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState<number>(11);

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, toothNumber: 0 });

  // Load patients
  useEffect(() => {
    // Don't fetch when search is empty
    if (!search.trim()) {
      setPatients([]);
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await api.get('/patients', { params: { search } });
        setPatients(res.data);
      } catch (err) {
        console.error('Error loading patients:', err);
      }
    };

    fetchPatients();
  }, [search]);


  // Auto-select patient from URL params
  useEffect(() => {
    const patientId = searchParams.get('patient');
    if (patientId && patients.length > 0) {
      const patient = patients.find((p) => p.id === Number(patientId));
      if (patient) setSelectedPatient(patient);
    }
  }, [searchParams, patients]);

  // Load teeth data when patient is selected
  const loadTeeth = useCallback(async () => {
    if (!selectedPatient) return;
    setLoading(true);
    try {
      const res = await api.get(`/patients/${selectedPatient.id}/teeth`);
      setTeethData(res.data.teeth || {});
    } catch (err) {
      console.error('Error loading teeth:', err);
      setTeethData({});
    } finally {
      setLoading(false);
    }
  }, [selectedPatient]);

  useEffect(() => {
    loadTeeth();
  }, [loadTeeth]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchParams({ patient: String(patient.id) });
  };

  const handleToothClick = (toothNumber: number) => {
    setSelectedTooth(toothNumber);
    setModalOpen(true);
  };

  const handleContextMenu = (e: React.MouseEvent, toothNumber: number) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, toothNumber });
  };

  const handleStatusChange = async (toothNumber: number, status: ToothStatus) => {
    if (!selectedPatient) return;
    try {
      await api.put(`/patients/${selectedPatient.id}/teeth/${toothNumber}`, { status });
      await loadTeeth();
    } catch (err) {
      console.error('Error updating tooth:', err);
    }
  };

  const handleModalSave = async (toothNumber: number, status: ToothStatus, diagnosisCode?: string, notes?: string) => {
    if (!selectedPatient) return;
    try {
      await api.put(`/patients/${selectedPatient.id}/teeth/${toothNumber}`, {
        status,
        diagnosis_code: diagnosisCode || null,
        notes: notes || null,
      });
      await loadTeeth();
      setModalOpen(false);
    } catch (err) {
      console.error('Error saving tooth:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t.teeth.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.teeth.subtitle}</p>
      </div>

      {/* Patient Selector */}
      <div className="bg-white rounded-xl border border-border p-5">
        <label className="block text-sm font-semibold text-text-primary mb-3">{t.teeth.selectPatient}</label>

        <div className="relative mb-3">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            type="text"
            placeholder={t.teeth.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {!selectedPatient && (
          <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
            {!search ? (
              <p className="text-center text-sm text-text-muted py-4">
                {t.teeth.searchHint}
              </p>
            ) : patients.length === 0 ? (
              <p className="text-center text-sm text-text-muted py-4">{t.teeth.searchEmpty}</p>
            ) : (
              patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePatientSelect(p)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="font-medium text-text-primary">
                    {p.first_name} {p.last_name || ''}
                  </span>
                  <span className="text-text-muted">{p.phone}</span>
                </button>
              ))
            )}
          </div>
        )}

        {selectedPatient && (
          <div className="flex items-center justify-between bg-accent-50 rounded-lg p-3">
            <div>
              <p className="font-semibold text-text-primary">
                {selectedPatient.first_name} {selectedPatient.last_name || ''}
              </p>
              <p className="text-sm text-text-muted">{selectedPatient.phone}</p>
            </div>
            <button
              onClick={() => {
                setSelectedPatient(null);
                setTeethData({});
                setSearchParams({});
              }}
              className="text-sm text-accent-600 hover:underline"
            >
              {t.common.change}
            </button>
          </div>
        )}
      </div>

      {/* Tooth Chart */}
      {selectedPatient && (
        <div className="bg-white rounded-xl border border-border p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-600 mx-auto" />
              <p className="text-sm text-text-muted mt-3">{t.teeth.loading}</p>
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="mb-6">
                <ToothLegend />
              </div>

              {/* SVG Chart */}
              <ToothSVG
                teethData={teethData}
                onToothClick={handleToothClick}
                onToothContextMenu={handleContextMenu}
              />

              <p className="text-xs text-text-muted text-center mt-4">
                {t.teeth.clickHint}
              </p>
            </>
          )}
        </div>
      )}

      {/* No patient selected placeholder */}
      {!selectedPatient && (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <div className="text-6xl mb-4">🦷</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">{t.teeth.emptyTitle}</h3>
          <p className="text-sm text-text-muted">{t.teeth.emptySubtitle}</p>
        </div>
      )}

      {/* Tooth Modal */}
      <ToothModal
        isOpen={modalOpen}
        toothNumber={selectedTooth}
        patientId={selectedPatient?.id || 0}
        toothData={teethData[String(selectedTooth)] || null}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />

      {/* Context Menu */}
      <ToothContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        toothNumber={contextMenu.toothNumber}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onStatusChange={handleStatusChange}
        onOpenDetails={(num) => {
          setSelectedTooth(num);
          setModalOpen(true);
        }}
        onAddImage={(num) => {
          setSelectedTooth(num);
          setModalOpen(true);
        }}
      />
    </div>
  );
};
