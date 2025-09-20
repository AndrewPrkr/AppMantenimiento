import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { StorageService } from '../../services/storage.service';
import { Servicedate } from '../../services/servicedate';
import { Report } from '../../models/report.model';

@Component({
  selector: 'app-consultar-reportes',
  imports: [CommonModule],
  templateUrl: './consultar-reportes.html',
  styleUrl: './consultar-reportes.css',
})
export class ConsultarReportes implements OnInit {
  reports: Report[] = [];
  date!: Observable<Date>;
  currentUser: any;
  statusFilter = 'ALL';
  selectedDate: string = '';
  isLoading = true;
  errorMessage = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;

  statusOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'REVISION', label: 'En revisión' },
    { value: 'ASIGNADO', label: 'Asignados' },
    { value: 'FINALIZADO', label: 'Finalizados' },
  ];

  constructor(
    private reportsService: ReportsService,
    private storageService: StorageService,
    private router: Router,
    private fecha: Servicedate
  ) {}

  ngOnInit() {
    this.date = this.fecha.currentTime$;
    this.currentUser = this.storageService.getUser();
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.errorMessage = '';
    this.reportsService
      .getReportsPaginated(this.page, this.pageSize, this.statusFilter, this.selectedDate)
      .subscribe({
        next: (response) => {
          this.reports = response.reports;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar los reportes';
          this.isLoading = false;
        },
      });
  }

  onStatusChange(event: any) {
    this.statusFilter = event.target.value;
    this.page = 1;
    this.loadReports();
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.page = 1;
    this.loadReports();
  }

  pageLeft() {
    if (this.page > 1) {
      this.page--;
      this.loadReports();
    }
  }
  pageRight() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadReports();
    }
  }

  goBack() {
    this.router.navigate(['/operador']);
  }

  // For admin, optionally show all reports (if role is admin)
  isAdmin(): boolean {
    return this.currentUser?.role === 'Administrativo';
  }
}
