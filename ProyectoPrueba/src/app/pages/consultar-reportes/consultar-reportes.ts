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
  styleUrl: './consultar-reportes.css'
})
export class ConsultarReportes implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  date!: Observable<Date>;
  currentUser: any;
  selectedStatus: string = 'ALL';
  isLoading = true;

  statusOptions = [
    { value: 'ALL', label: 'Todos los reportes' },
    { value: 'REVISION', label: 'En revisión' },
    { value: 'ASIGNADO', label: 'Asignados' },
    { value: 'FINALIZADO', label: 'Finalizados' }
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
    this.reportsService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports;
        this.filterReports();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.isLoading = false;
      }
    });
  }

  filterReports() {
    if (this.selectedStatus === 'ALL') {
      this.filteredReports = this.reports;
    } else {
      this.filteredReports = this.reports.filter(report => report.status === this.selectedStatus);
    }
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.filterReports();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'REVISION':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASIGNADO':
        return 'bg-blue-100 text-blue-800';
      case 'FINALIZADO':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  goBack() {
    this.router.navigate(['/operador']);
  }
}
