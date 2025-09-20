import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreateReportRequest, Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createReport(reportData: CreateReportRequest): Observable<Report> {
    console.log('Creating report with data:', reportData);
    return this.http.post<Report>(`${this.apiUrl}/reports`, reportData).pipe(
      tap(response => console.log('Report created:', response)),
      catchError(this.handleError)
    );
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`).pipe(
      tap(reports => console.log('Reports received:', reports)),
      catchError(this.handleError)
    );
  }

  getReportById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/reports/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Reports service error:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
  getReportsPaginated(page: number, pageSize: number, status: string, date: string): Observable<any> {
  let params: any = { page, pageSize };
  if (status && status !== 'ALL') params.status = status;
  if (date) params.date = date;
  return this.http.get<any>(`${this.apiUrl}/reports/paginated`, { params });
}

}

