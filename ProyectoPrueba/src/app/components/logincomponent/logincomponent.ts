import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Servicedate } from '../../services/servicedate';

@Component({
  selector: 'app-logincomponent',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './LoginComponent.html',
  styleUrl: './Logincomponent.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  date!: Observable<Date>;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private fecha: Servicedate
  ) {}

  ngOnInit(): void {
    this.date = this.fecha.currentTime$;
    
    this.loginForm = this.formBuilder.group({
      employee_number: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      employee_number: this.loginForm.value.employee_number,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error('Login error', error);
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        this.isLoading = false;
      }
    });
  }

  private redirectBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
    
    switch (userRole) {
      case 'Administrativo':
        this.router.navigate(['/admin']);
        break;
      case 'Mecanico':
        this.router.navigate(['/mecanico']);
        break;
      case 'Operador':
        this.router.navigate(['/operador']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
