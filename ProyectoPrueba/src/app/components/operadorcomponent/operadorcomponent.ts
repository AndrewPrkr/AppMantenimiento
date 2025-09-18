import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Servicedate } from '../../services/servicedate';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service'; // import your storage/auth service

@Component({
  selector: 'app-operadorcomponent',
  imports: [CommonModule],
  templateUrl: './operadorcomponent.html',
  styleUrl: './operadorcomponent.css'
})
export class Operadorcomponent implements OnInit {
  date!: Observable<Date>;
  fullName: string = ''; // add this

  constructor(
    private router: Router,
    private fecha: Servicedate,
    private storageService: StorageService // inject the service
  ) {}

  ngOnInit() {
    this.date = this.fecha.currentTime$;
    // Get user from storage (change depending on your actual field)
    const user = this.storageService.getUser();
    this.fullName = user?.full_name || ''; // adjust field name as stored in storage
  }

  logout() {
    // Clear session data with your auth/storage service
    this.storageService.clean(); // ensure this method wipes session and token
    this.router.navigate(['/login']); // redirect to login
  }

  goToTractoReporte() {
    this.router.navigate(['/generar-reporte-tracto']);
  }

  goToRemolqueReporte() {
    this.router.navigate(['/generar-reporte-remolque']);
  }

  goToConsultaReportes() {
    this.router.navigate(['/consultar-reportes']);
  }
}
