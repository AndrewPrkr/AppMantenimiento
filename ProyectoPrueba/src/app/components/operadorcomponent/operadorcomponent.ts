import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Servicedate } from '../../services/servicedate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operadorcomponent',
  imports: [CommonModule],
  templateUrl: './operadorcomponent.html',
  styleUrl: './operadorcomponent.css'
})
export class Operadorcomponent {

    date!: Observable<Date>;
  
  constructor(private router: Router,private fecha: Servicedate) {}

  ngOnInit(){
    this.date = this.fecha.currentTime$;
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
