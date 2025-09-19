import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { FleetService } from '../../services/fleet.service';
import { ReportsService } from '../../services/reports.service';
import { StorageService } from '../../services/storage.service';
import { Servicedate } from '../../services/servicedate';
import { Remolque, CreateReportRequest, EQUIPMENT_TYPES } from '../../models/report.model';

@Component({
  selector: 'app-generar-reporte-remolque',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generar-reporte-remolque.html',
  styleUrl: './generar-reporte-remolque.css'
})
export class GenerarReporteRemolque implements OnInit {
  reportForm!: FormGroup;
  remolques: Remolque[] = [];
  filteredRemolques: Remolque[] = [];
  date!: Observable<Date>;
  isLoading = false;
  loadingRemolques = false;
  currentUser: any;
  errorMessage = '';

  remolqueTypes = EQUIPMENT_TYPES; // ['VOLTEO', 'PIPA', 'PLATAFORMA']

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
    this.loadRemolques();

    // Watch remolque type changes to filter dropdown
    this.reportForm.get('remolque_type')?.valueChanges.subscribe(type => {
      this.filteredRemolques = this.remolques.filter(r => r.type === type);
      // Reset vehicle_id when type changes
      this.reportForm.get('vehicle_id')?.setValue('');
    });
  }

  initializeForm() {
    this.reportForm = this.fb.group({
      remolque_type: ['', Validators.required],
      vehicle_id: ['', Validators.required],
      failures: this.fb.array([this.createFailureFormGroup()])
    });
    this.filteredRemolques = [];
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

  loadRemolques() {
    this.loadingRemolques = true;
    this.errorMessage = '';

    this.fleetService.getRemolques().subscribe({
      next: (remolques) => {
        this.remolques = remolques.filter(remolque => remolque.status === 'Disponible');
        this.loadingRemolques = false;
      },
      error: (error) => {
        console.error('Error loading remolques:', error);
        this.errorMessage = 'Error al cargar los remolques';
        this.loadingRemolques = false;
      }
    });
  }

  getSelectedRemolque(): Remolque | null {
    const vehicleId = this.reportForm.get('vehicle_id')?.value;
    if (!vehicleId) return null;
    return this.filteredRemolques.find(remolque => remolque.id === parseInt(vehicleId)) || null;
  }

  onSubmit() {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const selectedRemolque = this.getSelectedRemolque();

    if (!selectedRemolque) {
      this.errorMessage = 'Debe seleccionar un remolque válido';
      this.isLoading = false;
      return;
    }

    const reportData: CreateReportRequest = {
      vehicle_type: 'REMOLQUE',
      vehicle_id: parseInt(this.reportForm.value.vehicle_id),
      vehicle_number: selectedRemolque.remolque_number,
      equipment_type: this.reportForm.value.remolque_type,
      failures: this.reportForm.value.failures
    };

    this.reportsService.createReport(reportData).subscribe({
      next: (response) => {
        alert(`Reporte ${response.report_number} creado exitosamente`);
        this.router.navigate(['/consultar-reportes']);
      },
      error: (error) => {
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
