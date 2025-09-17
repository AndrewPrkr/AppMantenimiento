export interface User {
  id: number;
  employee_number: number;
  full_name: string;
  role: 'Operador' | 'Mecanico' | 'Administrativo';
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  id: number;
  employee_number: number;
  full_name: string;
  role: string;
  accessToken: string;
}

export interface LoginRequest {
  employee_number: number;
  password: string;
}
