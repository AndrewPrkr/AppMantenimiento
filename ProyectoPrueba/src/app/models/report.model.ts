export interface Truck {
  id: number;
  truck_number: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  status: 'Disponible' | 'En_Mantenimiento' | 'Fuera_Servicio';
}

export interface Remolque {
  id: number;
  remolque_number: string;
  type: 'VOLTEO' | 'PIPA' | 'PLATAFORMA';
  brand: string;
  model: string;
  year: number;
  plate: string;
  status: 'Disponible' | 'En_Mantenimiento' | 'Fuera_Servicio';
}

export interface ReportFailure {
  id?: number;
  failure_description: string;
  failure_type?: string;
  mechanic_feedback?: string;
  is_resolved?: boolean;
}

export interface CreateReportRequest {
  vehicle_type: 'TRACTO' | 'REMOLQUE';
  vehicle_id: number;
  vehicle_number: string;
  equipment_type: string;
  failures: ReportFailure[];
}

export interface Report {
  id: number;
  report_number: string;
  vehicle_type: 'TRACTO' | 'REMOLQUE';
  vehicle_id: number;
  vehicle_number: string;
  equipment_type: string;
  operator_id: number;
  operator_name: string;
  status: 'REVISION' | 'ASIGNADO' | 'FINALIZADO';
  assigned_mechanic_id?: number;
  assigned_mechanic_name?: string;
  created_at: string;
  assigned_at?: string;
  completed_at?: string;
  failures: ReportFailure[];
}

export const EQUIPMENT_TYPES = ['VOLTEO', 'PIPA', 'PLATAFORMA'] as const;
