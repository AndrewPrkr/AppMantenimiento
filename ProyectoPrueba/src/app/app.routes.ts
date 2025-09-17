import { Routes } from '@angular/router';
import { LoginComponent } from './components/logincomponent/logincomponent';
import { AdminComponent } from './components/admincomponent/admincomponent'; 
import { Mecanicocomponent } from './components/mecanicocomponent/mecanicocomponent'; 
import { Operadorcomponent } from './components/operadorcomponent/operadorcomponent'; 
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['Administrativo'] }
  },
  { 
    path: 'mecanico', 
    component: Mecanicocomponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['Mecanico', 'Administrativo'] }
  },
  { 
    path: 'operador', 
    component: Operadorcomponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['Operador', 'Mecanico', 'Administrativo'] }
  },
  { path: 'unauthorized', redirectTo: '/login' },
  { path: '**', redirectTo: '/login' }
];
