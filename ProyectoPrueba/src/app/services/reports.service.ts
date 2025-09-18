import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReportRequest, Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createReport(reportData: CreateReportRequest): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports`, reportData);
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`);
  }

  getReportById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/reports/${id}`);
  }

  updateReport(id: number, updateData: Partial<Report>): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/reports/${id}`, updateData);
  }
}