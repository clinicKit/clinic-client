export type ToothStatus = 'healthy' | 'caries' | 'filled' | 'implant' | 'missing' | 'observation';

export interface ToothData {
  status: ToothStatus;
  diagnosis_code?: string | null;
  notes?: string | null;
  updated_at?: string | null;
}

export interface TeethMap {
  [toothNumber: string]: ToothData;
}

export interface ToothHistoryItem {
  id: number;
  old_status: string | null;
  new_status: string | null;
  changed_by: number | null;
  changed_at: string;
}

export interface ToothImage {
  id: number;
  file_path: string;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
}

export interface MKB10Item {
  code: string;
  name: string;
}

export const STATUS_COLORS: Record<ToothStatus, string> = {
  healthy: '#10B981',
  caries: '#EF4444',
  filled: '#3B82F6',
  implant: '#8B5CF6',
  missing: '#6B7280',
  observation: '#F59E0B',
};

export const TOOTH_STATUSES: ToothStatus[] = ['healthy', 'caries', 'filled', 'implant', 'missing', 'observation'];

// FDI tooth numbers — upper jaw right to left, lower jaw left to right
export const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
export const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];
export const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
