import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { FleetService } from '../../services/fleet.service';
import { ReportsService } from '../../services/reports.service';
import { StorageService } from '../../services/storage.service';
import { Servicedate } from '../../services/servicedate';
import { Truck, EQUIPMENT_TYPES, CreateReportRequest } from '../../models/report.model';

@Component({
  selector: 'app-generar-reporte-tracto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generar-reporte-tracto.html',
  styleUrl: './generar-reporte-tracto.css'
})
export class GenerarReporteTracto implements OnInit {
  reportForm!: FormGroup;
  trucks: Truck[] = [];
  equipmentTypes = EQUIPMENT_TYPES;
  date!: Observable<Date>;
  isLoading = false;
  loadingTrucks = false;
  currentUser: any;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private fleetService: FleetService,
    private reportsService: ReportsService,
    private storageService: StorageService,
    private router: Router,
    private fecha: Servicedate
  ) {}

  ngOnInit() {
    this.date = this.fecha.currentTime$;
    this.currentUser = this.storageService.getUser();
    
    console.log('Current user:', this.currentUser);
    
    this.initializeForm();
    this.loadTrucks();
  }

  initializeForm() {
    this.reportForm = this.fb.group({
      vehicle_id: ['', Validators.required],
      equipment_type: ['', Validators.required],
      failures: this.fb.array([this.createFailureFormGroup()])
    });
  }

  createFailureFormGroup(): FormGroup {
    return this.fb.group({
      failure_description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get failuresArray(): FormArray {
    return this.reportForm.get('failures') as FormArray;
  }

  addFailure() {
    this.failuresArray.push(this.createFailureFormGroup());
  }

  removeFailure(index: number) {
    if (this.failuresArray.length > 1) {
      this.failuresArray.removeAt(index);
    }
  }

  loadTrucks() {
    this.loadingTrucks = true;
    this.errorMessage = '';
    
    this.fleetService.getTrucks().subscribe({
      next: (trucks) => {
        console.log('Loaded trucks:', trucks);
        this.trucks = trucks.filter(truck => truck.status === 'Disponible');
        this.loadingTrucks = false;
        
        if (this.trucks.length === 0) {
          this.errorMessage = 'No hay tractocamiones disponibles';
        }
      },
      error: (error) => {
        console.error('Error loading trucks:', error);
        this.errorMessage = 'Error al cargar los tractocamiones';
        this.loadingTrucks = false;
      }
    });
  }

  getSelectedTruck(): Truck | null {
    const vehicleId = this.reportForm.get('vehicle_id')?.value;
    if (!vehicleId) return null;
    return this.trucks.find(truck => truck.id === parseInt(vehicleId)) || null;
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const selectedTruck = this.getSelectedTruck();
    
    if (!selectedTruck) {
      this.errorMessage = 'Debe seleccionar un tractocamión válido';
      this.isLoading = false;
      return;
    }
    
    const reportData: CreateReportRequest = {
      vehicle_type: 'TRACTO',
      vehicle_id: parseInt(this.reportForm.value.vehicle_id),
      vehicle_number: selectedTruck.truck_number,
      equipment_type: this.reportForm.value.equipment_type,
      failures: this.reportForm.value.failures
    };

    console.log('Submitting report:', reportData);

    this.reportsService.createReport(reportData).subscribe({
      next: (response) => {
        console.log('Report created successfully:', response);
        alert(`Reporte ${response.report_number} creado exitosamente`);
        this.router.navigate(['/consultar-reportes']);
      },
      error: (error) => {
        console.error('Error creating report:', error);
        this.errorMessage = 'Error al crear el reporte: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/operador']);
  }
}