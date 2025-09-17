import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Truck {
  id: number;
  truck_number: string;
  status: string;
}

export interface Remolque {
  id: number;
  remolque_number: string;
  type: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private apiUrl = 'http://localhost:3000/api/fleet';

  constructor(private http: HttpClient) { }

  getTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.apiUrl}/trucks`);
  }

  getRemolques(): Observable<Remolque[]> {
    return this.http.get<Remolque[]>(`${this.apiUrl}/remolques`);
  }
}
