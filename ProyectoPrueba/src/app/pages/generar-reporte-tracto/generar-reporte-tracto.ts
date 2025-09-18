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
  currentUser: any;

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
    this.fleetService.getTrucks().subscribe({
      next: (trucks) => {
        this.trucks = trucks.filter(truck => truck.status === 'Disponible');
      },
      error: (error) => {
        console.error('Error loading trucks:', error);
      }
    });
  }

  getSelectedTruck(): Truck | null {
    const vehicleId = this.reportForm.get('vehicle_id')?.value;
    return this.trucks.find(truck => truck.id === parseInt(vehicleId)) || null;
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    this.isLoading = true;
    const selectedTruck = this.getSelectedTruck();
    
    const reportData: CreateReportRequest = {
      vehicle_type: 'TRACTO',
      vehicle_id: this.reportForm.value.vehicle_id,
      vehicle_number: selectedTruck?.truck_number || '',
      equipment_type: this.reportForm.value.equipment_type,
      failures: this.reportForm.value.failures
    };

    this.reportsService.createReport(reportData).subscribe({
      next: (response) => {
        console.log('Report created successfully:', response);
        // Show success message or redirect
        alert(`Reporte ${response.report_number} creado exitosamente`);
        this.router.navigate(['/consultar-reportes']);
      },
      error: (error) => {
        console.error('Error creating report:', error);
        alert('Error al crear el reporte');
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
