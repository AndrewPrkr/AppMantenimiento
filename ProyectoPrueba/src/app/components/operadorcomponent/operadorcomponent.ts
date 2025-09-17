import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operadorcomponent',
  imports: [],
  templateUrl: './operadorcomponent.html',
  styleUrl: './operadorcomponent.css'
})
export class Operadorcomponent {
  constructor(private router: Router) {}

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
