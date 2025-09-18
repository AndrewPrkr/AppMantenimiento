import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Truck, Remolque } from '../models/report.model';


@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.apiUrl}/fleet/trucks`);
  }

  getRemolques(): Observable<Remolque[]> {
    return this.http.get<Remolque[]>(`${this.apiUrl}/fleet/remolques`);
  }
}
